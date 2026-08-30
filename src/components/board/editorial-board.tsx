"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";

import { FinderWindow } from "@/components/board/finder-window";
import { Input } from "@/components/ui/input";
import { statusLabel, typeMeta } from "@/lib/data";
import type { FeedbackType, Quote, WeekReport } from "@/lib/types";
import { cn } from "@/lib/utils";

const nav = [
  { id: "directory", label: "目录" },
  { id: "issues", label: "议题" },
  { id: "quotes", label: "原话" },
  { id: "loop", label: "闭环" },
] as const;

export function EditorialBoard({ weeks }: { weeks: WeekReport[] }) {
  const [weekId, setWeekId] = useState(weeks[0].id);
  const [typeFilter, setTypeFilter] = useState<FeedbackType | "all">("all");
  const [issueFilter, setIssueFilter] = useState<string | "all">("all");
  const [query, setQuery] = useState("");
  const [activeQuote, setActiveQuote] = useState<Quote | null>(null);

  const week = weeks.find((item) => item.id === weekId) ?? weeks[0];

  const quotes = useMemo(() => {
    return week.quotes.filter((quote) => {
      if (typeFilter !== "all" && quote.type !== typeFilter) return false;
      if (issueFilter !== "all" && quote.issueId !== issueFilter) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (
        quote.text.toLowerCase().includes(q) ||
        quote.user.toLowerCase().includes(q) ||
        quote.channel.toLowerCase().includes(q)
      );
    });
  }, [week, typeFilter, issueFilter, query]);

  const selectedIssue = week.issues.find((item) => item.id === issueFilter);

  function resetFilters() {
    setTypeFilter("all");
    setIssueFilter("all");
    setQuery("");
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
              H72 DISCORD · COMMUNITY BOARD
            </p>
            <h1 className="mt-2 font-display text-[34px] leading-none tracking-tight sm:text-[44px]">
              社区舆情看板
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">
              只看周报第四部分：收集反馈。把 Discord 里的缺陷、建议、吐槽和好评收成可跟进的议题，而不是逐日流水账。
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 lg:items-end">
            <p className="font-serif text-[15px] tracking-[0.22em] text-black/70">
              COLLECTED FEEDBACK · WEEK {week.weekNo}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {weeks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setWeekId(item.id);
                    resetFilters();
                  }}
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
          <span className="font-serif tracking-[0.28em] text-black/55">@H72</span>
          {nav.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "transition-colors hover:text-ink",
                index === 0 && "text-ink"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <section
          id="directory"
          className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6"
        >
          <article className="paper-card relative min-h-[340px] overflow-hidden rounded-[28px] p-7 sm:p-8">
            <span className="watermark absolute -right-2 top-10 text-[140px] sm:text-[168px]">
              04
            </span>
            <div className="relative flex items-start justify-between gap-4">
              <h2 className="font-serif text-[34px] leading-none tracking-[0.12em] sm:text-[42px]">
                DIRECTORY
              </h2>
              <p className="pt-1 text-right text-[10px] leading-4 tracking-[0.16em] text-black/40">
                volume {String(week.weekNo).padStart(2, "0")}
                <br />
                Collected Feedback
              </p>
            </div>
            <p className="relative mt-8 font-serif text-[15px] tracking-wide text-black/45">
              Chapter 04
            </p>
            <h3 className="relative mt-1 font-display text-[32px] leading-none sm:text-[38px]">
              <span className="font-serif">04</span> 收集反馈
            </h3>

            <FinderWindow
              className="relative mt-8"
              title={`Chapter 04 / week ${week.weekNo}`}
              path="H72 / Discord / 收集反馈"
            >
              <ul>
                {(
                  [
                    ["缺陷", week.types.bug.count, "bug"],
                    ["建议", week.types.suggestion.count, "suggestion"],
                    ["吐槽", week.types.complaint.count, "complaint"],
                    ["好评", week.types.praise.count, "praise"],
                  ] as const
                ).map(([label, count, type]) => (
                  <li key={type}>
                    <button
                      type="button"
                      onClick={() => {
                        setTypeFilter(type);
                        setIssueFilter("all");
                        document.getElementById("quotes")?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-[13px] hover:bg-white/70"
                    >
                      <span className="inline-flex size-7 items-center justify-center rounded-md bg-[#eadf9a]/80 text-[11px]">
                        ▣
                      </span>
                      <span className="flex-1">{label}</span>
                      <span className="font-serif text-base tabular-nums">
                        {count}
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-black/10" />
              <div className="absolute left-4 right-4 top-4 flex items-center justify-between text-[10px] tracking-[0.18em] text-white/80">
                <span>@H72 BOARD</span>
                <span>本周主线</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 max-w-[78%]">
                <p className="font-serif text-[11px] tracking-[0.28em] text-white/70">
                  WEEKLY NARRATIVE
                </p>
                <h3 className="mt-1 font-display text-[26px] leading-tight text-white sm:text-[32px]">
                  本周主线
                </h3>
                <p className="mt-2 text-[13px] leading-5 text-white/85">
                  {week.narrative}
                </p>
              </div>
              <div className="absolute bottom-4 right-4 hidden w-[92px] flex-col gap-2 sm:flex">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/40">
                  <Image
                    src="/editorial/rose-inset.jpg"
                    alt=""
                    fill
                    className="object-cover grayscale"
                    sizes="92px"
                  />
                </div>
                <div className="relative h-16 overflow-hidden rounded-xl border border-white/40">
                  <Image
                    src="/editorial/tulips.jpg"
                    alt=""
                    fill
                    className="object-cover grayscale"
                    sizes="92px"
                  />
                </div>
              </div>
            </div>
          </article>

          <article className="paper-card relative min-h-[320px] overflow-hidden rounded-[28px]">
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
                <span>@H72</span>
                <span>Feedback / Workflow</span>
              </div>
              <h2 className="mt-6 font-display text-[28px] leading-none sm:text-[34px]">
                反馈分类 / 工作流
              </h2>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(Object.keys(typeMeta) as FeedbackType[]).map((type) => {
                  const meta = typeMeta[type];
                  const active = typeFilter === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setTypeFilter(active ? "all" : type);
                        setIssueFilter("all");
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
                        {meta.no}
                      </p>
                      <p className="mt-2 font-serif text-lg leading-none">
                        {meta.en}
                      </p>
                      <p className="mt-1 text-[12px]">{meta.zh}</p>
                      <p className="mt-3 font-serif text-2xl tabular-nums">
                        {week.types[type].count}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-[11px]",
                          active ? "text-white/70" : "text-black/40"
                        )}
                      >
                        {week.types[type].delta >= 0 ? "+" : ""}
                        {week.types[type].delta} 周环比
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
                  ESTABLISH THE WEEKLY READ
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
                onClick={() =>
                  document.getElementById("issues")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
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
                <span>01</span>
                <span>High-frequency issues</span>
              </div>
              <div className="max-w-[28rem]">
                <p className="text-[14px] leading-6 text-white/85">
                  高频议题按重复次数排序。点一条，下面的原话会收成这一题。
                </p>
                <h2 className="mt-4 font-display text-[30px] leading-none text-white sm:text-[36px]">
                  高频议题
                </h2>
              </div>
            </div>
          </article>

          <article
            id="loop"
            className="paper-card relative min-h-[340px] overflow-hidden rounded-[28px] p-7 sm:p-8"
          >
            <span className="watermark absolute -right-1 top-8 text-[140px] sm:text-[168px]">
              05
            </span>
            <div className="relative flex items-start justify-between gap-4">
              <h2 className="font-serif text-[34px] leading-none tracking-[0.12em] sm:text-[42px]">
                DIRECTORY
              </h2>
              <p className="pt-1 text-right text-[10px] leading-4 tracking-[0.16em] text-black/40">
                volume {String(week.weekNo).padStart(2, "0")}
                <br />
                Follow-through
              </p>
            </div>
            <p className="relative mt-8 font-serif text-[15px] tracking-wide text-black/45">
              Chapter 05
            </p>
            <h3 className="relative mt-1 font-display text-[32px] leading-none sm:text-[38px]">
              <span className="font-serif">05</span> 处理闭环
            </h3>
            <FinderWindow
              className="relative mt-8"
              title={`Chapter 05 / pipeline`}
              path="待确认 / 已记录 / 已同步 / 已回复 / 关闭"
            >
              <ul>
                {week.pipeline.map((item) => (
                  <li
                    key={item.status}
                    className="flex items-center gap-3 px-3 py-2.5 text-[13px]"
                  >
                    <span className="inline-flex size-7 items-center justify-center rounded-md bg-white text-[11px]">
                      ▢
                    </span>
                    <span className="flex-1">{item.label}</span>
                    <span className="font-serif text-base tabular-nums">
                      {item.count}
                    </span>
                  </li>
                ))}
              </ul>
            </FinderWindow>
          </article>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {[
            ["有效反馈", week.totals.feedback, `${week.totals.feedbackDelta >= 0 ? "+" : ""}${week.totals.feedbackDelta}%`],
            ["发言人数", week.totals.uniqueReporters, "本周"],
            ["已同步研发", week.totals.synced, "闭环"],
            ["待确认", week.totals.pending, "需盯"],
            ["已回复社区", week.totals.replied, "可见"],
            [
              "正向率",
              `${week.sentiment.positive}%`,
              `负向 ${week.sentiment.negative}%`,
            ],
          ].map(([label, value, note]) => (
            <div
              key={label}
              className="paper-card rounded-[22px] px-4 py-4"
            >
              <p className="text-[11px] tracking-[0.14em] text-black/40">
                {label}
              </p>
              <p className="mt-2 font-serif text-[28px] leading-none tabular-nums">
                {value}
              </p>
              <p className="mt-2 text-[11px] text-black/40">{note}</p>
            </div>
          ))}
        </section>

        <section className="paper-card mt-5 rounded-[28px] p-6 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-serif text-[11px] tracking-[0.28em] text-black/40">
                SENTIMENT ARC
              </p>
              <h2 className="mt-1 font-display text-2xl">情绪弧线</h2>
            </div>
            <p className="max-w-md text-[13px] leading-5 text-black/45">
              柱高是当日反馈量，深色是负向占比。点日期可筛原话。
            </p>
          </div>
          <div className="mt-8 flex items-end gap-2 sm:gap-3">
            {week.daily.map((day) => {
              const height = 36 + day.volume * 6;
              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => setQuery(day.date)}
                  className="group flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="relative w-full max-w-12 overflow-hidden rounded-full bg-black/8"
                    style={{ height }}
                  >
                    <span
                      className="absolute bottom-0 left-0 right-0 bg-ink/80"
                      style={{ height: `${day.negative}%` }}
                    />
                  </div>
                  <span className="font-serif text-sm text-black/50 group-hover:text-ink">
                    {day.label}
                  </span>
                  <span className="text-[10px] tabular-nums text-black/35">
                    {day.date.slice(3)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="paper-card rounded-[28px] p-6 sm:p-8">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="font-serif text-[11px] tracking-[0.28em] text-black/40">
                  ISSUE INDEX
                </p>
                <h2 className="mt-1 font-display text-2xl">议题目录</h2>
              </div>
              {issueFilter !== "all" && (
                <button
                  type="button"
                  onClick={() => setIssueFilter("all")}
                  className="text-[12px] tracking-wide text-black/45 hover:text-ink"
                >
                  清除议题筛选
                </button>
              )}
            </div>
            <ul className="mt-6 divide-y divide-black/8">
              {week.issues.map((issue, index) => {
                const active = issueFilter === issue.id;
                return (
                  <li key={issue.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setIssueFilter(active ? "all" : issue.id);
                        setTypeFilter("all");
                        document.getElementById("quotes")?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                      className={cn(
                        "flex w-full gap-4 py-4 text-left transition-colors",
                        active && "bg-mist -mx-3 rounded-2xl px-3"
                      )}
                    >
                      <span className="w-8 shrink-0 font-serif text-lg text-black/30">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-[17px]">
                            {issue.title}
                          </span>
                          {issue.priority && (
                            <span className="rounded-full border border-black/15 px-2 py-0.5 text-[10px] tracking-wider">
                              {issue.priority}
                            </span>
                          )}
                          <span className="text-[11px] text-black/40">
                            {typeMeta[issue.type].zh} · {statusLabel[issue.status]}
                          </span>
                        </span>
                        <span className="mt-1 block text-[13px] leading-5 text-black/50">
                          {issue.summary}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block font-serif text-2xl leading-none tabular-nums">
                          {issue.mentions}
                        </span>
                        <span className="text-[11px] text-black/35">
                          {issue.delta >= 0 ? "+" : ""}
                          {issue.delta} 条
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
              CHANNELS
            </p>
            <h2 className="mt-1 font-display text-2xl">来源频道</h2>
            <ul className="mt-6 space-y-4">
              {week.channels.map((channel) => {
                const max = week.channels[0]?.count || 1;
                return (
                  <li key={channel.name}>
                    <div className="flex items-baseline justify-between text-[13px]">
                      <span className="font-serif">{channel.name}</span>
                      <span className="tabular-nums text-black/40">
                        {channel.count}
                      </span>
                    </div>
                    <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-black/8">
                      <div
                        className="h-full bg-ink"
                        style={{ width: `${(channel.count / max) * 100}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-8 text-[12px] leading-5 text-black/40">
              #bug-report 仍是缺陷主入口。#general
              的建议容易被组队消息盖住，这是拆频道的证据，不是观感。
            </p>
          </div>
        </section>

        <section
          id="quotes"
          className="paper-card mt-5 rounded-[28px] p-6 sm:p-8"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-serif text-[11px] tracking-[0.28em] text-black/40">
                ORIGINAL VOICE
              </p>
              <h2 className="mt-1 font-display text-2xl">原话摘录</h2>
              <p className="mt-2 text-[13px] text-black/45">
                {selectedIssue
                  ? `正在看「${selectedIssue.title}」相关原话。`
                  : typeFilter === "all"
                    ? "从 Discord 线程里抽出的可引用句子。"
                    : `正在看「${typeMeta[typeFilter].zh}」分类。`}
              </p>
            </div>
            <div className="flex w-full max-w-md items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/35" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜用户、频道或原话"
                  className="h-10 rounded-full border-black/10 bg-mist pl-9"
                />
              </div>
              {(typeFilter !== "all" ||
                issueFilter !== "all" ||
                query.trim()) && (
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
                换一个分类，或清空筛选后再看本周摘录。
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
                    <div className="flex items-center justify-between gap-3 text-[11px] tracking-wide text-black/40">
                      <span>
                        {quote.user} · {quote.channel}
                      </span>
                      <span>{quote.time}</span>
                    </div>
                    <p className="mt-3 font-display text-[16px] leading-7">
                      “{quote.text}”
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-black/45">
                      <span className="rounded-full bg-mist px-2 py-0.5">
                        {typeMeta[quote.type].zh}
                      </span>
                      <span className="rounded-full bg-mist px-2 py-0.5">
                        {statusLabel[quote.status]}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="mt-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <p className="font-serif text-[12px] tracking-[0.28em] text-black/35">
            / EDITORIAL LAYOUT · SECTION IV
          </p>
          <p className="rounded-full border border-black/10 bg-white px-4 py-2 font-serif text-sm tracking-[0.18em]">
            @H72 BOARD
          </p>
        </footer>
      </div>

      {activeQuote && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-4 sm:items-center"
          onClick={() => setActiveQuote(null)}
        >
          <div
            className="paper-card relative w-full max-w-xl rounded-[28px] p-6 sm:p-8"
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
            <p className="mt-5 font-display text-[18px] leading-8">
              “{activeQuote.text}”
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <dt className="text-black/40">成员</dt>
                <dd>{activeQuote.user}</dd>
              </div>
              <div>
                <dt className="text-black/40">频道</dt>
                <dd>{activeQuote.channel}</dd>
              </div>
              <div>
                <dt className="text-black/40">时间</dt>
                <dd>{activeQuote.time}</dd>
              </div>
              <div>
                <dt className="text-black/40">状态</dt>
                <dd>{statusLabel[activeQuote.status]}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => {
                setIssueFilter(activeQuote.issueId);
                setActiveQuote(null);
              }}
              className="mt-6 rounded-full bg-ink px-4 py-2 text-sm text-white"
            >
              只看该议题
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
