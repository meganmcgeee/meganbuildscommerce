import { createHmac, timingSafeEqual } from "node:crypto";

export type LabContext = "customer" | "merchant";

export const LAB_MERCHANT_COOKIE = "lab_merchant_session";
const DEFAULT_TTL_SECONDS = 60 * 60 * 4; // 4 hours

type SessionPayload = {
  exp: number;
  nonce: string;
};

function toBase64Url(input: string): string {
  return Buffer.from(input, "utf-8").toString("base64url");
}

function fromBase64Url(input: string): string {
  return Buffer.from(input, "base64url").toString("utf-8");
}

function getSecret(): string {
  const secret = process.env.LAB_MERCHANT_SECRET?.trim();
  if (!secret) {
    throw new Error("Missing LAB_MERCHANT_SECRET");
  }
  return secret;
}

function sign(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function isMerchantModeEnabled(): boolean {
  return process.env.ENABLE_LAB_MERCHANT_MODE?.toLowerCase() !== "false";
}

export function createMerchantSessionToken(): string {
  const now = Math.floor(Date.now() / 1000);
  const ttl = Number(process.env.LAB_MERCHANT_TTL_SECONDS || DEFAULT_TTL_SECONDS);
  const payload: SessionPayload = {
    exp: now + (Number.isFinite(ttl) ? Math.max(60, ttl) : DEFAULT_TTL_SECONDS),
    nonce: Math.random().toString(36).slice(2)
  };

  const encoded = toBase64Url(JSON.stringify(payload));
  const mac = sign(encoded, getSecret());
  return `${encoded}.${mac}`;
}

export function verifyMerchantSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [encoded, mac] = token.split(".");
  if (!encoded || !mac) return false;

  const expected = sign(encoded, getSecret());
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return false;
  }

  let payload: SessionPayload;
  try {
    payload = JSON.parse(fromBase64Url(encoded)) as SessionPayload;
  } catch {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  return typeof payload.exp === "number" && payload.exp > now;
}

