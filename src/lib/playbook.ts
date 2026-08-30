import type { CategoryRow, StandingIssue, WeekReport } from "@/lib/types";

export type IssueAdvice = {
  family: string;
  product: string[];
  ops: string[];
};

type Playbook = {
  product: string[];
  ops: string[];
};

const FAMILY_RULES: [RegExp, string][] = [
  [/探索|地图|wwmmap|收集品|宝箱追踪/i, "探索与地图"],
  [/家园|宠物|家具|建造/i, "家园系统"],
  [/武学|Martial Arts|武器类型|天赋|内功/i, "武学内容"],
  [/主线|剧情|章节|解谜|Main Chapter/i, "主线与内容"],
  [/战斗|平衡|PVP|GVG|竞技|Combat|Fluency|拳套|调律/i, "战斗与平衡"],
  [/Bug|性能|技术|延迟|网络|服务器|Platform|闪退|卡顿/i, "性能与技术"],
  [/社交|公会|匹配|聊天|Guild|好友|宗派/i, "社交与公会"],
  [/外观|美术|视听|建模|Art|Outfit|Cosmetic|染色|穿模/i, "外观与视听"],
  [/界面|交互|Interface|UI|邮箱|衣柜|buff面板/i, "界面与交互"],
  [/新玩法|New Gameplay|活动|小游戏|Event|Minigame|Cutie/i, "活动与奖励"],
  [/经济|付费|抽卡|奖励|战令|商店|保底|体力/i, "经济与付费"],
  [/语言|文本|翻译|Language|字幕|本地化/i, "语言与文本"],
  [/控制|易用|无障碍|Accessibility|操作|键位|手柄/i, "操作与无障碍"],
];

const PLAYBOOKS: Record<string, Playbook> = {
  战斗与平衡: {
    product: [
      "把反复点名的调律冷却、流派强度和 GVG 判定收成一次平衡补丁，并写清改了什么、没改什么。",
      "云游戏或高延迟单独标识或分池，减少被当成作弊的误伤。",
    ],
    ops: [
      "在 PVP / GVG 频道置顶「本周已知平衡问题」：哪些在查、哪些已排期、哪些暂不改。",
      "用固定模板征集对局：模式 + 平台 + 录像或时间戳，打包给策划，不在频道里空吵。",
    ],
  },
  性能与技术: {
    product: [
      "按平台拆性能：主机降特效、帧率优先模式、大型团战可见性，优先修能稳定复现的闪退和卡死。",
      "区域延迟和跨服请求单独建表，避免和客户端 Bug 混在一条需求里。",
    ],
    ops: [
      "置顶机型 / 平台 / 网络收集表，只收能复现的截图和日志，不收纯骂战。",
      "云游戏、主机、PC 分帖说明已知限制，减少「作弊 / 优待」误传。",
    ],
  },
  社交与公会: {
    product: [
      "世界频道刷屏用分区或等级门槛压，公会战匹配按人数或繁荣度拉开档，给管理侧群发邮件和职位自定义。",
      "跨平台匹配做成开关，避免强行混池。",
    ],
    ops: [
      "公示世界频道规则和举报入口，低等级广告号先人工抽查一周再决定要不要加硬限制。",
      "给公会管理开固定答疑帖：开战时间协商、建造成本、职位权限，把重复问题收成 FAQ。",
    ],
  },
  外观与视听: {
    product: [
      "付费外观补全染色位，优先修高价或热门外观穿模；联动外观尽量全球同步上线。",
      "基础体型比例和披风物理单独排期，不要和外观点装需求绑死。",
    ],
    ops: [
      "开穿模征集帖：外观名 + 部位截图 + 男女体型，满 20 条就打包给美术，不零散@。",
      "联动和返场只同步已公开信息，把「全球服有没有」做成计数，交给商务，不在频道承诺日期。",
    ],
  },
  界面与交互: {
    product: [
      "开关类需求（演奏时看聊天、组队自动通过、邮箱搜索、衣柜拆分类、UI 自定义）先做清单，再排开发。",
      "武学手册补全掉落和获取路径，减少玩家去第三方查表。",
    ],
    ops: [
      "每周把前三交互诉求做成三选一投票，下周一把票数和原话链接发给 UX。",
      "把「能加开关」和「要做新系统」拆开贴，避免所有界面问题都挤成一条无解帖。",
    ],
  },
  经济与付费: {
    product: [
      "保底、返场、战令商店兑换和体力上限分开评估，先动玩家感知最强的冷却和无效消耗。",
      "麻将筹码等闲置货币给兑换出口，减少「钱废了」的积怨。",
    ],
    ops: [
      "付费和保底只转述官方说明，不代为承诺返场或降价。",
      "每月做一次「战令 / 商店最缺什么」短问卷，结果进看板，不在频道里辩论物价。",
    ],
  },
  家园系统: {
    product: [
      "建造上限、撤销重做、材料一键调取和家具浮空是同一组卡点，优先修操作而不是再加外观家具。",
      "宠物和鸟类等新品类可以投票定优先级，但不要压过建造稳定性。",
    ],
    ops: [
      "收集「卡在哪一步」截图：上限、浮空、材料不够，按步骤分类后给家园组。",
      "宠物品类做一次限时投票，只把前三名报上去，避免每周换一个动物吵。",
    ],
  },
  武学内容: {
    product: [
      "治疗等空缺职业补武学和武器评估要单独立项；过强闪避和鸡肋天赋分开调，避免一刀切削弱。",
      "新武器呼声（长棍、镰刀、双扇）给制作组一份按提及次数排的清单，而不是跟帖点名。",
    ],
    ops: [
      "武学频道只置顶「本周在调的流派」，过气争论收进周报，不再逐条回复。",
      "新武器 / 新武学投票每月一次，结果和样本原话一起交给内容组。",
    ],
  },
  探索与地图: {
    product: [
      "官方同步地图或重新开放 API，先覆盖宝箱、任务、NPC、收集品四类进度。",
      "训练假人自定义和世界频道过滤不要跟地图绑在同一个需求里。",
    ],
    ops: [
      "统计玩家现在用哪些第三方地图功能，列成「必须有的追踪项」给制作组。",
      "第三方地图链接只放工具子区，并写清非官方、进度可能不同步。",
    ],
  },
  主线与内容: {
    product: [
      "解谜交互加可访问性（选中描边 / 全涂色），主线奖励和更新节奏单独看，不要用新外观顶内容空窗。",
      "卡关点按区域收清单，优先修提示不清晰，而不是加剧情长度。",
    ],
    ops: [
      "隐山等解谜卡关开收集帖：区域 + 关卡名 + 卡在哪一步。",
      "主线更新只同步官方日历，不编「下个月一定有」。",
    ],
  },
  语言与文本: {
    product: [
      "错译和技能描述对不上优先修战斗相关文本；小语种版本按呼声排队，不一次铺开。",
      "多字幕包作为可选开关评估，不默认打开以免界面过载。",
    ],
    ops: [
      "错译收集模板：界面位置 + 原文 + 错译截图，满一批再给本地化。",
      "意大利语、印尼语等做一次意愿投票，把人数而不是情绪交给本地化排期。",
    ],
  },
  操作与无障碍: {
    product: [
      "VFX / 其他玩家特效开关、键位导出导入、主机键鼠，对性能和偏头痛是同一类可访问性，应进设置而不是藏在频道教程。",
      "休闲活动加人机匹配，对准非高峰空服，而不是改匹配分。",
    ],
    ops: [
      "主机和键鼠玩家单独收一周诉求，标题写平台，避免和 PC UI 混谈。",
      "若已有关闭特效路径，置顶截图教程；没有就明确写进本周需求，不空口教。",
    ],
  },
  活动与奖励: {
    product: [
      "热门小游戏转永久要看留存，不是看吵得凶；赛季任务判定错误优先于加新活动。",
      "人机或练习模式给非高峰玩家一条能完成的路。",
    ],
    ops: [
      "活动周在公告区写清时限、奖励和已知 Bug，过期立刻归档。",
      "「转永久」只做一次计数投票，把同时段在线感受和票数一起报，不周周重开。",
    ],
  },
  其他: {
    product: [
      "杂项按能否一周内关掉分类：能开关的进设置，能修的进 Bug 表，剩下的进下期观察。",
    ],
    ops: [
      "每周五把未归类原话扫一遍，能回答的回答，不能的标「已记录」后结束贴，避免滚楼。",
    ],
  },
};

