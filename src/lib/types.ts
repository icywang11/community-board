export type FeedbackType = "bug" | "suggestion" | "complaint" | "praise";
export type Sentiment = "negative" | "neutral" | "positive" | "mixed";
export type Status =
  | "new"
  | "logged"
  | "synced"
  | "replied"
  | "closed";
export type Priority = "P0" | "P1" | "P2";

export type Quote = {
  id: string;
  user: string;
  channel: string;
  type: FeedbackType;
  sentiment: Sentiment;
  issueId: string;
  time: string;
  text: string;
  status: Status;
};

export type Issue = {
  id: string;
  title: string;
  summary: string;
  type: FeedbackType;
  priority: Priority | null;
  mentions: number;
  delta: number;
  status: Status;
  owner: string;
};

export type DailyPoint = {
  date: string;
  label: string;
  positive: number;
  negative: number;
  volume: number;
};

export type WeekReport = {
  id: string;
  weekNo: number;
  range: string;
  rangeShort: string;
  narrative: string;
  judgment: string;
  totals: {
    feedback: number;
    feedbackDelta: number;
    uniqueReporters: number;
    synced: number;
    pending: number;
    replied: number;
  };
  types: Record<FeedbackType, { count: number; delta: number }>;
  sentiment: {
    negative: number;
    neutral: number;
    positive: number;
  };
  daily: DailyPoint[];
  issues: Issue[];
  quotes: Quote[];
  pipeline: { status: Status; label: string; count: number }[];
  channels: { name: string; count: number }[];
};
