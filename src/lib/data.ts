import raw from "./feedback.json";
import type { BoardOverall, StandingIssue, WeekReport } from "./types";

export const weeks = raw.weeks as WeekReport[];

const FAMILY_RULES: [RegExp, string][] = [
  [/战斗|平衡|PVP|竞技|Combat/i, "战斗与平衡"],
  [/Bug|性能|技术|延迟|网络|服务器/i, "性能与技术"],
  [/社交|公会|匹配/i, "社交与公会"],
  [/外观|美术|视听|建模|Art/i, "外观与视听"],
  [/界面|交互|Interface/i, "界面与交互"],
  [/经济|付费|抽卡|奖励/i, "经济与付费"],
  [/家园/i, "家园系统"],
  [/武学|Martial/i, "武学内容"],
  [/探索/i, "探索与地图"],
];

function familyName(name: string): string {
  for (const [pattern, label] of FAMILY_RULES) {
    if (pattern.test(name)) return label;
  }
  return name;
}

export function summarizeBoard(allWeeks: WeekReport[]): BoardOverall {
  const chronological = [...allWeeks].reverse();
  const feedback = allWeeks.reduce((sum, week) => sum + week.total, 0);
  const trend = chronological.map((week) => ({
    id: week.id,
    label: week.label,
    range: week.rangeShort,
    volume: week.total,
  }));

  const standingMap = new Map<string, StandingIssue>();
  for (const week of chronological) {
    for (const category of week.categories.slice(0, 3)) {
      const name = familyName(category.name);
      const prev = standingMap.get(name);
      if (!prev) {
        standingMap.set(name, {
          name,
          weekCount: 1,
          mentions: category.count,
        });
      } else {
        prev.weekCount += 1;
        prev.mentions += category.count;
      }
    }
  }

  const standing = [...standingMap.values()]
    .filter((item) => item.weekCount >= 4)
    .sort((a, b) => b.weekCount - a.weekCount || b.mentions - a.mentions)
    .slice(0, 6);

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
    narrative: `近 ${allWeeks.length} 周累计有效反馈 ${feedback} 条。反复出现的是${standingTitles}。单周情绪不能代替这条跨周主线，点进某一周只看当周结构。`,
    judgment:
      "先看跨周反复出现的类型，再看本周新冒头的条目。表里的分类每周口径会变，整体按主题归并。",
  };
}
