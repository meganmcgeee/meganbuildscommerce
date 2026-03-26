import { NextRequest } from "next/server";
import {
  runLlmShopifyAgent,
  type ChatTurn,
  type PendingWriteConfirmation
} from "@/lib/chat-agent";
import { hasGeminiCredentials } from "@/lib/llm-config";
import { get_inventory, get_product, update_metafield } from "@/lib/mcp";
import {
  type LabContext,
  isMerchantModeEnabled,
  LAB_MERCHANT_COOKIE,
  verifyMerchantSessionToken
} from "@/lib/lab-guardrails";

type InboundMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatRequestBody = {
  messages: InboundMessage[];
  context?: LabContext;
  writeConfirmed?: boolean;
  pendingWrite?: PendingWriteConfirmation;
};

/** Node runtime: Shopify Admin API + LLM HTTP calls. */
export const runtime = "nodejs";

function sendEvent(
  encoder: TextEncoder,
  controller: ReadableStreamDefaultController<Uint8Array>,
  event: unknown
) {
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
}

function toChatTurns(messages: InboundMessage[]): ChatTurn[] {
  return messages
    .filter(
      (m): m is InboundMessage & { role: "user" | "assistant" } =>
        m.role === "user" || m.role === "assistant"
    )
    .map((m) => ({
      role: m.role,
      content: m.content
    }));
}

