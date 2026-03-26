type ToolBadgeProps = {
  name:
    | "get_product"
    | "list_products"
    | "get_inventory"
    | "update_metafield";
  status: "running" | "completed";
  meta?: Record<string, unknown>;
};

const labelMap: Record<ToolBadgeProps["name"], string> = {
  get_product: "Fetching product details",
  list_products: "Listing products (one page)",
  get_inventory: "Checking inventory",
  update_metafield: "Updating production status"
};

export default function ToolBadge({ name, status }: ToolBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium ${
        status === "running"
          ? "border-accent/60 bg-accent-soft/40 text-accent"
          : "border-border bg-background/80 text-muted"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "running" ? "bg-accent animate-pulse" : "bg-muted"
        }`}
      />
      <span className="uppercase tracking-[0.18em]">{labelMap[name]}</span>
    </span>
  );
}

