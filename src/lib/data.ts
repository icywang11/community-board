import type {
  BoardOverall,
  FeedbackType,
  StandingIssue,
  WeekReport,
} from "./types";

export const typeMeta: Record<
  FeedbackType,
  { no: string; en: string; zh: string; hint: string }
> = {
  bug: {
    no: "01",
    en: "Bugs",
    zh: "缺陷",
    hint: "可复现、影响使用的问题。先确认再同步研发。",
  },
  suggestion: {
    no: "02",
    en: "Direction",
    zh: "建议",
    hint: "频道结构、体验与功能方向。重复出现才进入议题。",
  },
  complaint: {
    no: "03",
    en: "Friction",
    zh: "吐槽",
    hint: "情绪出口。要拆成可跟进的问题，而不是原样上报。",
  },
  praise: {
    no: "04",
    en: "Signal",
    zh: "好评",
    hint: "值得保留的做法。写进下周运营，避免只记差评。",
  },
};

export const statusLabel = {
  new: "待确认",
  logged: "已记录",
  synced: "已同步研发",
  replied: "已回复社区",
  closed: "已关闭",
} as const;

export const weeks: WeekReport[] = [
  {
    id: "w35",
    weekNo: 35,
    range: "2026.08.24 — 08.30",
    rangeShort: "08.24 – 08.30",
    narrative:
      "本周有效反馈 86 条，环比 +18%。负向不是大盘翻车，而是两条产品链路在周二把情绪面拉下去：登录验证码收不到、周末活动奖励延迟到账。周四补偿公告发出后，正向率从 52% 回到 71%。语音房卡顿被活动热度盖住，已连续三周出现。",
    judgment:
      "先修登录与发奖，再拆 #general。不要把周均负向率读成社区全面恶化。",
    totals: {
      feedback: 86,
      feedbackDelta: 18,
      uniqueReporters: 47,
      synced: 22,
      pending: 15,
      replied: 40,
    },
    types: {
      bug: { count: 31, delta: 9 },
      suggestion: { count: 28, delta: 4 },
      complaint: { count: 18, delta: 3 },
      praise: { count: 9, delta: 2 },
    },
    sentiment: { negative: 41, neutral: 28, positive: 31 },
    daily: [
      { date: "08-24", label: "一", positive: 64, negative: 22, volume: 9 },
      { date: "08-25", label: "二", positive: 48, negative: 41, volume: 18 },
      { date: "08-26", label: "三", positive: 51, negative: 36, volume: 14 },
      { date: "08-27", label: "四", positive: 62, negative: 24, volume: 12 },
      { date: "08-28", label: "五", positive: 68, negative: 19, volume: 11 },
      { date: "08-29", label: "六", positive: 71, negative: 16, volume: 13 },
      { date: "08-30", label: "日", positive: 69, negative: 18, volume: 9 },
    ],
    issues: [
      {
        id: "login-otp",
        title: "登录验证码收不到",
        summary:
          "Gmail / Outlook 均有复现，线程内 12 人确认。周二 21:00 起集中爆发，是本周负向的第一引擎。",
        type: "bug",
        priority: "P0",
        mentions: 12,
        delta: 12,
        status: "synced",
        owner: "账号",
      },
      {
        id: "reward-delay",
        title: "周末活动奖励延迟到账",
        summary:
          "补偿已发公告，但仍有人在 #events 追问到账时间。需要给一个可核对的发放窗口。",
        type: "bug",
        priority: "P1",
        mentions: 9,
        delta: 6,
        status: "replied",
        owner: "活动",
      },
      {
        id: "voice-lag",
        title: "语音房卡顿掉线",
        summary:
          "连续三周出现。本周被活动讨论盖住，不处理会在周报里变成下一轮负面事件。",
        type: "complaint",
        priority: "P1",
        mentions: 5,
        delta: 1,
        status: "logged",
        owner: "语音",
      },
      {
        id: "dark-mode",
        title: "希望增加夜间模式",
        summary:
          "建议里重复度最高的体验项。不是事故，但已经够进需求池。",
        type: "suggestion",
        priority: "P2",
        mentions: 7,
        delta: 3,
        status: "logged",
        owner: "体验",
      },
      {
        id: "split-general",
        title: "拆分 #general 刷屏",
        summary:
          "反馈、组队、闲聊混在一个频道，有效建议被冲掉。多位老成员点名要拆。",
        type: "suggestion",
        priority: "P2",
        mentions: 6,
        delta: 2,
        status: "new",
        owner: "社区",
      },
      {
        id: "weekend-host",
        title: "周末主持与新表情包",
        summary:
          "本周明确好评。主持节奏和新表情是少数被点名「请继续」的运营动作。",
        type: "praise",
        priority: null,
        mentions: 4,
        delta: 4,
        status: "closed",
        owner: "运营",
      },
    ],
    pipeline: [
      { status: "new", label: "待确认", count: 15 },
      { status: "logged", label: "已记录", count: 18 },
      { status: "synced", label: "已同步研发", count: 22 },
      { status: "replied", label: "已回复社区", count: 22 },
      { status: "closed", label: "已关闭", count: 9 },
    ],
    channels: [
      { name: "#bug-report", count: 24 },
      { name: "#feedback", count: 19 },
      { name: "#events", count: 16 },
      { name: "#general", count: 15 },
      { name: "#voice-lobby", count: 8 },
      { name: "#announcements", count: 4 },
    ],
    quotes: [
      {
        id: "q1",
        user: "mira.k",
        channel: "#bug-report",
        type: "bug",
        sentiment: "negative",
        issueId: "login-otp",
        time: "08-25 21:14",
        text: "连续两天收不到登录验证码，换了 Outlook 还是没有。已经有三个人在这条线程里复现了。",
        status: "synced",
      },
      {
        id: "q2",
        user: "nori",
        channel: "#bug-report",
        type: "bug",
        sentiment: "negative",
        issueId: "login-otp",
        time: "08-25 21:31",
        text: "Gmail 垃圾箱也没有。用手机流量试过，不是网络问题。",
        status: "synced",
      },
      {
        id: "q3",
        user: "阿白",
        channel: "#events",
        type: "bug",
        sentiment: "negative",
        issueId: "reward-delay",
        time: "08-24 23:48",
        text: "活动显示我已经完成，背包里还是空的。这是第三次发奖卡住了。",
        status: "replied",
      },
      {
        id: "q4",
        user: "kelvin",
        channel: "#events",
        type: "complaint",
        sentiment: "mixed",
        issueId: "reward-delay",
        time: "08-25 10:02",
        text: "补偿公告看到了，但能不能给一个到账时间？现在每次都是「处理中」。",
        status: "replied",
      },
      {
        id: "q5",
        user: "sora",
        channel: "#feedback",
        type: "suggestion",
        sentiment: "neutral",
        issueId: "dark-mode",
        time: "08-26 01:17",
        text: "晚上看公告白得刺眼。别的社区都有夜间模式了，这个真的可以排进下个迭代吗？",
        status: "logged",
      },
      {
        id: "q6",
        user: "juniper",
        channel: "#general",
        type: "suggestion",
        sentiment: "neutral",
        issueId: "split-general",
        time: "08-26 19:40",
        text: "#general 现在是组队、吐槽、建议混在一起。有效反馈刷两屏就没了，建议拆一个 #lfg。",
        status: "new",
      },
      {
        id: "q7",
        user: "echo",
        channel: "#voice-lobby",
        type: "complaint",
        sentiment: "negative",
        issueId: "voice-lag",
        time: "08-27 22:05",
        text: "语音房进门就卡，说话有明显延迟。上周也是，不是我一个人的网络。",
        status: "logged",
      },
      {
        id: "q8",
        user: "lark",
        channel: "#announcements",
        type: "praise",
        sentiment: "positive",
        issueId: "weekend-host",
        time: "08-29 20:33",
        text: "这周主持节奏很好，新表情也可爱。求固定成周末档，不要又消失一个月。",
        status: "closed",
      },
      {
        id: "q9",
        user: "tea.leaf",
        channel: "#feedback",
        type: "suggestion",
        sentiment: "positive",
        issueId: "dark-mode",
        time: "08-28 00:12",
        text: "如果做夜间模式，希望公告图也出深色版，不然还是会闪。",
        status: "logged",
      },
      {
        id: "q10",
        user: "rowan",
        channel: "#bug-report",
        type: "bug",
        sentiment: "negative",
        issueId: "login-otp",
        time: "08-26 08:44",
        text: "官方说已记录，但新人现在进不来。建议先在欢迎频道置顶替代登录方式。",
        status: "synced",
      },
      {
        id: "q11",
        user: "moth",
        channel: "#general",
        type: "suggestion",
        sentiment: "neutral",
        issueId: "split-general",
        time: "08-27 14:21",
        text: "赞成拆频道。现在想回一条建议，先要翻过二十条组队车。",
        status: "new",
      },
      {
        id: "q12",
        user: "疋疋",
        channel: "#events",
        type: "praise",
        sentiment: "positive",
        issueId: "weekend-host",
        time: "08-30 11:06",
        text: "补偿发到了，感谢。周末活动本身好玩，卡的是发放，不是玩法。",
        status: "closed",
      },
    ],
  },
  {
    id: "w34",
    weekNo: 34,
    range: "2026.08.17 — 08.23",
    rangeShort: "08.17 – 08.23",
    narrative:
      "上周有效反馈 73 条。主线是新表情包上线后的正向讨论，以及语音房卡顿开始从个例变成重复信号。没有 P0 事故，负向分散，容易被当成「这周还行」而漏掉慢性问题。",
    judgment:
      "表情包是加分项。语音房已经该立项，不要等它变成事故再写进周报。",
    totals: {
      feedback: 73,
      feedbackDelta: -4,
      uniqueReporters: 41,
      synced: 11,
      pending: 19,
      replied: 31,
    },
    types: {
      bug: { count: 22, delta: -2 },
      suggestion: { count: 24, delta: 1 },
      complaint: { count: 15, delta: 2 },
      praise: { count: 12, delta: 5 },
    },
    sentiment: { negative: 33, neutral: 31, positive: 36 },
    daily: [
      { date: "08-17", label: "一", positive: 58, negative: 24, volume: 8 },
      { date: "08-18", label: "二", positive: 61, negative: 21, volume: 10 },
      { date: "08-19", label: "三", positive: 55, negative: 28, volume: 12 },
      { date: "08-20", label: "四", positive: 63, negative: 20, volume: 9 },
      { date: "08-21", label: "五", positive: 70, negative: 16, volume: 14 },
      { date: "08-22", label: "六", positive: 74, negative: 14, volume: 12 },
      { date: "08-23", label: "日", positive: 66, negative: 18, volume: 8 },
    ],
    issues: [
      {
        id: "voice-lag",
        title: "语音房卡顿掉线",
        summary: "从 3 条升到 4 条。还没有集中爆发，但是同一批老用户在重复提。",
        type: "complaint",
        priority: "P1",
        mentions: 4,
        delta: 1,
        status: "logged",
        owner: "语音",
      },
      {
        id: "dark-mode",
        title: "希望增加夜间模式",
        summary: "建议区连续出现，尚未形成共识帖。",
        type: "suggestion",
        priority: "P2",
        mentions: 4,
        delta: 2,
        status: "new",
        owner: "体验",
      },
      {
        id: "weekend-host",
        title: "新表情包上线",
        summary: "周五发布后成为全周最清晰的正向事件。",
        type: "praise",
        priority: null,
        mentions: 8,
        delta: 8,
        status: "closed",
        owner: "运营",
      },
      {
        id: "split-general",
        title: "拆分 #general 刷屏",
        summary: "有人提，但还没有形成重复议题。",
        type: "suggestion",
        priority: "P2",
        mentions: 4,
        delta: 1,
        status: "new",
        owner: "社区",
      },
    ],
    pipeline: [
      { status: "new", label: "待确认", count: 19 },
      { status: "logged", label: "已记录", count: 16 },
      { status: "synced", label: "已同步研发", count: 11 },
      { status: "replied", label: "已回复社区", count: 16 },
      { status: "closed", label: "已关闭", count: 11 },
    ],
    channels: [
      { name: "#general", count: 21 },
      { name: "#feedback", count: 17 },
      { name: "#bug-report", count: 14 },
      { name: "#announcements", count: 11 },
      { name: "#voice-lobby", count: 6 },
      { name: "#events", count: 4 },
    ],
    quotes: [
      {
        id: "p1",
        user: "lark",
        channel: "#announcements",
        type: "praise",
        sentiment: "positive",
        issueId: "weekend-host",
        time: "08-21 19:02",
        text: "新表情包也太准了，已全频道滥用。求再出一套活动限定。",
        status: "closed",
      },
      {
        id: "p2",
        user: "echo",
        channel: "#voice-lobby",
        type: "complaint",
        sentiment: "negative",
        issueId: "voice-lag",
        time: "08-19 22:40",
        text: "晚上高峰语音会吞字。不是每次，但一周能碰到三四次。",
        status: "logged",
      },
      {
        id: "p3",
        user: "sora",
        channel: "#feedback",
        type: "suggestion",
        sentiment: "neutral",
        issueId: "dark-mode",
        time: "08-20 01:05",
        text: "求夜间模式。我是时差党，每次打开公告都像开灯。",
        status: "new",
      },
      {
        id: "p4",
        user: "juniper",
        channel: "#general",
        type: "suggestion",
        sentiment: "neutral",
        issueId: "split-general",
        time: "08-22 16:18",
        text: "组队和反馈能不能分开？现在回消息会回错楼。",
        status: "new",
      },
    ],
  },
  {
    id: "w33",
    weekNo: 33,
    range: "2026.08.10 — 08.16",
    rangeShort: "08.10 – 08.16",
    narrative:
      "反馈 68 条，大盘偏稳。语音房卡顿第一次变成重复信号，夜间模式仍是零散建议。没有事故，也没有能拉动正向率的事件。",
    judgment:
      "这周看起来平静，但语音房已经该记进跨周清单，不要等它变成 P0。",
    totals: {
      feedback: 68,
      feedbackDelta: -4,
      uniqueReporters: 38,
      synced: 9,
      pending: 17,
      replied: 28,
    },
    types: {
      bug: { count: 19, delta: 1 },
      suggestion: { count: 22, delta: 2 },
      complaint: { count: 16, delta: 3 },
      praise: { count: 11, delta: -2 },
    },
    sentiment: { negative: 34, neutral: 33, positive: 33 },
    daily: [
      { date: "08-10", label: "一", positive: 60, negative: 22, volume: 8 },
      { date: "08-11", label: "二", positive: 58, negative: 24, volume: 10 },
      { date: "08-12", label: "三", positive: 55, negative: 28, volume: 11 },
      { date: "08-13", label: "四", positive: 62, negative: 21, volume: 9 },
      { date: "08-14", label: "五", positive: 64, negative: 20, volume: 12 },
      { date: "08-15", label: "六", positive: 67, negative: 18, volume: 10 },
      { date: "08-16", label: "日", positive: 61, negative: 22, volume: 8 },
    ],
    issues: [
      {
        id: "voice-lag",
        title: "语音房卡顿掉线",
        summary: "同一批用户第二次提起，还没有集中爆发。",
        type: "complaint",
        priority: "P2",
        mentions: 3,
        delta: 2,
        status: "logged",
        owner: "语音",
      },
      {
        id: "dark-mode",
        title: "希望增加夜间模式",
        summary: "建议区出现，尚未形成共识。",
        type: "suggestion",
        priority: "P2",
        mentions: 3,
        delta: 1,
        status: "new",
        owner: "体验",
      },
    ],
    pipeline: [
      { status: "new", label: "待确认", count: 17 },
      { status: "logged", label: "已记录", count: 14 },
      { status: "synced", label: "已同步研发", count: 9 },
      { status: "replied", label: "已回复社区", count: 16 },
      { status: "closed", label: "已关闭", count: 12 },
    ],
    channels: [
      { name: "#general", count: 22 },
      { name: "#feedback", count: 16 },
      { name: "#bug-report", count: 12 },
      { name: "#voice-lobby", count: 9 },
      { name: "#announcements", count: 6 },
      { name: "#events", count: 3 },
    ],
    quotes: [
      {
        id: "n1",
        user: "echo",
        channel: "#voice-lobby",
        type: "complaint",
        sentiment: "negative",
        issueId: "voice-lag",
        time: "08-14 21:18",
        text: "语音又吞字了。上周说过一次，这周高峰还是这样。",
        status: "logged",
      },
    ],
  },
  {
    id: "w32",
    weekNo: 32,
    range: "2026.08.03 — 08.09",
    rangeShort: "08.03 – 08.09",
    narrative:
      "反馈 71 条。频道结构讨论开始冒头，整体情绪平稳，没有需要拉群同步的事故。",
    judgment:
      "适合把建议收进需求池。这周不是救火周。",
    totals: {
      feedback: 71,
      feedbackDelta: 2,
      uniqueReporters: 40,
      synced: 8,
      pending: 14,
      replied: 30,
    },
    types: {
      bug: { count: 18, delta: -1 },
      suggestion: { count: 26, delta: 4 },
      complaint: { count: 13, delta: -2 },
      praise: { count: 14, delta: 1 },
    },
    sentiment: { negative: 29, neutral: 34, positive: 37 },
    daily: [
      { date: "08-03", label: "一", positive: 62, negative: 20, volume: 9 },
      { date: "08-04", label: "二", positive: 64, negative: 18, volume: 10 },
      { date: "08-05", label: "三", positive: 60, negative: 22, volume: 11 },
      { date: "08-06", label: "四", positive: 66, negative: 17, volume: 10 },
      { date: "08-07", label: "五", positive: 70, negative: 15, volume: 12 },
      { date: "08-08", label: "六", positive: 72, negative: 14, volume: 11 },
      { date: "08-09", label: "日", positive: 65, negative: 19, volume: 8 },
    ],
    issues: [
      {
        id: "split-general",
        title: "拆分 #general 刷屏",
        summary: "有人第一次明确提出组队和反馈混在一起。",
        type: "suggestion",
        priority: "P2",
        mentions: 3,
        delta: 3,
        status: "new",
        owner: "社区",
      },
      {
        id: "dark-mode",
        title: "希望增加夜间模式",
        summary: "时差党提出，当周只有两条。",
        type: "suggestion",
        priority: "P2",
        mentions: 2,
        delta: 2,
        status: "new",
        owner: "体验",
      },
    ],
    pipeline: [
      { status: "new", label: "待确认", count: 14 },
      { status: "logged", label: "已记录", count: 19 },
      { status: "synced", label: "已同步研发", count: 8 },
      { status: "replied", label: "已回复社区", count: 18 },
      { status: "closed", label: "已关闭", count: 12 },
    ],
    channels: [
      { name: "#general", count: 24 },
      { name: "#feedback", count: 18 },
      { name: "#bug-report", count: 11 },
      { name: "#announcements", count: 8 },
      { name: "#voice-lobby", count: 6 },
      { name: "#events", count: 4 },
    ],
    quotes: [
      {
        id: "m1",
        user: "sora",
        channel: "#feedback",
        type: "suggestion",
        sentiment: "neutral",
        issueId: "dark-mode",
        time: "08-06 01:40",
        text: "晚上看公告太亮了。如果能做夜间模式，时差党会谢谢你们。",
        status: "new",
      },
    ],
  },
];

