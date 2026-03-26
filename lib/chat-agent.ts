import {
  get_inventory,
  get_product,
  list_products,
  update_metafield
} from "@/lib/mcp";
import { resolveGeminiConfig, type GeminiConfig } from "@/lib/llm-config";
import { SHOPIFY_LLM_TOOLS } from "@/lib/llm-tools";
import type { LabContext } from "@/lib/lab-guardrails";

const SYSTEM_PROMPT = `You are a Shopify Technology copilot for Megan Sigsworth. Tools: get_product fetches ONE product by handle or id (never the whole catalog). list_products returns a single paginated slice (optional search query)—not a full export. get_inventory and update_metafield work on known product/variant GIDs. Be concise. After tool results, summarize in plain English. If a tool returns an error, explain what might be missing (env vars, wrong GID, permissions).`;

export type AgentStreamEvent =
  | { type: "assistant-delta"; content: string }
  | {
      type: "tool-start" | "tool-end";
      name:
        | "get_product"
        | "list_products"
        | "get_inventory"
        | "update_metafield";
      meta?: Record<string, unknown>;
      result?: unknown;
    }
  | {
      type: "tool-confirm-request";
      name: "update_metafield";
      summary: string;
      pendingWrite: PendingWriteConfirmation;
    };

export type ChatTurn = { role: "user" | "assistant"; content: string };

export type PendingWriteConfirmation = {
  tool: "update_metafield";
  args: {
    ownerId: string;
    namespace?: string;
    key?: string;
    type?: string;
    value: string;
  };
};

type AgentRunOptions = {
  context: LabContext;
  writeConfirmed?: boolean;
  pendingWrite?: PendingWriteConfirmation;
};

function isAdminTool(name: string): boolean {
  return (
    name === "list_products" ||
    name === "get_inventory" ||
    name === "update_metafield"
  );
}

async function dispatchTool(
  name: string,
  rawArgs: string | Record<string, unknown>,
  options: AgentRunOptions
): Promise<unknown> {
  let args: Record<string, unknown>;
  if (typeof rawArgs === "string") {
    try {
      args = JSON.parse(rawArgs || "{}") as Record<string, unknown>;
    } catch {
      return { error: "Invalid JSON arguments" };
    }
  } else {
    args = rawArgs;
  }

  if (options.context === "customer") {
    if (isAdminTool(name)) {
      return {
        error:
          "Admin tools are disabled in customer preview. Switch to merchant mode to use this tool."
      };
    }
    if (name === "get_product" && args.id) {
      return {
        error:
          "Customer preview supports get_product by handle only. Provide a product handle."
      };
    }
  }

  try {
    switch (name) {
      case "get_product":
        return await get_product({
          handle: args.handle as string | undefined,
          id: args.id as string | undefined
        });
      case "get_inventory":
        return await get_inventory({
          productId: args.productId as string | undefined,
          variantId: args.variantId as string | undefined
        });
      case "update_metafield":
        if (!options.writeConfirmed) {
          const pending: PendingWriteConfirmation = {
            tool: "update_metafield",
            args: {
              ownerId: String(args.ownerId ?? ""),
              namespace: args.namespace as string | undefined,
              key: args.key as string | undefined,
              type: args.type as string | undefined,
              value: String(args.value ?? "")
            }
          };
          return {
            requiresConfirmation: true,
            pendingWrite: pending,
            summary:
              `Confirm metafield write on ${pending.args.ownerId} ` +
              `to ${pending.args.namespace ?? "custom"}.${
                pending.args.key ?? "production_status"
              }=${pending.args.value}`
          };
        }
        if (!options.pendingWrite) {
          return {
            error:
              "Write confirmation is missing. Please confirm and retry."
          };
        }
        if (
          options.pendingWrite.tool !== "update_metafield" ||
          options.pendingWrite.args.ownerId !== String(args.ownerId ?? "") ||
          options.pendingWrite.args.value !== String(args.value ?? "")
        ) {
          return {
            error:
              "Confirmed write does not match pending write payload."
          };
        }
        return await update_metafield({
          ownerId: String(args.ownerId),
          namespace: args.namespace as string | undefined,
          key: args.key as string | undefined,
          type: args.type as string | undefined,
          value: String(args.value ?? "")
        });
      case "list_products": {
        const first =
          typeof args.first === "number"
            ? args.first
            : args.first != null
              ? Number(args.first)
              : undefined;
        return await list_products({
          first: Number.isFinite(first) ? first : undefined,
          query:
            typeof args.query === "string" ? args.query : undefined
        });
      }
      default:
        return { error: `Unknown tool: ${name}` };
    }
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : String(e)
    };
  }
}

