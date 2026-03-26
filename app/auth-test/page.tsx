"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

type CheckResult = {
  ok: boolean;
  gemini: { ok: boolean; message: string };
  shopifyAdmin: { ok: boolean; message: string };
  shopifyStorefront: { ok: boolean; message: string; skipped?: boolean };
};

export default function AuthTestPage() {
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const url = new URL("/api/auth-check", window.location.origin);
      if (secret.trim()) url.searchParams.set("secret", secret.trim());
      const headers: HeadersInit = {};
      if (secret.trim()) {
        headers.Authorization = `Bearer ${secret.trim()}`;
      }
      const res = await fetch(url.toString(), { headers });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? data.hint ?? res.statusText);
        return;
      }
      setResult(data as CheckResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [secret]);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link
          href="/"
          className="text-xs font-medium uppercase tracking-[0.25em] text-muted hover:text-foreground"
        >
          ← Home
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          API auth check
        </h1>
        <p className="mt-2 text-sm text-muted">
          Verifies <strong>Gemini</strong> and <strong>Shopify</strong> credentials
          from <code className="rounded bg-border/60 px-1">.env.local</code>. This is
          not user login—only server-side API keys.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-muted">
          Optional <code>AUTH_TEST_SECRET</code> (if set in env)
        </label>
        <input
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Secret (only if AUTH_TEST_SECRET is configured)"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          type="password"
          autoComplete="off"
        />
      </div>

      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background disabled:opacity-50"
      >
        {loading ? "Checking…" : "Run checks"}
      </button>

      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </p>
      )}

      {result && (
        <ul className="space-y-3 text-sm">
          <li
            className={`rounded-lg border p-3 ${
              result.gemini.ok ? "border-accent/40" : "border-red-500/30"
            }`}
          >
            <strong className="text-foreground">Gemini</strong>{" "}
            <span className="text-muted">{result.gemini.message}</span>
          </li>
          <li
            className={`rounded-lg border p-3 ${
              result.shopifyAdmin.ok ? "border-accent/40" : "border-red-500/30"
            }`}
          >
            <strong className="text-foreground">Shopify Admin</strong>{" "}
            <span className="text-muted">{result.shopifyAdmin.message}</span>
          </li>
          <li
            className={`rounded-lg border p-3 ${
              result.shopifyStorefront.skipped
                ? "border-border"
                : result.shopifyStorefront.ok
                  ? "border-accent/40"
                  : "border-red-500/30"
            }`}
          >
            <strong className="text-foreground">Shopify Storefront</strong>{" "}
            <span className="text-muted">{result.shopifyStorefront.message}</span>
          </li>
        </ul>
      )}
    </div>
  );
}
