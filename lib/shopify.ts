/** Override with SHOPIFY_ADMIN_API_VERSION / SHOPIFY_STOREFRONT_API_VERSION if needed. */
export const SHOPIFY_ADMIN_API_VERSION =
  process.env.SHOPIFY_ADMIN_API_VERSION?.trim() || "2025-01";
export const SHOPIFY_STOREFRONT_API_VERSION =
  process.env.SHOPIFY_STOREFRONT_API_VERSION?.trim() || "2025-01";

/**
 * Storefront + Admin GraphQL must use the shop’s **myshopify.com** host, not a custom domain.
 */
export function normalizeShopifyStoreDomain(raw: string): string {
  let d = raw.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, "");
  d = d.split("/")[0] ?? d;
  d = d.replace(/\.$/, "");
  return d;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function shopifyFetch<T>(
  endpoint: string,
  options: RequestInit
): Promise<T> {
  const res = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    cache: "no-store"
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Shopify request failed (${res.status} ${res.statusText}): ${text}`
    );
  }

  return (await res.json()) as T;
}

export async function shopifyAdminFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const domain = normalizeShopifyStoreDomain(requiredEnv("SHOPIFY_STORE_DOMAIN"));
  const token = requiredEnv("SHOPIFY_ADMIN_API_ACCESS_TOKEN");

  const endpoint = `https://${domain}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`;

  return shopifyFetch<T>(endpoint, {
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": token
    },
    body: JSON.stringify({ query, variables })
  });
}

export async function shopifyStorefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const domain = normalizeShopifyStoreDomain(requiredEnv("SHOPIFY_STORE_DOMAIN"));
  const token = requiredEnv("SHOPIFY_STOREFRONT_API_ACCESS_TOKEN");

  const endpoint = `https://${domain}/api/${SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`;

  return shopifyFetch<T>(endpoint, {
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": token
    },
    body: JSON.stringify({ query, variables })
  });
}

export type ShopifyProductSummary = {
  id: string;
  title: string;
  handle: string;
  /** Admin API product status when fetched by ID */
  status?: string | null;
  /** Storefront API */
  availableForSale?: boolean;
  tags?: string[];
  metafields?: { namespace: string; key: string; value: string }[];
};

export type ShopifyInventoryLevel = {
  locationName: string;
  availableQuantity: number | null;
};

