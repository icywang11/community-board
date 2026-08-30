export type CategoryRow = {
  id: string;
  name: string;
  count: number;
  share: number;
  summary: string;
  suggestion: string;
};

export type Quote = {
  id: string;
  categoryId: string;
  category: string;
  text: string;
};

export type WeekReport = {
  id: string;
  label: string;
  range: string;
  rangeShort: string;
  total: number;
  narrative: string;
  judgment: string;
  categories: CategoryRow[];
  quotes: Quote[];
};

export type TrendPoint = {
  id: string;
  label: string;
  range: string;
  volume: number;
};

export type StandingIssue = {
  name: string;
  weekCount: number;
  mentions: number;
  product: string[];
  ops: string[];
};

export type BoardOverall = {
  weekCount: number;
  range: string;
  feedback: number;
  standing: StandingIssue[];
  trend: TrendPoint[];
  topCategories: { name: string; count: number }[];
  narrative: string;
  judgment: string;
};
