"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setError("아직 Supabase가 연결되지 않았어요.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setDone(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1200);
    }
  };

  return (
    <div className="glass rounded-3xl p-8 shadow-2xl shadow-black/30">
      <h1 className="font-display text-2xl font-bold tracking-tight">
        새 비밀번호 설정
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        새로 사용할 비밀번호를 입력해주세요.
      </p>

      {done ? (
        <p className="mt-6 text-sm text-cyan">
          비밀번호가 변경되었어요. 대시보드로 이동합니다…
        </p>
      ) : (
        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <label htmlFor="new-password" className="sr-only">
            새 비밀번호
          </label>
          <input
            id="new-password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="새 비밀번호 (6자 이상)"
            autoComplete="new-password"
            aria-label="새 비밀번호"
            className="rounded-xl border border-line bg-bg/40 px-4 py-3 text-sm outline-none transition-colors focus:border-violet"
          />
          {error && <p className="text-sm text-magenta">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            data-cursor="hover"
            className="btn-sheen mt-1 rounded-full bg-fg px-5 py-3 text-sm font-semibold text-bg disabled:opacity-50"
          >
            {loading ? "변경 중…" : "비밀번호 변경"}
          </button>
        </form>
      )}
    </div>
  );
}
