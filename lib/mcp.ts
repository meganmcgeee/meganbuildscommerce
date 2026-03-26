import {
  shopifyAdminFetch,
  shopifyStorefrontFetch,
  type ShopifyInventoryLevel,
  type ShopifyProductSummary
} from "./shopify";

const DEFAULT_METAFIELD_NAMESPACE = "custom";
const DEFAULT_METAFIELD_KEY = "production_status";

export type GetProductInput = {
  handle?: string;
  id?: string;
};

export type GetProductOutput = ShopifyProductSummary | null;

export type GetInventoryInput = {
  productId?: string;
  variantId?: string;
};

export type GetInventoryOutput = ShopifyInventoryLevel[];

export type UpdateMetafieldInput = {
  ownerId: string;
  namespace?: string;
  key?: string;
  type?: string;
  value: string;
};

export type UpdateMetafieldOutput = {
  success: boolean;
  metafieldId?: string;
  userErrors?: { field?: string[]; message: string }[];
};

export type ListProductsInput = {
  /** Max 50; default 25 */
  first?: number;
  /**
   * Shopify Admin search query (same syntax as admin search), e.g. `title:hoodie` or vendor.
   * Omit for a generic first page (recent / default order).
   */
  query?: string;
};

export type ListProductsProductRow = {
  id: string;
  title: string;
  handle: string;
  status: string;
};

export type ListProductsOutput = {
  products: ListProductsProductRow[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
  note: string;
};

export async function get_product(
  input: GetProductInput
): Promise<GetProductOutput> {
  if (!input.handle && !input.id) {
    throw new Error("get_product requires either handle or id");
  }

  if (input.handle) {
    const query = /* GraphQL */ `
      query GetProductByHandle(
        $handle: String!
        $namespace: String!
        $key: String!
      ) {
        product(handle: $handle) {
          id
          title
          handle
          tags
          availableForSale
          metafield(namespace: $namespace, key: $key) {
            namespace
            key
            value
          }
        }
      }
    `;

    type Res = {
      data: {
        product: {
          id: string;
          title: string;
          handle: string;
          tags: string[];
          availableForSale: boolean;
          metafield: { namespace: string; key: string; value: string } | null;
        } | null;
      };
    };

    const res = await shopifyStorefrontFetch<Res>(query, {
      handle: input.handle,
      namespace: DEFAULT_METAFIELD_NAMESPACE,
      key: DEFAULT_METAFIELD_KEY
    });

    const product = res.data.product;
    if (!product) return null;

    const metafields = product.metafield
      ? [product.metafield]
      : ([] as ShopifyProductSummary["metafields"]);

    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      availableForSale: product.availableForSale,
      tags: product.tags,
      metafields
    };
  }

  const query = /* GraphQL */ `
    query GetProductById(
      $id: ID!
      $namespace: String!
      $key: String!
    ) {
      product: product(id: $id) {
        id
        title
        handle
        tags
        status
        metafield(namespace: $namespace, key: $key) {
          namespace
          key
          value
        }
      }
    }
  `;

  type Res = {
    data: {
      product: {
        id: string;
        title: string;
        handle: string;
        tags: string[];
        status: string;
        metafield: { namespace: string; key: string; value: string } | null;
      } | null;
    };
  };

  const res = await shopifyAdminFetch<Res>(query, {
    id: input.id,
    namespace: DEFAULT_METAFIELD_NAMESPACE,
    key: DEFAULT_METAFIELD_KEY
  });

  const product = res.data.product;
  if (!product) return null;

  const metafields = product.metafield
    ? [product.metafield]
    : ([] as ShopifyProductSummary["metafields"]);

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    status: product.status,
    tags: product.tags,
    metafields
  };
}