/** When no LLM keys: keyword heuristics + real Shopify calls when possible. */
async function runHeuristicFallback(
  userContent: string,
  send: (event: unknown) => void,
  context: LabContext,
  writeConfirmed: boolean,
  pendingWrite?: PendingWriteConfirmation
) {
  const lower = userContent.toLowerCase();
  const productGid = userContent.match(
    /gid:\/\/shopify\/Product\/\d+/
  )?.[0];
  const variantGid = userContent.match(
    /gid:\/\/shopify\/ProductVariant\/\d+/
  )?.[0];

  const handleMatch =
    userContent.match(/handle\s*[:=]\s*([\w-]+)/i) ||
    userContent.match(/["']([\w-]+)["']/) ||
    userContent.match(
      /(?:product|for)\s+(?:the\s+)?([a-z0-9][a-z0-9-]{1,48})/i
    );
  const handle = handleMatch?.[1];

  if (
    context === "customer" &&
    (lower.includes("inventory") ||
      lower.includes("metafield") ||
      lower.includes("production") ||
      lower.includes("list") ||
      lower.includes("catalog"))
  ) {
    send({
      type: "assistant-delta",
      content:
        "Customer preview is storefront-safe and read-only. Merchant mode is required for catalog list, inventory, and metafield writes."
    });
    return;
  }

  try {
    if (lower.includes("inventory") && (productGid || variantGid)) {
      send({
        type: "tool-start",
        name: "get_inventory",
        meta: { productId: productGid, variantId: variantGid }
      });
      const result = await get_inventory({
        productId: productGid,
        variantId: variantGid
      });
      send({ type: "tool-end", name: "get_inventory", result });
      send({
        type: "assistant-delta",
        content: `Inventory result: ${JSON.stringify(result, null, 2)}`
      });
      return;
    }

    if (
      (lower.includes("production") ||
        lower.includes("metafield") ||
        lower.includes("production_status")) &&
      productGid &&
      (lower.includes("set") ||
        lower.includes("update") ||
        lower.includes("mark"))
    ) {
      const valueMatch = userContent.match(/value\s*[:=]\s*["']?([^"'\n]+)/i);
      const value = valueMatch?.[1]?.trim() ?? "in_production";

      if (!writeConfirmed) {
        const candidate: PendingWriteConfirmation = {
          tool: "update_metafield",
          args: {
            ownerId: productGid,
            value
          }
        };
        send({
          type: "tool-confirm-request",
          name: "update_metafield",
          summary: `Confirm metafield write on ${productGid} to custom.production_status=${value}`,
          pendingWrite: candidate
        });
        return;
      }
      if (
        !pendingWrite ||
        pendingWrite.args.ownerId !== productGid ||
        pendingWrite.args.value !== value
      ) {
        send({
          type: "assistant-delta",
          content: "Pending write confirmation did not match. Please confirm again."
        });
        return;
      }

      send({
        type: "tool-start",
        name: "update_metafield",
        meta: { ownerId: productGid, value }
      });
      const result = await update_metafield({
        ownerId: productGid,
        value
      });
      send({ type: "tool-end", name: "update_metafield", result });
      send({
        type: "assistant-delta",
        content: `update_metafield: ${JSON.stringify(result, null, 2)}`
      });
      return;
    }

    if (
      handle &&
      (lower.includes("product") ||
        lower.includes("handle") ||
        lower.includes("get"))
    ) {
      send({
        type: "tool-start",
        name: "get_product",
        meta: { handle }
      });
      const result = await get_product({ handle });
      send({ type: "tool-end", name: "get_product", result });
      send({
        type: "assistant-delta",
        content: result
          ? `Product: ${JSON.stringify(result, null, 2)}`
          : `No product found for handle "${handle}".`
      });
      return;
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    send({
      type: "assistant-delta",
      content: `Shopify error (check .env and API scopes): ${msg}`
    });
    return;
  }

  if (lower.includes("inventory")) {
    send({
      type: "tool-start",
      name: "get_inventory",
      meta: {}
    });
    await new Promise((r) => setTimeout(r, 200));
    send({ type: "tool-end", name: "get_inventory", result: {} });
    send({
      type: "assistant-delta",
      content:
        "Add a product GID (gid://shopify/Product/...) or variant GID to your message to load real inventory. Set GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY for the full Gemini agent."
    });
    return;
  }

  if (lower.includes("production") || lower.includes("metafield")) {
    send({ type: "tool-start", name: "update_metafield", meta: {} });
    await new Promise((r) => setTimeout(r, 200));
    send({ type: "tool-end", name: "update_metafield", result: {} });
    send({
      type: "assistant-delta",
      content:
        "Include a product GID and value (e.g. value: in_production) to write custom.production_status, or set GOOGLE_GENERATIVE_AI_API_KEY / GEMINI_API_KEY for Gemini."
    });
    return;
  }

  if (lower.includes("product") || lower.includes("handle")) {
    send({ type: "tool-start", name: "get_product", meta: {} });
    await new Promise((r) => setTimeout(r, 200));
    send({ type: "tool-end", name: "get_product", result: {} });
    send({
      type: "assistant-delta",
      content:
        "Try: “get product handle your-handle-here” or set GOOGLE_GENERATIVE_AI_API_KEY / GEMINI_API_KEY for natural-language Shopify tools."
    });
    return;
  }

  send({
    type: "assistant-delta",
    content:
      "This lab uses Shopify tools: get_product, get_inventory, update_metafield (custom.production_status). Set GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY (optional LLM_MODEL)—or mention a product handle / Shopify GID for the offline fallback."
  });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ChatRequestBody;
  const messages = body.messages ?? [];
  const requestedContext: LabContext = body.context ?? "customer";
  const writeConfirmed = body.writeConfirmed === true;
  const pendingWrite = body.pendingWrite;
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const userContent = lastUser?.content ?? "";
  const merchantToken = req.cookies.get(LAB_MERCHANT_COOKIE)?.value;

  const effectiveContext: LabContext =
    requestedContext === "merchant" &&
    isMerchantModeEnabled() &&
    verifyMerchantSessionToken(merchantToken)
      ? "merchant"
      : "customer";

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(event: unknown) {
        sendEvent(encoder, controller, event);
      }

      try {
        if (hasGeminiCredentials()) {
          let turns = toChatTurns(messages);
          if (turns.length === 0 && userContent) {
            turns = [{ role: "user", content: userContent }];
          }
          await runLlmShopifyAgent(
            turns,
            (e) => send(e),
            {
              context: effectiveContext,
              writeConfirmed,
              pendingWrite
            }
          );
        } else {
          await runHeuristicFallback(
            userContent,
            send,
            effectiveContext,
            writeConfirmed,
            pendingWrite
          );
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error occurred";
        send({
          type: "assistant-delta",
          content: `Chat agent error: ${message}`
        });
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}
