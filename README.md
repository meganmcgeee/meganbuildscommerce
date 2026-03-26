# Megan Builds Commerce – Portfolio & Shopify MCP Lab

This is a high-performance portfolio site for **Megan Sigsworth, Shopify Technology Leader**, built with **Next.js App Router**, **TypeScript**, and **Tailwind CSS**. It showcases 10+ years of Shopify Plus and Node.js work across brands like Thrive Causemetics, Birdy Grey, Trellis clients, and Datumix, plus agency and app/AI experience. It also includes **The Lab**, a Shopify-aware chat surface powered by **Google Gemini** with an MCP-style agent wired around three tools:

- `list_products` — one paginated slice from Admin API (optional search query; not the full catalog)
- `get_product` — exactly one product by handle or Admin GID
- `get_inventory`
- `update_metafield` (targeting `custom.production_status` by default)

## Tech Stack

- Next.js 14 (App Router, RSC)
- React 18 + TypeScript
- Tailwind CSS
- Framer Motion (lightweight reveals)

## Running Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

### Test API credentials (Gemini + Shopify)

There is no user login on this site—only server-side keys. To verify them:

1. Visit **`/auth-test`** and click **Run checks**, or  
2. `GET /api/auth-check` (same checks as JSON).

Optional: set **`AUTH_TEST_SECRET`** in `.env.local` and pass `?secret=...` or `Authorization: Bearer ...` so the check endpoint isn’t public on production.

## Environment Variables

Create a `.env.local` file at the project root with:

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_API_ACCESS_TOKEN=xxx
SHOPIFY_STOREFRONT_API_ACCESS_TOKEN=xxx
```

**LLM (Gemini only)**

```bash
GOOGLE_GENERATIVE_AI_API_KEY=...   # or GEMINI_API_KEY=...
# Optional:
LLM_MODEL=gemini-2.5-flash
```

**Lab guardrails (customer vs merchant)**

```bash
# Required to sign merchant-mode session cookies:
LAB_MERCHANT_SECRET=replace-with-long-random-secret

# Optional (default true): disable merchant mode on public deploys
ENABLE_LAB_MERCHANT_MODE=true

# Optional (default 14400 / 4h)
LAB_MERCHANT_TTL_SECONDS=14400
```

Shopify vars are only used in server-side utilities in `lib/shopify.ts`. The Gemini key is only used in `lib/chat-agent.ts` / the chat API route and must **not** be exposed to the client.

**Storefront API 401:** Use `SHOPIFY_STORE_DOMAIN=your-shop.myshopify.com` (not a public custom domain). The value in `SHOPIFY_STOREFRONT_API_ACCESS_TOKEN` must be the **Storefront API** access token from your custom app’s API credentials—not the Admin API token. You can align API versions with `SHOPIFY_STOREFRONT_API_VERSION` (default `2025-01` in code).

## Shopify MCP Tools

Tool wrappers live in `lib/mcp.ts`:

- **`get_product`** – fetches high-level product details and a key metafield for a given handle or ID.
- **`get_inventory`** – summarizes inventory across locations for a product or variant.
- **`update_metafield`** – writes to `custom.production_status` (namespace `custom`, key `production_status` by default) on a product.

## Guardrails model

- **Customer mode (default)**: Storefront-safe. The agent can only use `get_product` by **handle**.
- **Merchant mode**: Enabled through explicit click workflow in the Lab UI and a signed HttpOnly cookie (`/api/lab/merchant-session`).
- **Server enforcement**: `/api/chat/stream` validates the merchant cookie and downgrades invalid merchant claims to customer mode.
- **Write safety**: `update_metafield` requires an explicit confirmation click from the UI before execution.
- **Production recommendation**: Set `ENABLE_LAB_MERCHANT_MODE=false` on public marketing deployments unless you add stronger auth (password, SSO, allowlist).

`app/api/chat/stream/route.ts` exposes a streaming endpoint that emits:

- `assistant-delta` chunks for incremental assistant text
- `tool-start` / `tool-end` events for tools (`get_product`, `get_inventory`, `update_metafield`)

The client-side chat UI in `components/ChatWindow.tsx` consumes this stream and renders **Tool Call** badges to visualize when the agent is “checking inventory” or “updating metafields”.

## Performance Notes

- All marketing content is rendered via the App Router using RSC.
- Animations are scoped and guarded by `prefers-reduced-motion`.
- No client-side data fetching is used for static sections.
- Images/logos are text-only for now to keep the bundle lean; you can swap in optimized SVGs or `next/image` assets as needed.

