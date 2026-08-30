import { adviseStanding, familyName } from "@/lib/playbook";
import raw from "./feedback.json";
import type { BoardOverall, StandingIssue, WeekReport } from "./types";

export const weeks = raw.weeks as WeekReport[];

export function summarizeBoard(allWeeks: WeekReport[]): BoardOverall {
  const chronological = [...allWeeks].reverse();
  const feedback = allWeeks.reduce((sum, week) => sum + week.total, 0);
  const trend = chronological.map((week) => ({
    id: week.id,
    label: week.label,
    range: week.rangeShort,
    volume: week.total,
  }));

  const standingMap = new Map<
    string,
    StandingIssue & { recent: string[] }
  >();
  for (const week of chronological) {
    for (const category of week.categories.slice(0, 3)) {
      const name = familyName(category.name);
      const prev = standingMap.get(name);
      if (!prev) {
        standingMap.set(name, {
          name,
          weekCount: 1,
          mentions: category.count,
          product: [],
          ops: [],
          recent: category.suggestion ? [category.suggestion] : [],
        });
      } else {
        prev.weekCount += 1;
        prev.mentions += category.count;
        if (category.suggestion) prev.recent.push(category.suggestion);
      }
    }
  }

  const standing = [...standingMap.values()]
    .filter((item) => item.weekCount >= 4 && item.name !== "其他")
    .sort((a, b) => b.weekCount - a.weekCount || b.mentions - a.mentions)
    .slice(0, 6)
    .map(({ recent, ...item }) => ({
      ...item,
      ...adviseStanding(item.name, recent.slice(-3)),
    }));

  const catTotals = new Map<string, number>();
  for (const week of allWeeks) {
    for (const category of week.categories) {
      const name = familyName(category.name);
      catTotals.set(name, (catTotals.get(name) || 0) + category.count);
    }
  }
  const topCategories = [...catTotals.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const first = chronological[0];
  const latest = chronological[chronological.length - 1];
  const standingTitles = standing
    .slice(0, 3)
    .map((item) => item.name)
    .join("、");

  return {
    weekCount: allWeeks.length,
    range: `${first.range.slice(0, 10)} — ${latest.range.slice(-5)}`,
    feedback,
    standing,
    trend,
    topCategories,
    narrative: `近 ${allWeeks.length} 周累计有效反馈 ${feedback} 条。反复出现的是${standingTitles}。单周情绪不能代替这条跨周主线，处理办法在建议一章。`,
    judgment:
      "先看跨周反复出现的类型，再点进某一周。改法和运营动作集中在建议一章。",
  };
}