export async function get_inventory(
  input: GetInventoryInput
): Promise<GetInventoryOutput> {
  if (!input.productId && !input.variantId) {
    throw new Error("get_inventory requires productId or variantId");
  }

  const queryByProduct = /* GraphQL */ `
    query GetInventoryByProduct($id: ID!) {
      product(id: $id) {
        variants(first: 50) {
          nodes {
            id
            inventoryItem {
              inventoryLevels(first: 10) {
                nodes {
                  available
                  location {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const queryByVariant = /* GraphQL */ `
    query GetInventoryByVariant($id: ID!) {
      variant: productVariant(id: $id) {
        inventoryItem {
          inventoryLevels(first: 10) {
            nodes {
              available
              location {
                name
              }
            }
          }
        }
      }
    }
  `;

  type Node = {
    available: number | null;
    location: { name: string };
  };

  if (input.productId) {
    type Res = {
      data: {
        product: {
          variants: { nodes: { inventoryItem: { inventoryLevels: { nodes: Node[] } } }[] };
        } | null;
      };
    };

    const res = await shopifyAdminFetch<Res>(queryByProduct, {
      id: input.productId
    });

    const product = res.data.product;
    if (!product) return [];

    const levels: ShopifyInventoryLevel[] = [];
    for (const variant of product.variants.nodes) {
      for (const level of variant.inventoryItem.inventoryLevels.nodes) {
        levels.push({
          locationName: level.location.name,
          availableQuantity: level.available
        });
      }
    }
    return levels;
  }

  type Res = {
    data: {
      variant: {
        inventoryItem: { inventoryLevels: { nodes: Node[] } };
      } | null;
    };
  };

  const res = await shopifyAdminFetch<Res>(queryByVariant, {
    id: input.variantId
  });

  const variant = res.data.variant;
  if (!variant) return [];

  return variant.inventoryItem.inventoryLevels.nodes.map(level => ({
    locationName: level.location.name,
    availableQuantity: level.available
  }));
}

export async function update_metafield(
  input: UpdateMetafieldInput
): Promise<UpdateMetafieldOutput> {
  const mutation = /* GraphQL */ `
    mutation SetProductionStatusMetafield(
      $metafields: [MetafieldsSetInput!]!
    ) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const namespace = input.namespace ?? DEFAULT_METAFIELD_NAMESPACE;
  const key = input.key ?? DEFAULT_METAFIELD_KEY;
  const type = input.type ?? "single_line_text_field";

  type Res = {
    data: {
      metafieldsSet: {
        metafields: { id: string }[];
        userErrors: { field?: string[]; message: string }[];
      };
    };
  };

  const res = await shopifyAdminFetch<Res>(mutation, {
    metafields: [
      {
        ownerId: input.ownerId,
        namespace,
        key,
        type,
        value: input.value
      }
    ]
  });

  const payload = res.data.metafieldsSet;
  return {
    success: payload.userErrors.length === 0,
    metafieldId: payload.metafields[0]?.id,
    userErrors: payload.userErrors
  };
}

const MAX_LIST_PRODUCTS = 50;

/**
 * List a single page of products from Admin API (not the full catalog).
 * Use optional `query` to narrow results; paginate with cursors in a follow-up if needed later.
 */
export async function list_products(
  input: ListProductsInput = {}
): Promise<ListProductsOutput> {
  const first = Math.min(
    Math.max(1, input.first ?? 25),
    MAX_LIST_PRODUCTS
  );

  const query = /* GraphQL */ `
    query ListProducts($first: Int!, $query: String) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            title
            handle
            status
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  type Res = {
    data: {
      products: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            handle: string;
            status: string;
          };
        }>;
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string | null;
        };
      };
    };
  };

  const searchQuery = input.query?.trim() ?? "";

  const res = await shopifyAdminFetch<Res>(query, {
    first,
    query: searchQuery.length > 0 ? searchQuery : null
  });

  const conn = res.data.products;
  const products: ListProductsProductRow[] = conn.edges.map((e) => ({
    id: e.node.id,
    title: e.node.title,
    handle: e.node.handle,
    status: e.node.status
  }));

  return {
    products,
    pageInfo: {
      hasNextPage: conn.pageInfo.hasNextPage,
      endCursor: conn.pageInfo.endCursor
    },
    note:
      "One page only. To drill into a single product, call get_product with a handle or id. Full-catalog export is not supported here."
  };
}

