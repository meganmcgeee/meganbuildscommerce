import { NextRequest, NextResponse } from "next/server";
import {
  createMerchantSessionToken,
  isMerchantModeEnabled,
  LAB_MERCHANT_COOKIE
} from "@/lib/lab-guardrails";

export const runtime = "nodejs";

type EnableBody = {
  authorized?: boolean;
};

export async function POST(req: NextRequest) {
  if (!isMerchantModeEnabled()) {
    return NextResponse.json(
      { ok: false, error: "Merchant mode is disabled." },
      { status: 403 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as EnableBody;
  if (body.authorized !== true) {
    return NextResponse.json(
      { ok: false, error: "Authorization checkbox must be confirmed." },
      { status: 400 }
    );
  }

  const token = createMerchantSessionToken();
  const response = NextResponse.json({ ok: true, context: "merchant" });
  response.cookies.set({
    name: LAB_MERCHANT_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Number(process.env.LAB_MERCHANT_TTL_SECONDS || 60 * 60 * 4)
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true, context: "customer" });
  response.cookies.set({
    name: LAB_MERCHANT_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
  return response;
}

