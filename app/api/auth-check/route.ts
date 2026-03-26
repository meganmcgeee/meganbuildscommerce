import { NextRequest, NextResponse } from "next/server";
import {
  normalizeShopifyStoreDomain,
  SHOPIFY_ADMIN_API_VERSION,
  SHOPIFY_STOREFRONT_API_VERSION
} from "@/lib/shopify";

export const runtime = "nodejs";

const STOREFRONT_401_HINTS =
  "Use domain your-store.myshopify.com (not a custom storefront URL). " +
  "Token must be the Storefront API access token from Admin → Settings → Apps and sales channels → Develop apps → [app] → API credentials (not an Admin API token). " +
  "Match SHOPIFY_STOREFRONT_API_VERSION to a version your token supports, or set env SHOPIFY_STOREFRONT_API_VERSION.";

/**
 * Verify API credentials (Gemini + Shopify) without exposing secrets.
 * Optional: set AUTH_TEST_SECRET and pass ?secret=... or Authorization: Bearer ...
 */
export async function GET(req: NextRequest) {
  const requiredSecret = process.env.AUTH_TEST_SECRET?.trim();
  if (requiredSecret) {
    const q = req.nextUrl.searchParams.get("secret");
    const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (q !== requiredSecret && bearer !== requiredSecret) {
      return NextResponse.json(
        { error: "Unauthorized", hint: "Set ?secret= or Authorization: Bearer" },
        { status: 401 }
      );
    }
  }

  const gemini = await checkGemini();
  const shopifyAdmin = await checkShopifyAdmin();
  const shopifyStorefront = await checkShopifyStorefront();

  const storefrontAcceptable =
    shopifyStorefront.skipped === true || shopifyStorefront.ok;

  return NextResponse.json({
    ok: gemini.ok && shopifyAdmin.ok && storefrontAcceptable,
    gemini,
    shopifyAdmin,
    shopifyStorefront
  });
}

async function checkGemini(): Promise<{ ok: boolean; message: string }> {
  const key =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ??
    process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    return { ok: false, message: "No GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY" };
  }
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      const t = await res.text();
      return {
        ok: false,
        message: `Gemini rejected key (${res.status}): ${t.slice(0, 200)}`
      };
    }
    return { ok: true, message: "Gemini API key accepted (models list OK)" };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : String(e)
    };
  }
}

async function checkShopifyAdmin(): Promise<{ ok: boolean; message: string }> {
  const rawDomain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const token = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN?.trim();
  if (!rawDomain || !token) {
    return {
      ok: false,
      message: "Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_API_ACCESS_TOKEN"
    };
  }
  const domain = normalizeShopifyStoreDomain(rawDomain);
  try {
    const res = await fetch(
      `https://${domain}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": token
        },
        body: JSON.stringify({ query: "{ shop { name } }" }),
        cache: "no-store"
      }
    );
    const raw = await res.text();
    if (!res.ok) {
      return {
        ok: false,
        message: `Admin HTTP ${res.status}: ${raw.slice(0, 200)}`
      };
    }
    let json: {
      data?: { shop?: { name?: string } };
      errors?: { message: string }[];
    };
    try {
      json = JSON.parse(raw) as typeof json;
    } catch {
      return { ok: false, message: "Admin API returned non-JSON" };
    }
    if (json.errors?.length) {
      return {
        ok: false,
        message: json.errors.map((e) => e.message).join("; ")
      };
    }
    if (json.data?.shop?.name) {
      return {
        ok: true,
        message: `Admin API OK (shop reachable)`
      };
    }
    return { ok: false, message: "Unexpected Admin API response" };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : String(e)
    };
  }
}

async function checkShopifyStorefront(): Promise<{
  ok: boolean;
  message: string;
  skipped?: boolean;
}> {
  const rawDomain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const token = process.env.SHOPIFY_STOREFRONT_API_ACCESS_TOKEN?.trim();
  if (!rawDomain || !token) {
    return {
      ok: false,
      skipped: true,
      message: "SHOPIFY_STOREFRONT_API_ACCESS_TOKEN not set (optional for auth check)"
    };
  }
  const domain = normalizeShopifyStoreDomain(rawDomain);
  const domainHint =
    domain.includes("myshopify.com") === false
      ? " Warning: domain should usually be *.myshopify.com for API calls."
      : "";

  try {
    const res = await fetch(
      `https://${domain}/api/${SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": token
        },
        body: JSON.stringify({ query: "{ shop { name } }" }),
        cache: "no-store"
      }
    );
    const raw = await res.text();

    if (!res.ok) {
      if (res.status === 401) {
        return {
          ok: false,
          message: `${STOREFRONT_401_HINTS}${domainHint} (Response: ${raw.slice(0, 160)})`
        };
      }
      return {
        ok: false,
        message: `Storefront HTTP ${res.status}: ${raw.slice(0, 300)}${domainHint}`
      };
    }

    let json: {
      data?: { shop?: { name?: string } };
      errors?: { message: string }[];
    };
    try {
      json = JSON.parse(raw) as typeof json;
    } catch {
      return { ok: false, message: "Storefront returned non-JSON" };
    }
    if (json.errors?.length) {
      return {
        ok: false,
        message: json.errors.map((e) => e.message).join("; ")
      };
    }
    if (json.data?.shop?.name) {
      return { ok: true, message: "Storefront API token OK" };
    }
    return { ok: false, message: "Unexpected Storefront response" };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : String(e)
    };
  }
}
