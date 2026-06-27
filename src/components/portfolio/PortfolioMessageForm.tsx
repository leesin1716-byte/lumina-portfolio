"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type State = "idle" | "sending" | "sent" | "error";

/** Public-portfolio contact form — visitors message the owner. */
export function PortfolioMessageForm({ slug }: { slug: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [state, setState] = useState<State>("idle");
  const [errText, setErrText] = useState("지금은 메시지를 보낼 수 없어요. 잠시 후 다시 시도해주세요.");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, email, message, company }),
      });
      const data = (await res.json().catch(() => ({ ok: false }))) as {
        ok?: boolean;
        error?: string;
      };
      if (data.ok) {
        setState("sent");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setErrText(
          data.error === "invalid_email"
            ? "이메일 형식을 확인해주세요."
            : data.error === "rate_limited"
              ? "메시지를 너무 자주 보냈어요. 잠시 후 다시 시도해주세요."
              : "지금은 메시지를 보낼 수 없어요. 잠시 후 다시 시도해주세요.",
        );
        setState("error");
      }
    } catch {
      setErrText("지금은 메시지를 보낼 수 없어요. 잠시 후 다시 시도해주세요.");
      setState("error");
    }
  };

  return (
    <section id="message" className="relative mx-auto max-w-2xl px-6 py-20 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-3xl p-8 sm:p-10"
      >
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-violet">
          메시지
        </p>
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          메시지 보내기
        </h2>
        <p className="mt-2 text-sm text-muted">
          궁금한 점이나 제안이 있다면 편하게 남겨주세요.
        </p>

        {state === "sent" ? (
          <p className="mt-6 rounded-xl border border-lime/40 bg-lime/10 px-4 py-3 text-sm text-lime">
            메시지를 보냈어요. 곧 연락드릴게요 ✓
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
            {/* Honeypot — hidden from humans; bots that fill it are silently dropped. */}
            <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden" >
              <label>
                회사
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름 (선택)"
                aria-label="이름"
                className="rounded-xl border border-line bg-bg/40 px-4 py-3 text-sm outline-none transition-colors focus:border-violet"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 (선택)"
                aria-label="이메일"
                className="rounded-xl border border-line bg-bg/40 px-4 py-3 text-sm outline-none transition-colors focus:border-violet"
              />
            </div>
            <div>
              <textarea
                required
                maxLength={2000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="메시지를 입력하세요"
                aria-label="메시지"
                className="min-h-32 w-full resize-y rounded-xl border border-line bg-bg/40 px-4 py-3 text-sm outline-none transition-colors focus:border-violet"
              />
              <div className="mt-1 text-right text-xs tabular-nums text-faint">
                {message.length}/2000
              </div>
            </div>
            {state === "error" && (
              <p className="text-sm text-magenta">{errText}</p>
            )}
            <button
              type="submit"
              disabled={state === "sending"}
              data-cursor="hover"
              className="btn-sheen mt-1 self-start rounded-full bg-fg px-7 py-3 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {state === "sending" ? "보내는 중…" : "보내기"}
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