export function familyName(name: string): string {
  for (const [pattern, label] of FAMILY_RULES) {
    if (pattern.test(name)) return label;
  }
  return "其他";
}

function playbookOf(family: string): Playbook {
  return PLAYBOOKS[family] ?? PLAYBOOKS["其他"];
}

export function splitAdvice(text: string): string[] {
  const normalized = text.trim();
  if (!normalized) return [];
  const primary = /[；;]/.test(normalized)
    ? normalized.split(/[；;]/)
    : normalized.split(/[。\n]/);
  const parts = primary.flatMap((part) => {
    const trimmed = part.trim();
    if (trimmed.length > 72 && trimmed.includes("，")) {
      return trimmed.split("，");
    }
    return [trimmed];
  });
  return uniqueKeep(
    parts
      .map((part) => part.trim().replace(/^[•\-\d\.、]+\s*/, ""))
      .map((part) => part.replace(/[。]+$/, ""))
      .filter((part) => part.length >= 8)
      .map((part) => (part.endsWith("。") ? part : `${part}。`)),
    4
  );
}

function uniqueKeep(items: string[], limit: number): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of items) {
    const key = item.slice(0, 18);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
    if (result.length >= limit) break;
  }
  return result;
}

export function adviseCategory(category: CategoryRow): IssueAdvice {
  const family = familyName(category.name);
  const book = playbookOf(family);
  const fromSheet = splitAdvice(category.suggestion);
  return {
    family,
    product: uniqueKeep([...fromSheet, ...book.product], 3),
    ops: book.ops.slice(0, 2),
  };
}

export function adviseWeek(week: WeekReport): IssueAdvice {
  const product: string[] = [];
  const ops: string[] = [];
  for (const category of week.categories.slice(0, 4)) {
    const advice = adviseCategory(category);
    product.push(...advice.product.slice(0, 1));
    ops.push(...advice.ops.slice(0, 1));
  }
  return {
    family: "本周",
    product: uniqueKeep(product, 4),
    ops: uniqueKeep(ops, 4),
  };
}

export function adviseStanding(
  name: string,
  recentSuggestions: string[]
): Pick<StandingIssue, "product" | "ops"> {
  const book = playbookOf(name);
  const fromRecent = recentSuggestions.flatMap(splitAdvice);
  return {
    product: uniqueKeep([...fromRecent, ...book.product], 2),
    ops: book.ops.slice(0, 2),
  };
}
