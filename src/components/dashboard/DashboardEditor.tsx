"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { defaultContent, type PortfolioData } from "@/lib/content";

type EditProject = {
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string;
  g0: string;
  g1: string;
};
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type PortfolioRow = {
  id: string;
  slug: string;
  data: PortfolioData | null;
  published: boolean;
};

const dft = defaultContent;

export function DashboardEditor({
  email,
  plan,
  portfolio,
}: {
  email: string;
  plan: string;
  portfolio: PortfolioRow | null;
}) {
  const router = useRouter();
  const d = portfolio?.data ?? {};

  const [owner, setOwner] = useState(d.site?.owner ?? "");
  const [role, setRole] = useState(d.site?.role ?? "");
  const [tagline, setTagline] = useState(d.site?.tagline ?? "");
  const [pEmail, setPEmail] = useState(d.site?.email ?? "");
  const [location, setLocation] = useState(d.site?.location ?? "");
  const [aboutHeading, setAboutHeading] = useState(d.about?.heading ?? "");
  const [aboutBody, setAboutBody] = useState(
    (d.about?.body ?? []).join("\n\n"),
  );
  const [published, setPublished] = useState(portfolio?.published ?? false);
  const [projects, setProjects] = useState<EditProject[]>(
    (d.projects ?? dft.projects).map((p) => ({
      title: p.title,
      category: p.category,
      year: p.year,
      description: p.description,
      tags: p.tags.join(", "),
      g0: p.gradient[0],
      g1: p.gradient[1],
    })),
  );

  const setProject = (i: number, patch: Partial<EditProject>) =>
    setProjects((ps) => ps.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const addProject = () =>
    setProjects((ps) => [
      ...ps,
      {
        title: "새 프로젝트",
        category: "카테고리",
        year: "2025",
        description: "",
        tags: "",
        g0: "#6d5cff",
        g1: "#4de2e2",
      },
    ]);
  const removeProject = (i: number) =>
    setProjects((ps) => ps.filter((_, idx) => idx !== i));

  const [socials, setSocials] = useState<{ label: string; href: string }[]>(
    (d.socials ?? dft.socials).map((s) => ({ label: s.label, href: s.href })),
  );
  const setSocial = (i: number, patch: Partial<{ label: string; href: string }>) =>
    setSocials((ss) => ss.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const addSocial = () =>
    setSocials((ss) => [...ss, { label: "", href: "" }]);
  const removeSocial = (i: number) =>
    setSocials((ss) => ss.filter((_, idx) => idx !== i));

  const [slug, setSlug] = useState(portfolio?.slug ?? "");
  const [linkCopied, setLinkCopied] = useState(false);

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const copyLink = async () => {
    const s = slug || portfolio?.slug;
    if (!s) return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/p/${s}`);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  const onSave = async () => {
    if (!portfolio) return;
    setSaving(true);
    setStatus(null);
    const data: PortfolioData = {
      site: {
        ...(owner && { owner }),
        ...(role && { role }),
        ...(tagline && { tagline }),
        ...(pEmail && { email: pEmail }),
        ...(location && { location }),
      },
      about: {
        ...(aboutHeading && { heading: aboutHeading }),
        ...(aboutBody.trim() && {
          body: aboutBody.split(/\n\n+/).map((s) => s.trim()).filter(Boolean),
        }),
      },
      projects: projects.map((p, i) => ({
        id: `${p.title.toLowerCase().replace(/\s+/g, "-")}-${i}`,
        title: p.title,
        category: p.category,
        year: p.year,
        description: p.description,
        tags: p.tags.split(",").map((t) => t.trim()).filter(Boolean),
        gradient: [p.g0, p.g1] as [string, string],
        role: p.category,
        overview: p.description,
        highlights: [],
      })),
      socials: socials.filter((s) => s.label && s.href),
    };
    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    const supabase = createClient();
    const { error } = await supabase
      .from("portfolios")
      .update({
        data,
        published,
        ...(cleanSlug && { slug: cleanSlug }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", portfolio.id);
    setSaving(false);
    if (error) {
      const dup = /duplicate|unique/i.test(error.message);
      setStatus(
        dup
          ? "이미 사용 중인 주소예요. 다른 주소를 입력해주세요."
          : `저장 실패: ${error.message}`,
      );
    } else {
      if (cleanSlug && cleanSlug !== slug) setSlug(cleanSlug);
      setStatus("저장되었습니다 ✓");
    }
  };

  const signOut = async () => {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  };

  const field =
    "w-full rounded-xl border border-line bg-bg/40 px-4 py-3 text-sm outline-none transition-colors focus:border-violet";
  const label = "mb-1.5 block text-xs font-medium text-muted";

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {/* Header */}
      <header className="mb-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" data-cursor="hover">
          <span className="h-7 w-7 rounded-full bg-gradient-to-br from-iris via-violet to-magenta" />
          <span className="font-display text-lg font-bold">대시보드</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-line px-3 py-1 text-xs uppercase text-muted">
            {plan === "pro" ? "PRO" : "FREE"}
          </span>
          <ThemeToggle />
          <button
            onClick={signOut}
            data-cursor="hover"
            className="text-sm text-muted transition-colors hover:text-fg"
          >
            로그아웃
          </button>
        </div>
      </header>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            내 포트폴리오
          </h1>
          <p className="mt-1 text-sm text-muted">{email}</p>
        </div>
        {portfolio && (
          <div className="flex flex-wrap items-center gap-2">
            {published ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/30 bg-lime/10 px-3 py-1.5 text-xs font-medium text-lime">
                <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                공개 중
              </span>
            ) : (
              <span className="rounded-full border border-line px-3 py-1.5 text-xs text-muted">
                비공개
              </span>
            )}
            <button
              onClick={copyLink}
              data-cursor="hover"
              className="rounded-full border border-line-strong px-4 py-2 text-sm transition-colors hover:border-violet"
            >
              {linkCopied ? "복사됨 ✓" : "링크 복사"}
            </button>
            <Link
              href={`/p/${slug || portfolio.slug}`}
              target="_blank"
              data-cursor="hover"
              className="rounded-full border border-line-strong px-4 py-2 text-sm transition-colors hover:border-violet"
            >
              내 사이트 보기 ↗
            </Link>
          </div>
        )}
      </div>

      {/* Account & billing */}
      <section className="glass mb-6 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold">계정 & 결제</h2>
            <p className="mt-1 text-sm text-muted">
              현재 플랜:{" "}
              <span className="font-medium text-fg">
                {plan === "pro" ? "Pro" : "무료"}
              </span>
            </p>
          </div>
          {plan === "pro" ? (
            <span className="rounded-full border border-violet/40 bg-violet/10 px-4 py-2 text-sm font-medium text-violet">
              Pro 이용 중 🎉
            </span>
          ) : (
            <Link
              href="/pricing"
              data-cursor="hover"
              className="btn-sheen rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-violet"
            >
              Pro 업그레이드
            </Link>
          )}
        </div>
      </section>

      {/* Public address */}
      <section className="glass mb-6 rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold">공개 주소</h2>
        <p className="mb-4 mt-1 text-xs text-muted">
          내 포트폴리오가 공개될 주소예요. 영문·숫자·하이픈만 가능합니다.
        </p>
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-sm text-muted">lumina.app/p/</span>
          <input
            className={field}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="내이름"
          />
        </div>
      </section>

      {/* Identity */}
      <section className="glass rounded-2xl p-6">
        <h2 className="mb-5 font-display text-lg font-semibold">기본 정보</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>이름</label>
            <input className={field} value={owner} onChange={(e) => setOwner(e.target.value)} placeholder={dft.site.owner} />
          </div>
          <div>
            <label className={label}>역할</label>
            <input className={field} value={role} onChange={(e) => setRole(e.target.value)} placeholder={dft.site.role} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>한 줄 소개</label>
            <input className={field} value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder={dft.site.tagline} />
          </div>
          <div>
            <label className={label}>이메일</label>
            <input className={field} value={pEmail} onChange={(e) => setPEmail(e.target.value)} placeholder={dft.site.email} />
          </div>
          <div>
            <label className={label}>위치</label>
            <input className={field} value={location} onChange={(e) => setLocation(e.target.value)} placeholder={dft.site.location} />
          </div>
        </div>
      </section>

      {/* About */}
      <section className="glass mt-6 rounded-2xl p-6">
        <h2 className="mb-5 font-display text-lg font-semibold">소개 섹션</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className={label}>제목</label>
            <input className={field} value={aboutHeading} onChange={(e) => setAboutHeading(e.target.value)} placeholder={dft.about.heading} />
          </div>
          <div>
            <label className={label}>본문 (빈 줄로 문단 구분)</label>
            <textarea className={`${field} min-h-32 resize-y`} value={aboutBody} onChange={(e) => setAboutBody(e.target.value)} placeholder={dft.about.body.join("\n\n")} />
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="glass mt-6 rounded-2xl p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">프로젝트</h2>
          <button
            onClick={addProject}
            data-cursor="hover"
            className="rounded-full border border-line-strong px-3 py-1.5 text-xs transition-colors hover:border-violet"
          >
            + 추가
          </button>
        </div>
        <div className="flex flex-col gap-5">
          {projects.map((p, i) => (
            <div key={i} className="rounded-xl border border-line p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs text-faint">
                  0{i + 1}
                </span>
                <button
                  onClick={() => removeProject(i)}
                  data-cursor="hover"
                  className="text-xs text-muted transition-colors hover:text-magenta"
                >
                  삭제
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input className={field} value={p.title} onChange={(e) => setProject(i, { title: e.target.value })} placeholder="제목" />
                <input className={field} value={p.category} onChange={(e) => setProject(i, { category: e.target.value })} placeholder="카테고리 (예: 제품 · WebGL)" />
                <input className={field} value={p.year} onChange={(e) => setProject(i, { year: e.target.value })} placeholder="연도" />
                <input className={field} value={p.tags} onChange={(e) => setProject(i, { tags: e.target.value })} placeholder="태그 (쉼표로 구분)" />
                <textarea className={`${field} min-h-20 resize-y sm:col-span-2`} value={p.description} onChange={(e) => setProject(i, { description: e.target.value })} placeholder="설명" />
                <div className="flex items-center gap-3 sm:col-span-2">
                  <span className="text-xs text-muted">커버 색상</span>
                  <input type="color" value={p.g0} onChange={(e) => setProject(i, { g0: e.target.value })} className="h-8 w-12 cursor-pointer rounded border border-line bg-transparent" />
                  <input type="color" value={p.g1} onChange={(e) => setProject(i, { g1: e.target.value })} className="h-8 w-12 cursor-pointer rounded border border-line bg-transparent" />
                  <span
                    aria-hidden
                    className="ml-auto h-8 w-24 rounded-lg"
                    style={{ background: `linear-gradient(90deg, ${p.g0}, ${p.g1})` }}
                  />
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="text-sm text-muted">
              아직 프로젝트가 없어요. &quot;추가&quot;를 눌러 시작하세요.
            </p>
          )}
        </div>
      </section>

      {/* Socials */}
      <section className="glass mt-6 rounded-2xl p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">소셜 링크</h2>
          <button
            onClick={addSocial}
            data-cursor="hover"
            className="rounded-full border border-line-strong px-3 py-1.5 text-xs transition-colors hover:border-violet"
          >
            + 추가
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {socials.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                className={`${field} w-32 shrink-0`}
                value={s.label}
                onChange={(e) => setSocial(i, { label: e.target.value })}
                placeholder="GitHub"
              />
              <input
                className={field}
                value={s.href}
                onChange={(e) => setSocial(i, { href: e.target.value })}
                placeholder="https://github.com/내아이디"
              />
              <button
                onClick={() => removeSocial(i)}
                data-cursor="hover"
                className="shrink-0 text-xs text-muted transition-colors hover:text-magenta"
              >
                삭제
              </button>
            </div>
          ))}
          {socials.length === 0 && (
            <p className="text-sm text-muted">
              아직 링크가 없어요. &quot;추가&quot;로 등록해보세요.
            </p>
          )}
        </div>
      </section>

      {/* Publish + save */}
      <div className="sticky bottom-6 z-10 mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line-strong bg-bg-soft/90 p-4 backdrop-blur">
        <label className="flex items-center gap-3 text-sm" data-cursor="hover">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 accent-violet" />
          공개 (체크하면 누구나 내 사이트를 볼 수 있어요)
        </label>
        <div className="flex items-center gap-4">
          {status && <span className="text-sm text-muted">{status}</span>}
          <button
            onClick={onSave}
            disabled={saving || !portfolio}
            data-cursor="hover"
            className="btn-sheen rounded-full bg-fg px-6 py-3 text-sm font-semibold text-bg disabled:opacity-50"
          >
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-faint">
        프로젝트·소셜·테마 편집은 곧 추가됩니다. 더 많은 커스터마이즈는 Pro에서.
      </p>
    </div>
  );
}
