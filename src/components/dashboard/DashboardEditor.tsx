"use client";

import { useEffect, useState } from "react";
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

type EditProject = {
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string;
  g0: string;
  g1: string;
  image: string;
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

export function DashboardEditor({
  email,
  plan,
  portfolio,
  views,
  messages = [],
}: {
  email: string;
  plan: string;
  portfolio: PortfolioRow | null;
  views: number;
  messages?: InboxMessage[];
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
  const [heroLines, setHeroLines] = useState((d.hero?.lines ?? []).join("\n"));
  const [specialties, setSpecialties] = useState(
    (d.hero?.specialties ?? []).join(", "),
  );
  const [heroIntro, setHeroIntro] = useState(d.hero?.intro ?? "");
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
  const [cancelling, setCancelling] = useState(false);
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
      },
      contact: {
        ...(contactHeading.trim() && { heading: contactHeading.trim() }),
        ...(contactBody.trim() && { body: contactBody.trim() }),
        ...(contactCta.trim() && { cta: contactCta.trim() }),
      },
      craft: {
        ...(craftHeading.trim() && { heading: craftHeading.trim() }),
        groups: craftGroups
          .map((g) => ({
            title: g.title.trim(),
            items: g.items.split(",").map((s) => s.trim()).filter(Boolean),
          }))
          .filter((g) => g.title || g.items.length),
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
        ...(p.image.trim() && { image: p.image.trim() }),
        role: p.category,
        overview: p.description,
        highlights: [],
      })),
      socials: socials.filter((s) => s.label && s.href),
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
      </section>

      {/* Inbox */}
      <section className="glass mb-6 rounded-2xl p-6">
        <div className="mb-1 flex items-center gap-2">
          <h2 className="font-display text-lg font-semibold">받은 메시지</h2>
          {messages.length > 0 && (
            <span className="rounded-full bg-violet/15 px-2 py-0.5 text-xs font-semibold text-violet">
              {messages.length}
            </span>
          )}
        </div>
        {messages.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            아직 받은 메시지가 없어요. 공개 포트폴리오의 문의 폼으로 메시지가
            도착하면 여기에 표시됩니다.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col divide-y divide-line">
            {messages.map((m) => (
              <li key={m.id} className="py-4">
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
                  <span className="font-mono text-xs text-faint">
                    {new Date(m.created_at).toLocaleString("ko-KR")}
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

      {/* Hero */}
      <section className="glass mt-6 rounded-2xl p-6">
        <h2 className="mb-5 font-display text-lg font-semibold">히어로 섹션</h2>
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
        프로젝트·소셜·테마 편집은 곧 추가됩니다. 더 많은 커스터마이즈는 Pro에서.
      </p>
    </div>
  );
}
