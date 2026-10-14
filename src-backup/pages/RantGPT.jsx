import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  Zap,
  Database,
  MessageCircle,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";
import NetworkBackground from "@/components/NetworkBackground";

const WELCOME = `Hi! I'm RantGPT, your CodeRant assistant. Ask me anything about our community, membership, working or staying in Malaysia - visas, jobs, cost of living, and more.`;

const FEATURES = [
  { icon: Zap, label: "Instant answers" },
  { icon: Database, label: "Curated community FAQs" },
  { icon: MessageCircle, label: "Malaysia expat guide" },
];

export default function RantGPT() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await base44.entities.RantFAQ.filter(
          { published: true },
          { sort: "display_order", limit: 6, fields: ["question"] },
        );
        setSuggestions((res.items || []).map((f) => f.question));
      } catch {
        setSuggestions([]);
      }
    })();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const send = async (text) => {
    const message = (text || input).trim();
    if (!message || sending) return;

    setError("");
    setInput("");
    const history = messages
      .filter((m) => m.role !== "error")
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setSending(true);
    try {
      const res = await base44.functions.invoke("rantgptChat", {
        message,
        history,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.answer },
      ]);
    } catch (err) {
      console.error("RantGPT Error:", err);

      console.error("Error details:", {
        message: err?.message,
        status: err?.status,
        response: err?.response,
        data: err?.data,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err?.message || "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-background overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <NetworkBackground nodeCount={22} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[40rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-10 right-[8%] h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-14 text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/80 backdrop-blur px-4 py-2 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              RantGPT - Online
            </span>
          </div>
          <h1 className="mt-7 font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
            Ask <span className="text-gradient-brand">RantGPT</span> Anything
          </h1>
          <div className="mx-auto mt-5 h-px w-40 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered assistant for CodeRant and staying, working, and
            living in Malaysia.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-4 py-1.5 shadow-sm"
              >
                <f.icon className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat */}
      <section className="relative bg-card/30 border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12">
          {/* Layered premium panel */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-[2.2rem] bg-gradient-to-b from-primary/25 via-border to-border blur-[2px]" />
            <div className="absolute -inset-6 rounded-[3rem] bg-primary/5 blur-2xl" />
            <div className="relative rounded-[2rem] p-px bg-gradient-to-b from-primary/40 via-border to-border">
              <div className="rounded-[calc(2rem-1px)] bg-card overflow-hidden shadow-2xl">
                {/* Panel header */}
                <div className="relative flex items-center justify-between gap-3 border-b border-border bg-surface-elevated/70 backdrop-blur px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 grid place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md shadow-primary/25">
                        <Bot className="h-4 w-4" />
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-accent ring-2 ring-card" />
                    </div>
                    <div>
                      <p className="font-heading text-sm font-semibold text-foreground leading-none">
                        RantGPT
                      </p>
                      <p className="mt-1.5 text-[11px] text-muted-foreground leading-none flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-accent" />
                        Always here for the community
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                    <span className="text-[11px] text-muted-foreground">
                      Verified community sources
                    </span>
                  </div>
                </div>

                {/* Messages */}
                <div className="relative h-[55vh] min-h-[380px] overflow-y-auto scrollbar-thin bg-line-grid opacity-100 px-4 sm:px-6 py-6 space-y-5">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-start gap-3 animate-fade-in",
                        m.role === "user" && "flex-row-reverse",
                      )}
                    >
                      <div
                        className={cn(
                          "h-8 w-8 shrink-0 grid place-items-center rounded-xl shadow-sm",
                          m.role === "user"
                            ? "bg-primary/10 text-primary ring-1 ring-primary/25"
                            : "bg-gradient-to-br from-primary to-accent text-primary-foreground",
                        )}
                      >
                        {m.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                          m.role === "user"
                            ? "bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-tr-md shadow-lg shadow-primary/25"
                            : "bg-surface-elevated border border-border text-foreground rounded-tl-md border-l-2 border-l-primary/40",
                        )}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {sending && (
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 shrink-0 grid place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="rounded-2xl rounded-tl-md bg-surface-elevated border border-border px-4 py-3.5 flex items-center gap-1.5">
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-primary/80 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-primary/80 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-primary/80 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Gradient divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                {/* Suggested questions */}
                {messages.length <= 1 && suggestions.length > 0 && (
                  <div className="px-4 sm:px-6 pt-4 pb-5">
                    <p className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
                      <Sparkles className="h-3 w-3 text-primary" />
                      Try asking
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {suggestions.map((q, i) => (
                        <button
                          key={q}
                          onClick={() => send(q)}
                          disabled={sending}
                          className={cn(
                            "group flex items-center gap-2.5 rounded-xl border border-border bg-background px-3.5 py-2.5 text-left text-xs text-muted-foreground",
                            "hover:text-primary hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10 transition-all",
                            "disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none",
                          )}
                        >
                          <span className="shrink-0 font-mono text-[10px] text-primary/60 group-hover:text-primary transition-colors">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="flex-1 leading-snug">{q}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="border-t border-border bg-background px-4 sm:px-6 py-4">
                  {error && (
                    <p className="mb-2 text-xs text-destructive">{error}</p>
                  )}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      send();
                    }}
                    className="flex items-center gap-2.5 rounded-2xl border border-border bg-card p-1.5 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all"
                  >
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about CodeRant or living in Malaysia..."
                      className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                      maxLength={1000}
                    />
                    <button
                      type="submit"
                      disabled={sending || !input.trim()}
                      aria-label="Send message"
                      className="h-10 w-10 shrink-0 grid place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 hover:scale-105 transition-all disabled:opacity-40 disabled:hover:scale-100"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/70">
                    <ShieldCheck className="h-3 w-3" />
                    RantGPT answers questions about CodeRant and staying in
                    Malaysia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
