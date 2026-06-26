"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const notReady =
    "아직 Supabase가 연결되지 않았어요. 관리자가 환경변수를 설정하면 이용할 수 있습니다.";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setError(notReady);
      return;
    }
    setLoading(true);
    setError(null);
    setInfo(null);
    const supabase = createClient();
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        const redirect =
          new URLSearchParams(window.location.search).get("redirect") ||
          "/dashboard";
        router.push(redirect);
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;
        setInfo("확인 메일을 보냈어요. 메일의 링크를 눌러 가입을 완료해주세요.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  const oauth = async () => {
    if (!isSupabaseConfigured) {
      setError(notReady);
      return;
    }
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  return (
    <div className="glass rounded-3xl p-8 shadow-2xl shadow-black/30">
      <h1 className="font-display text-2xl font-bold tracking-tight">
        {mode === "login" ? "다시 오신 걸 환영해요" : "지금 시작하세요"}
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        {mode === "login"
          ? "포트폴리오를 이어서 만들어 볼까요?"
          : "몇 초면 나만의 몰입형 포트폴리오를 만들 수 있어요."}
      </p>

      <button
        type="button"
        onClick={oauth}
        data-cursor="hover"
        className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full border border-line-strong px-5 py-3 text-sm font-medium transition-colors hover:border-violet"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
        </svg>
        Google로 계속하기
      </button>

      <div className="my-5 flex items-center gap-3 text-xs text-faint">
        <span className="h-px flex-1 bg-line" />
        또는 이메일로
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label htmlFor="auth-email" className="sr-only">
          이메일
        </label>
        <input
          id="auth-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          autoComplete="email"
          aria-label="이메일"
          className="rounded-xl border border-line bg-bg/40 px-4 py-3 text-sm outline-none transition-colors focus:border-violet"
        />
        <label htmlFor="auth-password" className="sr-only">
          비밀번호
        </label>
        <input
          id="auth-password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 (6자 이상)"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          aria-label="비밀번호"
          className="rounded-xl border border-line bg-bg/40 px-4 py-3 text-sm outline-none transition-colors focus:border-violet"
        />

        {error && <p className="text-sm text-magenta">{error}</p>}
        {info && <p className="text-sm text-cyan">{info}</p>}

        <button
          type="submit"
          disabled={loading}
          data-cursor="hover"
          className="btn-sheen mt-1 rounded-full bg-fg px-5 py-3 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading
            ? "처리 중…"
            : mode === "login"
              ? "로그인"
              : "회원가입"}
        </button>
      </form>

      {mode === "login" && (
        <p className="mt-3 text-center text-xs text-muted">
          <Link
            href="/forgot-password"
            className="underline-offset-4 hover:text-fg hover:underline"
          >
            비밀번호를 잊으셨나요?
          </Link>
        </p>
      )}

      <p className="mt-5 text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            아직 계정이 없으신가요?{" "}
            <Link href="/signup" className="text-fg underline-offset-4 hover:underline">
              회원가입
            </Link>
          </>
        ) : (
          <>
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-fg underline-offset-4 hover:underline">
              로그인
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
