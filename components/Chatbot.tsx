"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/cn";

type Msg = { id: number; from: "bot" | "user"; text: string };

/**
 * Scripted travel assistant. Replies come from `getBotReply()` — a small
 * rule-based matcher. To make it a real assistant later, replace the body of
 * `getBotReply` with a fetch to a Next.js route handler, e.g.:
 *
 *   // app/api/chat/route.ts
 *   import Anthropic from "@anthropic-ai/sdk";       // npm i @anthropic-ai/sdk
 *   const client = new Anthropic();                  // reads ANTHROPIC_API_KEY
 *   export async function POST(req: Request) {
 *     const { messages } = await req.json();         // [{ role, content }]
 *     const res = await client.messages.create({
 *       model: "claude-opus-4-8",                     // current Anthropic model
 *       max_tokens: 1024,
 *       system: "You are Wicket Travel's helpful booking assistant.",
 *       messages,                                     // role: "user" | "assistant"
 *     });
 *     const text = res.content.find((b) => b.type === "text")?.text ?? "";
 *     return Response.json({ text });                 // (or stream for long replies)
 *   }
 *
 * …then in getBotReply: `const r = await fetch("/api/chat", {...}); return (await r.json()).text;`
 */
const SCRIPT: { match: RegExp; reply: string }[] = [
  {
    match: /\b(price|cheap|cost|guarantee|best price|fare|hidden fee|fee)\b/i,
    reply:
      "We find the best available fares from trusted airlines and take you straight through to book — we never add hidden booking fees. Find it cheaper elsewhere? Our Best-Price Guarantee helps you match it.",
  },
  {
    match: /\b(flight|fly|airline|airport)\b/i,
    reply:
      "For flights, use the Flights tab up top: enter your From and To airports, pick your dates and cabin, then hit Search Flights. We'll surface the best fares from the world's most trusted airlines.",
  },
  {
    match: /\b(hotel|stay|room|resort|accommodation)\b/i,
    reply:
      "We're flights-focused here, so hotels are handled on our holidays site at wickettravelholidays.com — tap the Hotels tab and it'll open in a new tab for you.",
  },
  {
    match: /\b(car|rental|drive|vehicle|suv)\b/i,
    reply:
      "Need wheels at your destination? Choose the Car Rental tab, set your pick-up and drop-off, and we'll line up trusted rentals with free cancellation.",
  },
  {
    match: /\b(secure|safe|security|data|privacy|trust)\b/i,
    reply:
      "Every search is encrypted with bank-level SSL and we only connect you to verified, fully-licensed airlines — never an unknown reseller. Your card details are never stored.",
  },
  {
    match: /\b(hi|hello|hey|salam|hola|bonjour)\b/i,
    reply: "Hello! Where would you like to fly? I can help you find trusted airline tickets at the best fares.",
  },
];

const FALLBACK =
  "I'm a demo assistant, so I can help with the basics — flights, fares, airlines and security. Try asking about one of those, or tap Search Flights to get started!";

function getBotReply(text: string): string {
  const hit = SCRIPT.find((s) => s.match.test(text));
  return hit ? hit.reply : FALLBACK;
}

const SUGGESTIONS = ["How do I book a flight?", "Which airlines?", "Is it secure?"];

export default function Chatbot() {
  const { t, dir } = useI18n();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Seed greeting on first open.
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ id: idRef.current++, from: "bot", text: t("chat.greeting") }]);
    }
  }, [open, messages.length, t]);

  // Autoscroll to newest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { id: idRef.current++, from: "user", text }]);
    setTyping(true);
    // Simulated latency — this is where a real API call would await a response.
    window.setTimeout(
      () => {
        setTyping(false);
        setMessages((m) => [...m, { id: idRef.current++, from: "bot", text: getBotReply(text) }]);
      },
      reduce ? 200 : 800
    );
  };

  const side = dir === "rtl" ? "left-4 sm:left-5" : "right-4 sm:right-5";

  return (
    <>
      {/* Launcher */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={reduce ? undefined : { scale: 1.05 }}
        whileTap={reduce ? undefined : { scale: 0.95 }}
        className={cn(
          "fixed bottom-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-accent-500 text-white shadow-lg shadow-accent-500/30 transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 sm:bottom-5",
          side
        )}
        aria-label={open ? "Close chat" : "Open chat assistant"}
        aria-expanded={open}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "chat"}
            initial={reduce ? false : { rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { rotate: 90, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "fixed bottom-20 z-50 flex h-[28rem] max-h-[calc(100dvh-7rem)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 sm:bottom-24",
              side
            )}
            role="dialog"
            aria-label={t("chat.title")}
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-navy-800 px-4 py-3 text-white">
              <span className="relative grid h-9 w-9 place-items-center rounded-full bg-white/15">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-navy-800 bg-emerald-400" />
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold">{t("chat.title")}</div>
                <div className="truncate text-xs text-navy-100">{t("chat.subtitle")}</div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-mist/60 p-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm",
                      m.from === "user"
                        ? "rounded-br-sm bg-accent-500 text-white"
                        : "rounded-bl-sm bg-white text-navy-900 ring-1 ring-slate-200"
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-2 w-2 rounded-full bg-slate-400"
                        animate={reduce ? undefined : { y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-white px-3 pt-3">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-navy-200 px-3 py-1.5 text-xs font-semibold text-navy-700 transition-colors hover:bg-navy-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-slate-100 bg-white p-3"
            >
              <label htmlFor="chat-input" className="sr-only">
                {t("chat.placeholder")}
              </label>
              <input
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chat.placeholder")}
                className="h-11 flex-1 rounded-full border border-slate-200 bg-mist/60 px-4 text-sm text-navy-900 placeholder:text-slate-500 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
              />
              <button
                type="submit"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-500 text-white transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:opacity-50"
                disabled={!input.trim()}
                aria-label="Send message"
              >
                <Send className="h-5 w-5" aria-hidden="true" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
