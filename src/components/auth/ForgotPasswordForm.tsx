"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setError("아직 Supabase가 연결되지 않았어요.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <div className="glass rounded-3xl p-8 shadow-2xl shadow-black/30">
      <h1 className="font-display text-2xl font-bold tracking-tight">
        비밀번호 재설정
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        가입한 이메일로 재설정 링크를 보내드릴게요.
      </p>

      {sent ? (
        <div className="mt-6 rounded-xl border border-cyan/30 bg-cyan/5 p-4 text-sm text-muted">
          <span className="text-cyan">{email}</span> 로 재설정 링크를 보냈어요.
          메일을 확인해 새 비밀번호를 설정해주세요.
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <label htmlFor="reset-email" className="sr-only">
            이메일
          </label>
          <input
            id="reset-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            autoComplete="email"
            aria-label="이메일"
            className="rounded-xl border border-line bg-bg/40 px-4 py-3 text-sm outline-none transition-colors focus:border-violet"
          />
          {error && <p className="text-sm text-magenta">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            data-cursor="hover"
            className="btn-sheen mt-1 rounded-full bg-fg px-5 py-3 text-sm font-semibold text-bg disabled:opacity-50"
          >
            {loading ? "전송 중…" : "재설정 링크 받기"}
          </button>
        </form>
      )}

      <p className="mt-5 text-center text-sm text-muted">
        <Link
          href="/login"
          className="text-fg underline-offset-4 hover:underline"
        >
          로그인으로 돌아가기
        </Link>
      </p>
    </div>
  );
}
