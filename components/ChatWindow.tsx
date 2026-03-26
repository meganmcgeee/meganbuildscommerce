"use client";

import { useEffect, useRef, useState } from "react";
import ToolBadge from "./ToolBadge";

type Role = "system" | "user" | "assistant" | "tool";

type Message = {
  id: string;
  role: Role;
  content: string;
};

type StreamEvent =
  | {
      type: "assistant-delta";
      content: string;
    }
  | {
      type: "tool-confirm-request";
      name: "update_metafield";
      summary: string;
      pendingWrite: {
        tool: "update_metafield";
        args: {
          ownerId: string;
          namespace?: string;
          key?: string;
          type?: string;
          value: string;
        };
      };
    }
  | {
      type: "tool-start" | "tool-end";
      name:
        | "get_product"
        | "list_products"
        | "get_inventory"
        | "update_metafield";
      meta?: Record<string, unknown>;
    };

type StreamToolName = Extract<
  StreamEvent,
  { type: "tool-start" | "tool-end" }
>["name"];

type ChatWindowProps = {
  initialSystemPrompt?: string;
};

type LabContext = "customer" | "merchant";

export default function ChatWindow({
  initialSystemPrompt = "You are a Shopify Technology copilot for Megan Sigsworth, specializing in Shopify Plus, metafields, performance, and operational tooling for high-revenue DTC brands."
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "system-1",
      role: "system",
      content: initialSystemPrompt
    },
    {
      id: "assistant-1",
      role: "assistant",
      content:
        "Ask for one product by handle or ID, or a paged product list (search)—I can’t dump the entire catalog. I’ll use Shopify tools: list_products, get_product, get_inventory, update_metafield."
    }
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [context, setContext] = useState<LabContext>("customer");
  const [authCheck, setAuthCheck] = useState(false);
  const [contextError, setContextError] = useState<string | null>(null);
  const [lastUserPrompt, setLastUserPrompt] = useState<string>("");
  const [pendingWrite, setPendingWrite] = useState<{
    summary: string;
    payload: StreamEvent extends infer T
      ? T extends { type: "tool-confirm-request"; pendingWrite: infer P }
        ? P
        : never
      : never;
  } | null>(null);
  const [activeTools, setActiveTools] = useState<
    { name: StreamToolName; status: "running" | "completed" }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTools]);

  async function sendMessage(
    prompt: string,
    options?: {
      writeConfirmed?: boolean;
      pendingWrite?: {
        tool: "update_metafield";
        args: {
          ownerId: string;
          namespace?: string;
          key?: string;
          type?: string;
          value: string;
        };
      };
      skipUserMessage?: boolean;
    }
  ) {
    if (!prompt.trim() || isStreaming) return;

    const userMessage: Message | null = options?.skipUserMessage
      ? null
      : {
          id: `user-${Date.now()}`,
          role: "user",
          content: prompt.trim()
        };

    if (userMessage) {
      setMessages(prev => [...prev, userMessage]);
    }
    if (!options?.skipUserMessage) {
      setInput("");
      setLastUserPrompt(prompt.trim());
    }
    setPendingWrite(null);
    setIsStreaming(true);
    const controller = new AbortController();

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, ...(userMessage ? [userMessage] : [])].map(m => ({
            role: m.role,
            content: m.content
          })),
          context,
          writeConfirmed: options?.writeConfirmed === true,
          pendingWrite: options?.pendingWrite
        }),
        credentials: "include",
        signal: controller.signal
      });

      if (!response.body) {
        throw new Error("Streaming not supported");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let assistantId = `assistant-${Date.now()}`;
      let assistantContent = "";

      setMessages(prev => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: ""
        }
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(Boolean);

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const payload = line.replace(/^data:\s*/, "");
          if (payload === "[DONE]") {
            continue;
          }

          let event: StreamEvent;
          try {
            event = JSON.parse(payload) as StreamEvent;
          } catch {
            continue;
          }

          if (event.type === "assistant-delta") {
            assistantContent += event.content;
            setMessages(prev =>
              prev.map(m =>
                m.id === assistantId ? { ...m, content: assistantContent } : m
              )
            );
          } else if (event.type === "tool-confirm-request") {
            setPendingWrite({
              summary: event.summary,
              payload: event.pendingWrite
            });
            setMessages(prev =>
              prev.map(m =>
                m.id === assistantId
                  ? {
                      ...m,
                      content:
                        "Write confirmation required. Review and click Confirm Write to continue."
                    }
                  : m
              )
            );
            return;
          } else if (event.type === "tool-start") {
            setActiveTools(prev => [
              ...prev.filter(t => t.name !== event.name),
              { name: event.name, status: "running" }
            ]);
          } else if (event.type === "tool-end") {
            setActiveTools(prev =>
              prev.map(t =>
                t.name === event.name ? { ...t, status: "completed" } : t
              )
            );
          }
        }
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "Something went wrong while streaming the response. Check your API keys and try again."
        }
      ]);
    } finally {
      setIsStreaming(false);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    await sendMessage(trimmed);
  }

  async function enableMerchantMode() {
    setContextError(null);
    try {
      const res = await fetch("/api/lab/merchant-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorized: authCheck }),
        credentials: "include"
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setContextError(data.error ?? "Failed to enable merchant mode.");
        return;
      }
      setContext("merchant");
      setAuthCheck(false);
    } catch (e) {
      setContextError(e instanceof Error ? e.message : "Failed to enable merchant mode.");
    }
  }

  async function lockCustomerMode() {
    setContextError(null);
    setPendingWrite(null);
    await fetch("/api/lab/merchant-session", {
      method: "DELETE",
      credentials: "include"
    });
    setContext("customer");
  }

  async function confirmPendingWrite() {
    if (!pendingWrite || !lastUserPrompt) return;
    await sendMessage(lastUserPrompt, {
      writeConfirmed: true,
      pendingWrite: pendingWrite.payload,
      skipUserMessage: true
    });
  }

  return (
    <section
      id="lab"
      className="mb-20 grid gap-6 rounded-3xl border border-border bg-gradient-to-b from-background/60 to-background/20 p-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] md:p-6"
    >
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
          The Lab
        </p>
        <h2 className="text-balance text-xl font-semibold tracking-tight sm:text-2xl">
          Shopify MCP Agent, wired for production decisions.
        </h2>
        <p className="text-xs text-muted sm:text-sm">
          A thin chat surface over Shopify Admin and Storefront APIs, exposing
          tools for product introspection, inventory reasoning, and flipping
          production status via metafields—designed to plug into your existing
          LLM stack.
        </p>
        <div className="rounded-xl border border-border bg-background/40 p-3 text-[11px] text-muted">
          <p className="font-medium text-foreground">
            {context === "merchant" ? "Merchant tools enabled" : "Customer preview mode"}
          </p>
          <p className="mt-1">
            {context === "merchant"
              ? "Admin-backed tools are active for this browser session."
              : "Storefront-safe mode: no catalog list, inventory reads, or metafield writes."}
          </p>
          {context === "customer" ? (
            <div className="mt-2 space-y-2">
              <label className="flex items-center gap-2 text-[11px]">
                <input
                  type="checkbox"
                  checked={authCheck}
                  onChange={e => setAuthCheck(e.target.checked)}
                />
                <span>I am authorized to act on behalf of this store.</span>
              </label>
              <button
                type="button"
                onClick={enableMerchantMode}
                className="rounded-full border border-border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] hover:border-accent hover:text-foreground"
              >
                Enable merchant tools
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={lockCustomerMode}
              className="mt-2 rounded-full border border-border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] hover:border-accent hover:text-foreground"
            >
              Lock to customer mode
            </button>
          )}
          {contextError && (
            <p className="mt-2 text-[11px] text-red-300">{contextError}</p>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-muted">
          <span className="rounded-full border border-border px-2 py-1 uppercase tracking-[0.18em]">
            Tools: list_products · get_product · get_inventory · update_metafield
          </span>
          <span className="rounded-full border border-border px-2 py-1 uppercase tracking-[0.18em]">
            Protocol: JSON streaming with tool events
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background/70 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            Shopify MCP Chat
          </span>
          <div className="flex flex-wrap gap-1">
            {activeTools.map(tool => (
              <ToolBadge
                key={tool.name}
                name={tool.name}
                status={tool.status}
              />
            ))}
          </div>
        </div>
        <div className="h-56 space-y-2 overflow-y-auto rounded-xl border border-border bg-background/80 p-3 text-xs">
          {messages.map(message => (
            <div
              key={message.id}
              className={`max-w-full whitespace-pre-wrap rounded-lg px-2 py-1.5 ${
                message.role === "user"
                  ? "ml-auto bg-foreground text-background"
                  : message.role === "assistant"
                    ? "bg-border/40 text-foreground"
                    : "text-[11px] text-muted"
              }`}
            >
              {message.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {pendingWrite && (
          <div className="rounded-xl border border-accent/40 bg-accent-soft/20 p-3 text-[11px]">
            <p className="font-medium text-foreground">Write confirmation required</p>
            <p className="mt-1 text-muted">{pendingWrite.summary}</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={confirmPendingWrite}
                className="rounded-full bg-foreground px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-background"
              >
                Confirm write
              </button>
              <button
                type="button"
                onClick={() => setPendingWrite(null)}
                className="rounded-full border border-border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <form
          onSubmit={handleSend}
          className="mt-2 flex items-center gap-2 text-xs"
        >
          <input
            className="h-8 flex-1 rounded-full border border-border bg-background/80 px-3 text-xs outline-none ring-0 focus:border-accent"
            placeholder="Ask the agent to check inventory or flip production status for a product…"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isStreaming}
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="h-8 rounded-full bg-foreground px-3 text-[11px] font-medium uppercase tracking-[0.18em] text-background disabled:cursor-not-allowed disabled:bg-border"
          >
            {isStreaming ? "Streaming…" : "Send"}
          </button>
        </form>
      </div>
    </section>
  );
}