function isToolName(
  n: string
): n is
  | "get_product"
  | "list_products"
  | "get_inventory"
  | "update_metafield" {
  return (
    n === "get_product" ||
    n === "list_products" ||
    n === "get_inventory" ||
    n === "update_metafield"
  );
}

type GeminiPart =
  | { text: string }
  | { functionCall: { name: string; args?: Record<string, unknown> } }
  | {
      functionResponse: {
        name: string;
        response: { result: unknown };
      };
    };

type GeminiContent = { role: "user" | "model"; parts: GeminiPart[] };

function toGeminiFunctionDeclarations(context: LabContext) {
  return SHOPIFY_LLM_TOOLS.filter((t) =>
    context === "merchant" ? true : t.name === "get_product"
  ).map((t) => ({
    name: t.name,
    description: t.description,
    parameters: t.parameters
  }));
}

async function geminiGenerate(
  config: GeminiConfig,
  contents: GeminiContent[],
  context: LabContext
) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    config.model
  )}:generateContent?key=${encodeURIComponent(config.apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      tools: [{ functionDeclarations: toGeminiFunctionDeclarations(context) }]
    })
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Gemini API ${res.status}: ${text.slice(0, 500)}`);
  }
  return JSON.parse(text) as {
    candidates?: Array<{ content?: { parts?: GeminiPart[] } }>;
  };
}

function historyToGeminiContents(history: ChatTurn[]): GeminiContent[] {
  return history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));
}

async function runGeminiAgent(
  config: GeminiConfig,
  history: ChatTurn[],
  onEvent: (e: AgentStreamEvent) => void,
  options: AgentRunOptions
) {
  const contents: GeminiContent[] = historyToGeminiContents(history);

  if (contents.length > 0 && contents[0].role === "model") {
    contents.unshift({
      role: "user",
      parts: [
        {
          text: "[Context] The chat UI showed a prior assistant message; continue from the user’s latest question."
        }
      ]
    });
  }

  const maxRounds = 8;
  for (let r = 0; r < maxRounds; r++) {
    const data = await geminiGenerate(config, contents, options.context);
    if (!data.candidates?.length) {
      onEvent({
        type: "assistant-delta",
        content:
          "No response from Gemini (empty candidates). Check LLM_MODEL and API key."
      });
      return;
    }
    const parts = data.candidates[0]?.content?.parts ?? [];

    const texts = parts.filter(
      (p): p is { text: string } => "text" in p && typeof p.text === "string"
    );

    const functionCalls = parts
      .filter(
        (
          p
        ): p is {
          functionCall: { name: string; args?: Record<string, unknown> };
        } => "functionCall" in p && p.functionCall != null
      )
      .map((p) => p.functionCall);

    if (functionCalls.length > 0) {
      contents.push({ role: "model", parts });

      const responseParts: GeminiPart[] = [];
      for (const fc of functionCalls) {
        const name = fc.name;
        if (!isToolName(name)) continue;
        onEvent({
          type: "tool-start",
          name,
          meta: { args: fc.args }
        });
        const result = await dispatchTool(name, fc.args ?? {}, options);
        if (
          result &&
          typeof result === "object" &&
          "requiresConfirmation" in result &&
          "summary" in result &&
          "pendingWrite" in result
        ) {
          const eventData = result as {
            requiresConfirmation: boolean;
            summary: string;
            pendingWrite: PendingWriteConfirmation;
          };
          if (!eventData.requiresConfirmation) {
            onEvent({ type: "tool-end", name, result });
            continue;
          }
          onEvent({
            type: "tool-confirm-request",
            name: "update_metafield",
            summary: eventData.summary,
            pendingWrite: eventData.pendingWrite
          });
          return;
        }
        onEvent({ type: "tool-end", name, result });
        responseParts.push({
          functionResponse: {
            name,
            response: { result }
          }
        });
      }
      if (responseParts.length > 0) {
        contents.push({ role: "user", parts: responseParts });
      }
      continue;
    }

    const out = texts.map((p) => p.text).join("\n").trim();
    if (out) onEvent({ type: "assistant-delta", content: out });
    return;
  }

  onEvent({
    type: "assistant-delta",
    content: "Stopped after maximum tool rounds. Try a simpler question."
  });
}

/** Gemini + Shopify tools; emits SSE-style events for the Lab UI. */
export async function runLlmShopifyAgent(
  history: ChatTurn[],
  onEvent: (e: AgentStreamEvent) => void,
  options: AgentRunOptions
): Promise<void> {
  const config = resolveGeminiConfig();
  await runGeminiAgent(config, history, onEvent, options);
}