export function summarizeBoard(weeks: WeekReport[]): BoardOverall {
  const chronological = [...weeks].sort((a, b) => a.weekNo - b.weekNo);
  const latest = chronological[chronological.length - 1];
  const feedback = weeks.reduce((sum, item) => sum + item.totals.feedback, 0);
  const reporters = weeks.reduce(
    (sum, item) => sum + item.totals.uniqueReporters,
    0
  );
  const avgPositive = Math.round(
    weeks.reduce((sum, item) => sum + item.sentiment.positive, 0) / weeks.length
  );
  const avgNegative = Math.round(
    weeks.reduce((sum, item) => sum + item.sentiment.negative, 0) / weeks.length
  );
  const types: Record<FeedbackType, number> = {
    bug: 0,
    suggestion: 0,
    complaint: 0,
    praise: 0,
  };
  for (const week of weeks) {
    (Object.keys(types) as FeedbackType[]).forEach((key) => {
      types[key] += week.types[key].count;
    });
  }

  const issueMap = new Map<string, StandingIssue>();
  for (const week of chronological) {
    for (const issue of week.issues) {
      const prev = issueMap.get(issue.id);
      if (!prev) {
        issueMap.set(issue.id, {
          id: issue.id,
          title: issue.title,
          type: issue.type,
          mentions: issue.mentions,
          weekCount: 1,
          status: issue.status,
          owner: issue.owner,
        });
      } else {
        prev.mentions += issue.mentions;
        prev.weekCount += 1;
        prev.status = issue.status;
        prev.owner = issue.owner;
      }
    }
  }

  const standing = [...issueMap.values()]
    .filter((item) => item.weekCount >= 2 && item.status !== "closed")
    .sort((a, b) => b.weekCount - a.weekCount || b.mentions - a.mentions);

  const trend = chronological.map((week) => ({
    weekNo: week.weekNo,
    label: `W${week.weekNo}`,
    range: week.rangeShort,
    positive: week.sentiment.positive,
    negative: week.sentiment.negative,
    volume: week.totals.feedback,
  }));

  const first = chronological[0];
  const range = `${first.range.slice(0, 10)} — ${latest.range.slice(-5)}`;
  const standingTitles = standing
    .slice(0, 2)
    .map((item) => item.title)
    .join("、");

  return {
    weekCount: weeks.length,
    range,
    feedback,
    reporters,
    avgPositive,
    avgNegative,
    types,
    standing,
    trend,
    narrative: `近 ${weeks.length} 周累计有效反馈 ${feedback} 条。大盘正向率在 ${Math.min(...trend.map((item) => item.positive))}%–${Math.max(...trend.map((item) => item.positive))}% 之间摆动，没有单周崩盘。跨周未收口的是${standingTitles || "暂无重复议题"}；最新一周的新爆发要和这些慢性问题分开看。`,
    judgment:
      "先看跨周未关，再看本周新爆发。不要用单周情绪代替整体判断。",
  };
}
