"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  defaultContent,
  portfolioThemes,
  type PortfolioData,
  type PortfolioThemeKey,
} from "@/lib/content";
import { SaveStatus, type SaveState } from "@/components/dashboard/SaveStatus";
import { DailyViewsChart } from "@/components/dashboard/DailyViewsChart";

type EditProject = {
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string;
  g0: string;
  g1: string;
  image: string;
  href: string;
  highlights: string;
};

type EditGroup = { title: string; items: string };
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type PortfolioRow = {
  id: string;
  slug: string;
  data: PortfolioData | null;
  published: boolean;
};

type InboxMessage = {
  id: string;
  name: string | null;
  email: string | null;
  message: string;
  created_at: string;
};

const dft = defaultContent;

/** Friendly relative time for inbox messages (falls back to a date). */
function relativeTime(iso: string) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const m = Math.floor((Date.now() - t) / 60000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const day = Math.floor(h / 24);
  if (day < 7) return `${day}일 전`;
  return new Date(iso).toLocaleDateString("ko-KR");
}

export function DashboardEditor({
  email,
  plan,
  portfolio,
  views,
  messages = [],
  dailyViews = [],
}: {
  email: string;
  plan: string;
  portfolio: PortfolioRow | null;
  views: number;
  messages?: InboxMessage[];
  dailyViews?: { day: string; count: number }[];
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
  const [aboutStats, setAboutStats] = useState<{ value: string; label: string }[]>(
    (d.about?.stats ?? dft.about.stats).map((s) => ({
      value: s.value,
      label: s.label,
    })),
  );
  const setStat = (i: number, patch: Partial<{ value: string; label: string }>) =>
    setAboutStats((ss) => ss.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const addStat = () =>
    setAboutStats((ss) => [...ss, { value: "", label: "" }]);
  const removeStat = (i: number) =>
    setAboutStats((ss) => ss.filter((_, idx) => idx !== i));
  const [heroLines, setHeroLines] = useState((d.hero?.lines ?? []).join("\n"));
  const [specialties, setSpecialties] = useState(
    (d.hero?.specialties ?? []).join(", "),
  );
  const [heroIntro, setHeroIntro] = useState(d.hero?.intro ?? "");
  const [heroScrollCue, setHeroScrollCue] = useState(d.hero?.scrollCue ?? "");
  const [aboutOverline, setAboutOverline] = useState(d.about?.overline ?? "");
  const [craftOverline, setCraftOverline] = useState(d.craft?.overline ?? "");
  const [contactHeading, setContactHeading] = useState(d.contact?.heading ?? "");
  const [contactBody, setContactBody] = useState(d.contact?.body ?? "");
  const [contactCta, setContactCta] = useState(d.contact?.cta ?? "");
  const [craftHeading, setCraftHeading] = useState(d.craft?.heading ?? "");
  const [craftGroups, setCraftGroups] = useState<EditGroup[]>(
    (d.craft?.groups ?? dft.craft.groups).map((g) => ({
      title: g.title,
      items: g.items.join(", "),
    })),
  );
  const setGroup = (i: number, patch: Partial<EditGroup>) =>
    setCraftGroups((gs) =>
      gs.map((g, idx) => (idx === i ? { ...g, ...patch } : g)),
    );
  const addGroup = () =>
    setCraftGroups((gs) => [...gs, { title: "새 그룹", items: "" }]);
  const removeGroup = (i: number) =>
    setCraftGroups((gs) => gs.filter((_, idx) => idx !== i));
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
      image: p.image ?? "",
      href: p.href ?? "",
      highlights: (p.highlights ?? []).join("\n"),
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
        image: "",
        href: "",
        highlights: "",
      },
    ]);
  const removeProject = (i: number) =>
    setProjects((ps) => ps.filter((_, idx) => idx !== i));
  const moveProject = (i: number, dir: -1 | 1) =>
    setProjects((ps) => {
      const j = i + dir;
      if (j < 0 || j >= ps.length) return ps;
      const next = [...ps];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  type EditSocial = { label: string; href: string; handle: string };
  const [socials, setSocials] = useState<EditSocial[]>(
    (d.socials ?? dft.socials).map((s) => ({
      label: s.label,
      href: s.href,
      handle: s.handle ?? "",
    })),
  );
  const setSocial = (i: number, patch: Partial<EditSocial>) =>
    setSocials((ss) => ss.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const addSocial = () =>
    setSocials((ss) => [...ss, { label: "", href: "", handle: "" }]);
  const removeSocial = (i: number) =>
    setSocials((ss) => ss.filter((_, idx) => idx !== i));
  const moveSocial = (i: number, dir: -1 | 1) =>
    setSocials((ss) => {
      const j = i + dir;
      if (j < 0 || j >= ss.length) return ss;
      const next = [...ss];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const [slug, setSlug] = useState(portfolio?.slug ?? "");
  const [linkCopied, setLinkCopied] = useState(false);
  const [ogPreview, setOgPreview] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [inbox, setInbox] = useState<InboxMessage[]>(messages);
  const statusTimer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (statusTimer.current) window.clearTimeout(statusTimer.current);
    },
    [],
  );

  const deleteMessage = async (id: string) => {
    if (!window.confirm("이 메시지를 삭제할까요?")) return;
    setInbox((xs) => xs.filter((x) => x.id !== id));
    try {
      await createClient().from("messages").delete().eq("id", id);
    } catch {
      /* RLS/network — local removal already applied */
    }
  };
  const [hideBadge, setHideBadge] = useState<boolean>(d.hideBadge ?? false);
  const [accent, setAccent] = useState<PortfolioThemeKey>(d.accent ?? "iris");

  const cancelPro = async () => {
    if (!window.confirm("정말 Pro 구독을 해지할까요?")) return;
    setCancelling(true);
    const res = await fetch("/api/billing/cancel", { method: "POST" });
    setCancelling(false);
    if (res.ok) router.refresh();
  };

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<SaveState | null>(null);

  const [showOnboard, setShowOnboard] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("lumina:onboarded")) setShowOnboard(true);
  }, []);
  const dismissOnboard = () => {
    localStorage.setItem("lumina:onboarded", "1");
    setShowOnboard(false);
  };

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

  const shareTo = (net: "x" | "linkedin") => {
    const s = slug || portfolio?.slug;
    if (!s || typeof window === "undefined") return;
    const url = `${window.location.origin}/p/${s}`;
    const text = `${owner.trim() || "제"} 포트폴리오를 확인해보세요`;
    const href =
      net === "x"
        ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const onSave = async () => {
    if (!portfolio) return;
    setSaving(true);
    setStatus(null);
    const heroLinesArr = heroLines.split(/\n/).map((s) => s.trim()).filter(Boolean);
    const specialtiesArr = specialties.split(",").map((s) => s.trim()).filter(Boolean);
    const data: PortfolioData = {
      site: {
        ...(owner && { owner }),
        ...(role && { role }),
        ...(tagline && { tagline }),
        ...(pEmail && { email: pEmail }),
        ...(location && { location }),
      },
      hero: {
        ...(heroLinesArr.length && { lines: heroLinesArr }),
        ...(specialtiesArr.length && { specialties: specialtiesArr }),
        ...(heroIntro.trim() && { intro: heroIntro.trim() }),
        ...(heroScrollCue.trim() && { scrollCue: heroScrollCue.trim() }),
      },
      contact: {
        ...(contactHeading.trim() && { heading: contactHeading.trim() }),
        ...(contactBody.trim() && { body: contactBody.trim() }),
        ...(contactCta.trim() && { cta: contactCta.trim() }),
      },
      craft: {
        ...(craftOverline.trim() && { overline: craftOverline.trim() }),
        ...(craftHeading.trim() && { heading: craftHeading.trim() }),
        groups: craftGroups
          .map((g) => ({
            title: g.title.trim(),
            items: g.items.split(",").map((s) => s.trim()).filter(Boolean),
          }))
          .filter((g) => g.title || g.items.length),
      },
      about: {
        ...(aboutOverline.trim() && { overline: aboutOverline.trim() }),
        ...(aboutHeading && { heading: aboutHeading }),
        ...(aboutBody.trim() && {
          body: aboutBody.split(/\n\n+/).map((s) => s.trim()).filter(Boolean),
        }),
        ...(aboutStats.some((s) => s.value.trim() || s.label.trim()) && {
          stats: aboutStats
            .filter((s) => s.value.trim() || s.label.trim())
            .map((s) => ({ value: s.value.trim(), label: s.label.trim() })),
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
        ...(p.image.trim() && { image: p.image.trim() }),
        ...(p.href.trim() && { href: p.href.trim() }),
        role: p.category,
        overview: p.description,
        highlights: p.highlights
          .split("\n")
          .map((h) => h.trim())
          .filter(Boolean),
      })),
      socials: socials
        .filter((s) => s.label && s.href)
        .map((s) => ({
          label: s.label,
          href: s.href,
          ...(s.handle.trim() && { handle: s.handle.trim() }),
        })),
      hideBadge,
      accent,
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
      setStatus({
        kind: "err",
        text: dup
          ? "이미 사용 중인 주소예요. 다른 주소를 입력해주세요."
          : `저장 실패: ${error.message}`,
      });
    } else {
      if (cleanSlug && cleanSlug !== slug) setSlug(cleanSlug);
      setStatus({ kind: "ok", text: "저장되었습니다" });
      if (statusTimer.current) window.clearTimeout(statusTimer.current);
      statusTimer.current = window.setTimeout(() => setStatus(null), 3000);
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

  // Getting-started checklist — reflects current edits; hides once complete.
  const guideSteps = [
    { label: "기본 정보 입력 (이름)", done: owner.trim().length > 0 },
    { label: "프로젝트 1개 이상 추가", done: projects.length > 0 },
    { label: "저장 후 공개 켜기", done: published },
  ];
  const guideDone = guideSteps.filter((s) => s.done).length;

  const since7 = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10);
  const weekViews = dailyViews
    .filter((d) => d.day >= since7)
    .reduce((a, b) => a + b.count, 0);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {/* Header */}
      <header className="mb-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" data-cursor="hover">
          <span className="h-7 w-7 rounded-full bg-gradient-to-br from-iris via-violet to-magenta" />
          <span className="font-display text-lg font-bold">대시보드</span>
        </Link>
        <div className="flex items-center gap-3">
          {(slug || portfolio?.slug) && (
            <a
              href={`/p/${slug || portfolio?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="hidden text-sm text-muted transition-colors hover:text-fg sm:inline"
            >
              미리보기 ↗
            </a>
          )}
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

      <nav
        aria-label="편집기 섹션 바로가기"
        className="mb-6 flex flex-wrap gap-2 text-xs"
      >
        {[
          ["#s-inbox", "메시지"],
          ["#s-basic", "기본 정보"],
          ["#s-content", "콘텐츠"],
          ["#s-projects", "프로젝트"],
          ["#s-socials", "소셜"],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            data-cursor="hover"
            className="rounded-full border border-line px-3 py-1 text-muted transition-colors hover:border-violet hover:text-fg"
          >
            {label}
          </a>
        ))}
      </nav>

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

      {showOnboard && (
        <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-violet/30 bg-violet/5 p-5">
          <div>
            <p className="font-medium">환영해요! 👋</p>
            <p className="mt-1 text-pretty text-sm text-muted">
              아래 정보를 채우고 저장한 뒤, &lsquo;공개&rsquo;를 켜면 나만의
              포트폴리오가 lumina.app/p/내이름 주소로 완성돼요.
            </p>
          </div>
          <button
            onClick={dismissOnboard}
            aria-label="안내 닫기"
            data-cursor="hover"
            className="shrink-0 text-muted transition-colors hover:text-fg"
          >
            ✕
          </button>
        </div>
      )}

      {/* Getting-started checklist */}
      {guideDone < guideSteps.length && (
        <section className="glass mb-6 rounded-2xl p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">시작 가이드</h2>
            <span className="text-xs text-muted">
              {guideDone}/{guideSteps.length} 완료
            </span>
          </div>
          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet to-cyan transition-all duration-500"
              style={{ width: `${(guideDone / guideSteps.length) * 100}%` }}
            />
          </div>
          <ul className="flex flex-col gap-2.5">
            {guideSteps.map((s) => (
              <li key={s.label} className="flex items-center gap-3 text-sm">
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] ${
                    s.done
                      ? "border-lime/50 bg-lime/15 text-lime"
                      : "border-line-strong text-faint"
                  }`}
                >
                  {s.done ? "✓" : ""}
                </span>
                <span className={s.done ? "text-muted line-through" : "text-fg"}>
                  {s.label}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

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
              <span className="mx-2 text-faint">·</span>
              방문수{" "}
              <span className="font-medium text-fg tabular-nums">
                {views.toLocaleString()}
              </span>
              {dailyViews.length > 0 && (
                <>
                  <span className="mx-2 text-faint">·</span>
                  최근 7일{" "}
                  <span className="font-medium text-fg tabular-nums">
                    {weekViews.toLocaleString()}
                  </span>
                  회
                </>
              )}
            </p>
          </div>
          {plan === "pro" ? (
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-violet/40 bg-violet/10 px-4 py-2 text-sm font-medium text-violet">
                Pro 이용 중 🎉
              </span>
              <button
                onClick={cancelPro}
                disabled={cancelling}
                data-cursor="hover"
                className="text-sm text-muted transition-colors hover:text-magenta disabled:opacity-50"
              >
                {cancelling ? "처리 중…" : "해지"}
              </button>
            </div>
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

        {/* White-label — Pro perk */}
        <label
          className={`mt-5 flex items-center justify-between gap-4 rounded-xl border border-line bg-bg/30 px-4 py-3 ${
            plan === "pro" ? "" : "opacity-70"
          }`}
        >
          <span>
            <span className="flex items-center gap-2 text-sm font-medium">
              &lsquo;LUMINA로 제작&rsquo; 배지 숨기기
              {plan !== "pro" && (
                <span className="rounded-full border border-violet/40 bg-violet/10 px-2 py-0.5 text-[11px] font-semibold text-violet">
                  Pro 전용
                </span>
              )}
            </span>
            <span className="mt-0.5 block text-xs text-muted">
              공개 포트폴리오 좌측 하단의 배지를 제거해 온전히 내 브랜드로 보여줘요.
            </span>
          </span>
          <input
            type="checkbox"
            checked={hideBadge}
            disabled={plan !== "pro"}
            onChange={(e) => setHideBadge(e.target.checked)}
            aria-label="LUMINA 배지 숨기기 (Pro 전용)"
            className="h-4 w-4 shrink-0 accent-violet disabled:cursor-not-allowed"
          />
        </label>

        <div className="mt-6 border-t border-line pt-5">
          <p className="mb-3 text-xs font-medium text-muted">방문 추이</p>
          <DailyViewsChart data={dailyViews} />
        </div>
      </section>

      {/* Inbox */}
      <section className="glass mb-6 rounded-2xl p-6">
        <div className="mb-1 flex items-center gap-2">
          <h2 id="s-inbox" className="scroll-mt-6 font-display text-lg font-semibold">받은 메시지</h2>
          {inbox.length > 0 && (
            <span
              aria-label={`메시지 ${inbox.length}개`}
              className="rounded-full bg-violet/15 px-2 py-0.5 text-xs font-semibold text-violet"
            >
              {inbox.length}
            </span>
          )}
        </div>
        {inbox.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            아직 받은 메시지가 없어요. 공개 포트폴리오의 문의 폼으로 메시지가
            도착하면 여기에 표시됩니다.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col divide-y divide-line">
            {inbox.map((m) => (
              <li
                key={m.id}
                className="-mx-2 rounded-lg px-2 py-4 transition-colors hover:bg-surface/40"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-medium">
                    {m.name?.trim() || "익명"}
                    {m.email && (
                      <a
                        href={`mailto:${m.email}`}
                        className="ml-2 text-xs font-normal text-violet hover:underline"
                      >
                        {m.email}
                      </a>
                    )}
                  </span>
                  <span className="flex items-center gap-3">
                    <span
                      className="font-mono text-xs text-faint"
                      title={new Date(m.created_at).toLocaleString("ko-KR")}
                    >
                      {relativeTime(m.created_at)}
                    </span>
                    <button
                      onClick={() => deleteMessage(m.id)}
                      data-cursor="hover"
                      aria-label="메시지 삭제"
                      className="text-xs text-muted transition-colors hover:text-magenta"
                    >
                      삭제
                    </button>
                  </span>
                </div>
                <p className="mt-1.5 whitespace-pre-wrap text-pretty text-sm text-muted">
                  {m.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Accent theme */}
      <section className="glass mb-6 rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold">테마</h2>
        <p className="mb-4 mt-1 text-xs text-muted">
          공개 포트폴리오의 색감을 골라보세요. 저장하면 내 사이트에 바로 적용돼요.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {(Object.keys(portfolioThemes) as PortfolioThemeKey[]).map((key) => {
            const th = portfolioThemes[key];
            const selected = accent === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setAccent(key)}
                data-cursor="hover"
                aria-pressed={selected}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  selected
                    ? "border-violet bg-violet/10"
                    : "border-line hover:border-line-strong"
                }`}
              >
                <span
                  aria-hidden
                  className="block h-8 w-full rounded-md"
                  style={{
                    background: `linear-gradient(100deg, ${th.iris}, ${th.cyan} 50%, ${th.magenta})`,
                  }}
                />
                <span className="mt-2 flex items-center justify-between text-xs font-medium">
                  {th.label}
                  {selected && <span className="text-violet">✓</span>}
                </span>
              </button>
            );
          })}
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
            aria-label="공개 주소 (slug)"
          />
        </div>
      </section>

      {/* Share */}
      <section className="glass mb-6 rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold">공유</h2>
        <p className="mb-4 mt-1 text-xs text-muted">
          공개 포트폴리오를 링크나 SNS로 널리 알려보세요.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={copyLink}
            data-cursor="hover"
            className="rounded-full border border-line-strong px-4 py-2 text-sm transition-colors hover:border-violet"
          >
            {linkCopied ? "복사됨 ✓" : "링크 복사"}
          </button>
          <button
            onClick={() => shareTo("x")}
            data-cursor="hover"
            className="rounded-full border border-line-strong px-4 py-2 text-sm transition-colors hover:border-violet"
          >
            X에 공유
          </button>
          <button
            onClick={() => shareTo("linkedin")}
            data-cursor="hover"
            className="rounded-full border border-line-strong px-4 py-2 text-sm transition-colors hover:border-violet"
          >
            LinkedIn에 공유
          </button>
          {(slug || portfolio?.slug) && (
            <button
              onClick={() => setOgPreview((v) => !v)}
              data-cursor="hover"
              className="rounded-full border border-line-strong px-4 py-2 text-sm transition-colors hover:border-violet"
            >
              {ogPreview ? "카드 숨기기" : "공유 카드 미리보기"}
            </button>
          )}
        </div>
        {ogPreview && (slug || portfolio?.slug) && (
          <div className="mt-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/p/${slug || portfolio?.slug}/opengraph-image`}
              alt="SNS 공유 시 표시되는 카드 미리보기"
              width={1200}
              height={630}
              loading="lazy"
              className="w-full max-w-md rounded-xl border border-line"
            />
            <p className="mt-2 text-xs text-faint">
              카카오톡·X·LinkedIn 등에 링크를 붙여넣으면 이 카드가 표시돼요.
              저장된 내용을 기준으로 만들어지니, 수정 후에는 저장하고 새로고침해
              주세요.
            </p>
          </div>
        )}
      </section>

      {/* Identity */}
      <section className="glass rounded-2xl p-6">
        <h2 id="s-basic" className="mb-5 scroll-mt-6 font-display text-lg font-semibold">기본 정보</h2>
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

      {/* Hero */}
      <section className="glass mt-6 rounded-2xl p-6">
        <h2 id="s-content" className="mb-5 scroll-mt-6 font-display text-lg font-semibold">히어로 섹션</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className={label}>대형 문구 (한 줄에 하나씩, 최대 3줄 권장)</label>
            <textarea
              className={`${field} min-h-24 resize-y`}
              value={heroLines}
              onChange={(e) => setHeroLines(e.target.value)}
              placeholder={dft.hero.lines.join("\n")}
            />
          </div>
          <div>
            <label className={label}>전문 분야 (쉼표로 구분, 순환 표시)</label>
            <input
              className={field}
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              placeholder={dft.hero.specialties.join(", ")}
            />
          </div>
          <div>
            <label className={label}>소개 문장</label>
            <textarea
              className={`${field} min-h-20 resize-y`}
              value={heroIntro}
              onChange={(e) => setHeroIntro(e.target.value)}
              placeholder={dft.hero.intro}
            />
          </div>
          <div>
            <label className={label}>스크롤 안내 문구</label>
            <input
              className={field}
              value={heroScrollCue}
              onChange={(e) => setHeroScrollCue(e.target.value)}
              placeholder={dft.hero.scrollCue}
            />
          </div>
        </div>
      </section>

      {/* About */}
      <section className="glass mt-6 rounded-2xl p-6">
        <h2 className="mb-5 font-display text-lg font-semibold">소개 섹션</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className={label}>오버라인 (소제목)</label>
            <input className={field} value={aboutOverline} onChange={(e) => setAboutOverline(e.target.value)} placeholder={dft.about.overline} />
          </div>
          <div>
            <label className={label}>제목</label>
            <input className={field} value={aboutHeading} onChange={(e) => setAboutHeading(e.target.value)} placeholder={dft.about.heading} />
          </div>
          <div>
            <label className={label}>본문 (빈 줄로 문단 구분)</label>
            <textarea className={`${field} min-h-32 resize-y`} value={aboutBody} onChange={(e) => setAboutBody(e.target.value)} placeholder={dft.about.body.join("\n\n")} />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className={label}>통계 (큰 숫자 + 설명)</span>
              <button
                onClick={addStat}
                data-cursor="hover"
                className="rounded-full border border-line-strong px-3 py-1 text-xs transition-colors hover:border-violet"
              >
                + 추가
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {aboutStats.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    aria-label="통계 값"
                    className={`${field} w-24 shrink-0`}
                    value={s.value}
                    onChange={(e) => setStat(i, { value: e.target.value })}
                    placeholder="예: 40+"
                  />
                  <input
                    aria-label="통계 설명"
                    className={field}
                    value={s.label}
                    onChange={(e) => setStat(i, { label: e.target.value })}
                    placeholder="예: 출시한 프로젝트"
                  />
                  <button
                    onClick={() => removeStat(i)}
                    data-cursor="hover"
                    aria-label="통계 삭제"
                    className="shrink-0 text-xs text-muted transition-colors hover:text-magenta"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="glass mt-6 rounded-2xl p-6">
        <h2 className="mb-5 font-display text-lg font-semibold">연락 섹션</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className={label}>제목</label>
            <input
              className={field}
              value={contactHeading}
              onChange={(e) => setContactHeading(e.target.value)}
              placeholder={dft.contact.heading}
            />
          </div>
          <div>
            <label className={label}>본문</label>
            <textarea
              className={`${field} min-h-20 resize-y`}
              value={contactBody}
              onChange={(e) => setContactBody(e.target.value)}
              placeholder={dft.contact.body}
            />
          </div>
          <div>
            <label className={label}>버튼 문구</label>
            <input
              className={field}
              value={contactCta}
              onChange={(e) => setContactCta(e.target.value)}
              placeholder={dft.contact.cta}
            />
          </div>
        </div>
      </section>

      {/* Craft / skill groups */}
      <section className="glass mt-6 rounded-2xl p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">역량 섹션</h2>
          <button
            onClick={addGroup}
            data-cursor="hover"
            className="rounded-full border border-line-strong px-3 py-1.5 text-xs transition-colors hover:border-violet"
          >
            + 그룹 추가
          </button>
        </div>
        <div className="mb-4">
          <label className={label}>오버라인 (소제목)</label>
          <input
            className={field}
            value={craftOverline}
            onChange={(e) => setCraftOverline(e.target.value)}
            placeholder={dft.craft.overline}
          />
        </div>
        <div className="mb-4">
          <label className={label}>제목</label>
          <input
            className={field}
            value={craftHeading}
            onChange={(e) => setCraftHeading(e.target.value)}
            placeholder={dft.craft.heading}
          />
        </div>
        <div className="flex flex-col gap-3">
          {craftGroups.map((g, i) => (
            <div
              key={i}
              className="grid gap-3 rounded-xl border border-line p-4 sm:grid-cols-[1fr_2fr_auto]"
            >
              <input
                aria-label="역량 그룹 제목"
                className={field}
                value={g.title}
                onChange={(e) => setGroup(i, { title: e.target.value })}
                placeholder="그룹명 (예: Engineering)"
              />
              <input
                aria-label="역량 항목"
                className={field}
                value={g.items}
                onChange={(e) => setGroup(i, { items: e.target.value })}
                placeholder="항목 (쉼표로 구분)"
              />
              <button
                onClick={() => removeGroup(i)}
                data-cursor="hover"
                className="self-center text-xs text-muted transition-colors hover:text-magenta"
              >
                삭제
              </button>
            </div>
          ))}
          {craftGroups.length === 0 && (
            <p className="text-sm text-muted">
              아직 역량 그룹이 없어요. &quot;그룹 추가&quot;로 시작하세요.
            </p>
          )}
        </div>
      </section>

      {/* Projects */}
      <section className="glass mt-6 rounded-2xl p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="s-projects" className="scroll-mt-6 font-display text-lg font-semibold">프로젝트</h2>
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
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveProject(i, -1)}
                    disabled={i === 0}
                    data-cursor="hover"
                    aria-label="위로 이동"
                    className="grid h-7 w-7 place-items-center rounded-md text-muted transition-colors hover:bg-surface hover:text-fg disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveProject(i, 1)}
                    disabled={i === projects.length - 1}
                    data-cursor="hover"
                    aria-label="아래로 이동"
                    className="grid h-7 w-7 place-items-center rounded-md text-muted transition-colors hover:bg-surface hover:text-fg disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeProject(i)}
                    data-cursor="hover"
                    className="ml-2 text-xs text-muted transition-colors hover:text-magenta"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input aria-label="프로젝트 제목" className={field} value={p.title} onChange={(e) => setProject(i, { title: e.target.value })} placeholder="제목" />
                <input aria-label="프로젝트 카테고리" className={field} value={p.category} onChange={(e) => setProject(i, { category: e.target.value })} placeholder="카테고리 (예: 제품 · WebGL)" />
                <input aria-label="프로젝트 연도" className={field} value={p.year} onChange={(e) => setProject(i, { year: e.target.value })} placeholder="연도" />
                <input aria-label="프로젝트 태그" className={field} value={p.tags} onChange={(e) => setProject(i, { tags: e.target.value })} placeholder="태그 (쉼표로 구분)" />
                <textarea aria-label="프로젝트 설명" className={`${field} min-h-20 resize-y sm:col-span-2`} value={p.description} onChange={(e) => setProject(i, { description: e.target.value })} placeholder="설명" />
                <div className="flex items-center gap-3 sm:col-span-2">
                  <input
                    aria-label="프로젝트 커버 이미지 URL"
                    className={field}
                    value={p.image}
                    onChange={(e) => setProject(i, { image: e.target.value })}
                    placeholder="커버 이미지 URL (선택 — 비우면 색상 사용)"
                  />
                  {p.image.trim() && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt=""
                      className="h-8 w-12 shrink-0 rounded-lg border border-line object-cover"
                    />
                  )}
                </div>
                <div className="sm:col-span-2">
                  <input
                    aria-label="프로젝트 외부 링크"
                    className={field}
                    value={p.href}
                    onChange={(e) => setProject(i, { href: e.target.value })}
                    placeholder="외부 링크 URL (선택 — '프로젝트 보기' 버튼)"
                  />
                </div>
                <div className="sm:col-span-2">
                  <textarea
                    aria-label="프로젝트 주요 성과"
                    className={`${field} min-h-20 resize-y`}
                    value={p.highlights}
                    onChange={(e) => setProject(i, { highlights: e.target.value })}
                    placeholder="주요 성과 (한 줄에 하나씩 — 상세 보기에 표시)"
                  />
                  <p className="mt-1 text-xs text-faint">
                    프로젝트를 클릭하면 열리는 상세 보기의 “주요 성과” 목록에
                    표시돼요. 한 줄에 하나씩 적어주세요.
                  </p>
                </div>
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
          <h2 id="s-socials" className="scroll-mt-6 font-display text-lg font-semibold">소셜 링크</h2>
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
            <div key={i} className="flex items-center gap-2">
              <div className="flex shrink-0 flex-col">
                <button
                  onClick={() => moveSocial(i, -1)}
                  disabled={i === 0}
                  data-cursor="hover"
                  aria-label="위로 이동"
                  className="grid h-5 w-6 place-items-center rounded text-muted transition-colors hover:bg-surface hover:text-fg disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveSocial(i, 1)}
                  disabled={i === socials.length - 1}
                  data-cursor="hover"
                  aria-label="아래로 이동"
                  className="grid h-5 w-6 place-items-center rounded text-muted transition-colors hover:bg-surface hover:text-fg disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
              <input
                className={`${field} w-28 shrink-0`}
                value={s.label}
                onChange={(e) => setSocial(i, { label: e.target.value })}
                aria-label="소셜 이름"
                placeholder="GitHub"
              />
              <input
                className={field}
                value={s.href}
                onChange={(e) => setSocial(i, { href: e.target.value })}
                aria-label="소셜 링크 URL"
                placeholder="https://github.com/내아이디"
              />
              <input
                className={`${field} w-32 shrink-0`}
                value={s.handle}
                onChange={(e) => setSocial(i, { handle: e.target.value })}
                aria-label="소셜 핸들"
                placeholder="@내아이디 (선택)"
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
          {status && <SaveStatus kind={status.kind} text={status.text} />}
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
        변경 후 &lsquo;저장&rsquo;을 누르면 공개 포트폴리오에 바로 반영돼요.
      </p>
    </div>
  );
}
