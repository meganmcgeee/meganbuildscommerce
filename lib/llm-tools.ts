/**
 * Tool specs for Shopify helpers (Gemini `functionDeclarations` JSON Schema).
 */
export type LlmToolSpec = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
};

export const SHOPIFY_LLM_TOOLS: LlmToolSpec[] = [
  {
    name: "get_product",
    description:
      "Fetch exactly ONE Shopify product by storefront handle (slug) or Admin GraphQL product ID—one product per call, not a catalog browse. Prefer handle when the user mentions a URL slug. For many products or search, use list_products instead.",
    parameters: {
      type: "object",
      properties: {
        handle: {
          type: "string",
          description: "Storefront product handle, e.g. blue-widget"
        },
        id: {
          type: "string",
          description: "Admin API GID, e.g. gid://shopify/Product/123456789"
        }
      }
    }
  },
  {
    name: "list_products",
    description:
      "List ONE page of products from the store via Admin API (max 50 per call). Optional search query uses Shopify admin search syntax (e.g. title:foo, vendor:Acme). Does not return the entire catalog—only a single page; use get_product for full detail on one SKU.",
    parameters: {
      type: "object",
      properties: {
        first: {
          type: "number",
          description: "Page size, 1–50 (default 25)"
        },
        query: {
          type: "string",
          description:
            "Optional Admin search query string to narrow results; omit for a generic first page"
        }
      }
    }
  },
  {
    name: "get_inventory",
    description:
      "Fetch inventory levels by location for a product or variant. Requires Admin API product GID or variant GID.",
    parameters: {
      type: "object",
      properties: {
        productId: {
          type: "string",
          description: "Product GID from Admin API"
        },
        variantId: {
          type: "string",
          description: "Product variant GID from Admin API"
        }
      }
    }
  },
  {
    name: "update_metafield",
    description:
      "Set a product metafield (default namespace custom, key production_status). ownerId must be a Product GID.",
    parameters: {
      type: "object",
      properties: {
        ownerId: {
          type: "string",
          description: "Product GID, e.g. gid://shopify/Product/123"
        },
        namespace: { type: "string", description: "Metafield namespace" },
        key: { type: "string", description: "Metafield key" },
        type: {
          type: "string",
          description: "Shopify metafield type, e.g. single_line_text_field"
        },
        value: { type: "string", description: "Metafield value to store" }
      },
      required: ["ownerId", "value"]
    }
  }
];
