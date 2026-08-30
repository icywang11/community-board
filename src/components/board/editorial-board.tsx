"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";

import { FinderWindow } from "@/components/board/finder-window";
import { Input } from "@/components/ui/input";
import { summarizeBoard } from "@/lib/data";
import type { Quote, WeekReport } from "@/lib/types";
import { cn } from "@/lib/utils";

const chapters = [
  { no: "01", id: "overall", label: "整体舆情", short: "整体", en: "Overall" },
  { no: "02", id: "week", label: "本周概览", short: "本周", en: "This Week" },
  { no: "03", id: "issues", label: "高频议题", short: "议题", en: "Issues" },
  { no: "04", id: "quotes", label: "原话摘录", short: "原话", en: "Voices" },
] as const;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function pct(share: number) {
  return `${(share * 100).toFixed(1)}%`;
}

export function EditorialBoard({ weeks }: { weeks: WeekReport[] }) {
  const [weekId, setWeekId] = useState(weeks[0].id);
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [query, setQuery] = useState("");
  const [activeQuote, setActiveQuote] = useState<Quote | null>(null);

  const week = weeks.find((item) => item.id === weekId) ?? weeks[0];
  const overall = useMemo(() => summarizeBoard(weeks), [weeks]);
  const topFour = week.categories.slice(0, 4);
  const maxTrend = Math.max(...overall.trend.map((item) => item.volume), 1);

  const quotes = useMemo(() => {
    return week.quotes.filter((quote) => {
      if (categoryFilter !== "all" && quote.categoryId !== categoryFilter) {
        return false;
      }
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (
        quote.text.toLowerCase().includes(q) ||
        quote.category.toLowerCase().includes(q)
      );
    });
  }, [week, categoryFilter, query]);

  const selectedCategory = week.categories.find(
    (item) => item.id === categoryFilter
  );

  function resetFilters() {
    setCategoryFilter("all");
    setQuery("");
  }

  function selectWeek(id: string) {
    setWeekId(id);
    resetFilters();
  }

  return (
    <div className="dot-grid relative min-h-screen overflow-x-hidden">
      <p className="script-mark pointer-events-none absolute -bottom-6 left-[-4%] hidden text-[88px] lg:block">
        FEEDBACK
      </p>

      <div className="relative mx-auto w-full max-w-[1280px] px-4 pb-24 pt-8 sm:px-8 lg:px-10">
        <header className="mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-serif text-[11px] tracking-[0.38em] text-black/45">
              DISCORD · 社区看板
            </p>
            <h1 className="mt-2 font-display text-[34px] leading-none tracking-tight sm:text-[44px]">
              社区舆情看板
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">
              周更看板，数据来自社区反馈表。先看整体大盘，再点进某一周的类型、议题和原话。
            </p>
          </div>

          <div className="flex max-w-xl flex-col items-start gap-3 lg:items-end">
            <p className="font-serif text-[15px] tracking-[0.22em] text-black/70">
              周更 · {overall.range}
            </p>
            <p className="text-[11px] tracking-[0.14em] text-black/40">
              选择周次，只替换本周及以下栏目
            </p>
            <div className="flex max-h-24 flex-wrap justify-start gap-2 overflow-y-auto lg:justify-end">
              {weeks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectWeek(item.id)}
                  className={cn(
                    "rounded-full border px-3 py-1 font-serif text-sm tracking-wide transition-colors",
                    item.id === week.id
                      ? "border-ink bg-ink text-white"
                      : "border-black/15 bg-white/70 text-black/60 hover:border-black/30"
                  )}
                >
                  {item.rangeShort}
                </button>
              ))}
            </div>
          </div>
        </header>

        <nav className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-black/10 pb-3 text-[12px] tracking-[0.18em] text-black/40">
          <span className="font-serif tracking-[0.28em] text-black/55">社区</span>
          {chapters.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="transition-colors hover:text-ink"
            >
              {item.no} {item.short}
            </a>
          ))}
        </nav>

        <section
          id="overall"
          className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6"
        >
          <article className="paper-card relative min-h-[340px] overflow-hidden rounded-[28px] p-7 sm:p-8">
            <span className="watermark absolute -right-2 top-10 text-[140px] sm:text-[168px]">
              01
            </span>
            <div className="relative flex items-start justify-between gap-4">
              <h2 className="font-serif text-[34px] leading-none tracking-[0.12em] sm:text-[42px]">
                DIRECTORY
              </h2>
              <p className="pt-1 text-right text-[10px] leading-4 tracking-[0.16em] text-black/40">
                {overall.weekCount} weeks
                <br />
                Sentiment Board
              </p>
            </div>
            <p className="relative mt-8 font-serif text-[15px] tracking-wide text-black/45">
              Chapter 01
            </p>
            <h3 className="relative mt-1 font-display text-[32px] leading-none sm:text-[38px]">
              <span className="font-serif">01</span> 整体舆情
            </h3>
            <FinderWindow
              className="relative mt-8"
              title="社区舆情看板 / 目录"
              path="整体 / 本周 / 议题 / 原话"
            >
              <ul>
                {chapters.map((chapter) => (
                  <li key={chapter.id}>
                    <button
                      type="button"
                      onClick={() => scrollToId(chapter.id)}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-[13px] hover:bg-white/70"
                    >
                      <span className="inline-flex size-7 items-center justify-center rounded-md bg-[#eadf9a]/80 font-serif text-[12px]">
                        {chapter.no}
                      </span>
                      <span className="flex-1">{chapter.label}</span>
                      <span className="font-serif text-[12px] tracking-wide text-black/35">
                        {chapter.en}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </FinderWindow>
          </article>

          <article className="paper-card relative min-h-[340px] overflow-hidden rounded-[28px] p-3 sm:p-4">
            <div className="relative h-full min-h-[320px] overflow-hidden rounded-[22px]">
              <Image
                src="/editorial/magazine.jpg"
                alt=""
                fill
                className="object-cover grayscale"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/10" />
              <div className="absolute left-4 right-4 top-4 flex items-center justify-between text-[10px] tracking-[0.18em] text-white/80">
                <span>社区看板</span>
                <span>Chapter 01</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 max-w-[78%]">
                <p className="font-serif text-[11px] tracking-[0.28em] text-white/70">
                  OVERALL SENTIMENT
                </p>
                <h3 className="mt-1 font-display text-[26px] leading-tight text-white sm:text-[32px]">
                  整体舆情
                </h3>
                <p className="mt-2 text-[13px] leading-5 text-white/85">
                  {overall.narrative}
                </p>
              </div>
            </div>
          </article>

          <article
            id="week"
            className="paper-card relative min-h-[320px] overflow-hidden rounded-[28px]"
          >
            <Image
              src="/editorial/tulips.jpg"
              alt=""
              fill
              className="object-cover opacity-35 grayscale"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-white/55" />
            <div className="relative p-7 sm:p-8">
              <div className="flex items-start justify-between gap-3 text-[10px] tracking-[0.18em] text-black/40">
                <span>Chapter 02</span>
                <span>{week.rangeShort}</span>
              </div>
              <h2 className="mt-6 font-display text-[28px] leading-none sm:text-[34px]">
                02 本周概览
              </h2>
              <p className="mt-3 max-w-[36rem] text-[13px] leading-6 text-black/55">
                {week.narrative}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {topFour.map((category, index) => {
                  const active = categoryFilter === category.id;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        setCategoryFilter(active ? "all" : category.id);
                        if (!active) scrollToId("quotes");
                      }}
                      className={cn(
                        "rounded-2xl border px-3 py-4 text-left transition-colors",
                        active
                          ? "border-ink bg-ink text-white"
                          : "border-black/10 bg-white/75 hover:bg-white"
                      )}
                    >
                      <p
                        className={cn(
                          "font-serif text-[11px] tracking-[0.16em]",
                          active ? "text-white/70" : "text-black/40"
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-2 text-[13px] leading-5">{category.name}</p>
                      <p className="mt-3 font-serif text-2xl tabular-nums">
                        {category.count}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-[11px]",
                          active ? "text-white/70" : "text-black/40"
                        )}
                      >
                        {pct(category.share)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </article>

          <article className="flex min-h-[320px] flex-col gap-4">
            <div className="paper-card flex flex-1 flex-col justify-between rounded-[28px] p-7 sm:p-8">
              <p className="max-w-[36rem] text-[15px] leading-7 text-black/70 sm:text-[17px]">
                {week.judgment}
              </p>
              <div className="mt-8">
                <p className="font-serif text-[11px] tracking-[0.28em] text-black/40">
                  CHAPTER 02 · THIS WEEK
                </p>
                <h2 className="mt-2 font-display text-[28px] leading-none sm:text-[34px]">
                  本周判断
                </h2>
              </div>
            </div>
            <div className="paper-card relative h-[88px] overflow-hidden rounded-[28px]">
              <Image
                src="/editorial/roses-fill.jpg"
                alt=""
                fill
                className="object-cover grayscale"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <button
                type="button"
                onClick={() => scrollToId("issues")}
                className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm"
                aria-label="查看高频议题"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          </article>

          <article
            id="issues"
            className="paper-card relative min-h-[340px] overflow-hidden rounded-[28px]"
          >
            <Image
              src="/editorial/roses-fill.jpg"
              alt=""
              fill
              className="object-cover grayscale"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
            <div className="relative flex h-full min-h-[340px] flex-col justify-between p-7 sm:p-8">
              <div className="flex items-start justify-between text-[10px] tracking-[0.18em] text-white/70">
                <span>Chapter 03</span>
                <span>High-frequency issues</span>
              </div>
              <div className="max-w-[28rem]">
                <p className="text-[14px] leading-6 text-white/85">
                  本周类型按条数排序。点一条，原话会收成这一类。
                </p>
                <h2 className="mt-4 font-display text-[30px] leading-none text-white sm:text-[36px]">
                  03 高频议题
                </h2>
              </div>
            </div>
          </article>

          <article className="paper-card relative min-h-[340px] overflow-hidden rounded-[28px] p-7 sm:p-8">
            <span className="watermark absolute -right-1 top-8 text-[140px] sm:text-[168px]">
              04
            </span>
            <div className="relative flex items-start justify-between gap-4">
              <h2 className="font-serif text-[34px] leading-none tracking-[0.12em] sm:text-[42px]">
                DIRECTORY
              </h2>
              <p className="pt-1 text-right text-[10px] leading-4 tracking-[0.16em] text-black/40">
                {week.quotes.length} quotes
                <br />
                Voices
              </p>
            </div>
            <p className="relative mt-8 font-serif text-[15px] tracking-wide text-black/45">
              Chapter 04
            </p>
            <h3 className="relative mt-1 font-display text-[32px] leading-none sm:text-[38px]">
              <span className="font-serif">04</span> 原话摘录
            </h3>
            <FinderWindow
              className="relative mt-8"
              title="Chapter 04 / 本周类型"
              path={week.categories
                .slice(0, 4)
                .map((item) => item.name)
                .join(" / ")}
            >
              <ul>
                {week.categories.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryFilter(item.id);
                        scrollToId("quotes");
                      }}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-[13px] hover:bg-white/70"
                    >
                      <span className="inline-flex size-7 items-center justify-center rounded-md bg-white font-serif text-[11px]">
                        {item.count}
                      </span>
                      <span className="flex-1">{item.name}</span>
                      <span className="font-serif text-base tabular-nums text-black/40">
                        {pct(item.share)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </FinderWindow>
          </article>
        </section>

        <p className="mt-10 font-serif text-[12px] tracking-[0.28em] text-black/35">
          CHAPTER 01 · 整体舆情
        </p>
        <section className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["累计反馈", overall.feedback, `${overall.weekCount} 周`],
            ["覆盖区间", overall.range.replace("2026.", ""), "周更"],
            ["本周反馈", week.total, week.rangeShort],
            ["跨周反复", overall.standing.length, "主题"],
            [
              "累计最高",
              overall.topCategories[0]?.count ?? 0,
              overall.topCategories[0]?.name ?? "—",
            ],
            ["本周类型", week.categories.length, "类"],
          ].map(([label, value, note]) => (
            <div key={String(label)} className="paper-card rounded-[22px] px-4 py-4">
              <p className="text-[11px] tracking-[0.14em] text-black/40">{label}</p>
              <p className="mt-2 font-serif text-[22px] leading-none tabular-nums sm:text-[26px]">
                {value}
              </p>
              <p className="mt-2 truncate text-[11px] text-black/40">{note}</p>
            </div>
          ))}
        </section>

        <section className="paper-card mt-5 rounded-[28px] p-6 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-serif text-[11px] tracking-[0.28em] text-black/40">
                CHAPTER 01 · WEEKLY VOLUME
              </p>
              <h2 className="mt-1 font-display text-2xl">周反馈量</h2>
            </div>
            <p className="max-w-md text-[13px] leading-5 text-black/45">
              {overall.judgment} 点某一周可切到该周概览。
            </p>
          </div>
          <div className="mt-8 flex items-end gap-1 overflow-x-auto pb-2 sm:gap-2">
            {overall.trend.map((point) => {
              const height = 28 + (point.volume / maxTrend) * 88;
              const active = point.id === week.id;
              return (
                <button
                  key={point.id}
                  type="button"
                  onClick={() => {
                    selectWeek(point.id);
                    scrollToId("week");
                  }}
                  className="group flex min-w-8 flex-1 flex-col items-center gap-2"
                >
                  <div
                    className={cn(
                      "w-full max-w-8 rounded-full",
                      active ? "bg-ink" : "bg-black/20 group-hover:bg-ink/70"
                    )}
                    style={{ height }}
                  />
                  <span
                    className={cn(
                      "text-[9px] tracking-wide",
                      active ? "text-ink" : "text-black/40"
                    )}
                  >
                    {point.label.split("-")[0]}
                  </span>
                </button>
              );
            })}
          </div>
          {overall.standing.length > 0 && (
            <ul className="mt-8 divide-y divide-black/8 border-t border-black/8">
              {overall.standing.map((item) => (
                <li
                  key={item.name}
                  className="flex flex-wrap items-baseline justify-between gap-2 py-3 text-[13px]"
                >
                  <span className="font-display text-[16px]">{item.name}</span>
                  <span className="font-serif tabular-nums text-black/45">
                    {item.weekCount} 周进入前三 · {item.mentions} 条
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="mt-10 font-serif text-[12px] tracking-[0.28em] text-black/35">
          CHAPTER 03 · 高频议题 · {week.rangeShort}
        </p>
        <section className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="paper-card rounded-[28px] p-6 sm:p-8">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="font-serif text-[11px] tracking-[0.28em] text-black/40">
                  CHAPTER 03 · ISSUE INDEX
                </p>
                <h2 className="mt-1 font-display text-2xl">本周类型</h2>
              </div>
              {categoryFilter !== "all" && (
                <button
                  type="button"
                  onClick={() => setCategoryFilter("all")}
                  className="text-[12px] tracking-wide text-black/45 hover:text-ink"
                >
                  清除筛选
                </button>
              )}
            </div>
            <ul className="mt-6 divide-y divide-black/8">
              {week.categories.map((item, index) => {
                const active = categoryFilter === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryFilter(active ? "all" : item.id);
                        scrollToId("quotes");
                      }}
                      className={cn(
                        "flex w-full gap-4 py-4 text-left transition-colors",
                        active && "-mx-3 rounded-2xl bg-mist px-3"
                      )}
                    >
                      <span className="w-8 shrink-0 font-serif text-lg text-black/30">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="font-display text-[17px]">{item.name}</span>
                        <span className="mt-1 block text-[13px] leading-5 text-black/50">
                          {item.summary}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block font-serif text-2xl leading-none tabular-nums">
                          {item.count}
                        </span>
                        <span className="text-[11px] text-black/35">
                          {pct(item.share)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="paper-card rounded-[28px] p-6 sm:p-8">
            <p className="font-serif text-[11px] tracking-[0.28em] text-black/40">
              SHARE
            </p>
            <h2 className="mt-1 font-display text-2xl">类型占比</h2>
            <ul className="mt-6 space-y-4">
              {week.categories.map((item) => (
                <li key={item.id}>
                  <div className="flex items-baseline justify-between gap-3 text-[13px]">
                    <span className="truncate">{item.name}</span>
                    <span className="shrink-0 tabular-nums text-black/40">
                      {item.count}
                    </span>
                  </div>
                  <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-black/8">
                    <div
                      className="h-full bg-ink"
                      style={{ width: `${Math.min(item.share * 100, 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="quotes"
          className="paper-card mt-5 rounded-[28px] p-6 sm:p-8"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-serif text-[11px] tracking-[0.28em] text-black/40">
                CHAPTER 04 · ORIGINAL VOICE
              </p>
              <h2 className="mt-1 font-display text-2xl">原话摘录</h2>
              <p className="mt-2 text-[13px] text-black/45">
                {selectedCategory
                  ? `正在看「${selectedCategory.name}」相关原话。`
                  : "表里摘出的玩家原文。"}
              </p>
            </div>
            <div className="flex w-full max-w-md items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/35" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜类型或原话"
                  className="h-10 rounded-full border-black/10 bg-mist pl-9"
                />
              </div>
              {(categoryFilter !== "all" || query.trim()) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-full border border-black/15 px-3 py-2 text-[12px] hover:bg-mist"
                >
                  重置
                </button>
              )}
            </div>
          </div>

          {quotes.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-black/15 px-6 py-16 text-center">
              <p className="font-display text-xl">没有匹配的原话</p>
              <p className="mt-2 text-sm text-black/45">
                换一个类型，或清空筛选后再看本周摘录。
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-full bg-ink px-4 py-2 text-sm text-white"
              >
                回到全部原话
              </button>
            </div>
          ) : (
            <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {quotes.map((quote) => (
                <li key={quote.id}>
                  <button
                    type="button"
                    onClick={() => setActiveQuote(quote)}
                    className="paper-card h-full w-full rounded-[22px] border border-black/5 p-5 text-left transition-transform hover:-translate-y-0.5"
                  >
                    <p className="text-[11px] tracking-wide text-black/40">
                      {quote.category}
                    </p>
                    <p className="mt-3 font-display text-[16px] leading-7">
                      “{quote.text}”
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="mt-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <p className="font-serif text-[12px] tracking-[0.28em] text-black/35">
            / COMMUNITY SENTIMENT
          </p>
          <p className="rounded-full border border-black/10 bg-white px-4 py-2 font-serif text-sm tracking-[0.18em]">
            社区看板
          </p>
        </footer>
      </div>

      {activeQuote && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-4 sm:items-center"
          onClick={() => setActiveQuote(null)}
        >
          <div
            className="paper-card relative max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-[28px] p-6 sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveQuote(null)}
              className="absolute right-4 top-4 rounded-full border border-black/10 p-2"
              aria-label="关闭"
            >
              <X className="size-4" />
            </button>
            <p className="font-serif text-[11px] tracking-[0.28em] text-black/40">
              QUOTE
            </p>
            <h3 className="mt-2 font-display text-2xl">原话详情</h3>
            <p className="mt-2 text-[13px] text-black/45">{activeQuote.category}</p>
            <p className="mt-5 font-display text-[18px] leading-8">
              “{activeQuote.text}”
            </p>
            <button
              type="button"
              onClick={() => {
                setCategoryFilter(activeQuote.categoryId);
                setActiveQuote(null);
              }}
              className="mt-6 rounded-full bg-ink px-4 py-2 text-sm text-white"
            >
              只看该类型
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
