export type BillingCycle =
  | "monthly"
  | "quarterly"
  | "semi-annual"
  | "annual"
  | "one-time";
export type SubscriptionCategory = string; // Allow custom categories
export type IncomeFrequency =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "semi-annual"
  | "annual"
  | "one-time";
export type IncomeCategory = string; // Allow custom categories
export type Context = "personal" | "organisation";

export const defaultSubscriptionCategories = [
  "entertainment",
  "productivity",
  "hosting",
  "business",
  "finance",
  "communication",
  "development",
];

export const defaultIncomeCategories = [
  "salary",
  "freelance",
  "investment",
  "passive",
  "bonus",
  "gift",
];

export interface Subscription {
  id: string;
  name: string;
  publisher: string;
  cost: number;
  currency: string;
  billingCycle: BillingCycle;
  category: SubscriptionCategory;
  context: Context;
  organisationId?: string;
  nextBillingDate: string;
  startDate: string;
  notes?: string;
  isActive: boolean;
}

export interface Income {
  id: string;
  name: string;
  source: string;
  amount: number;
  currency: string;
  frequency: IncomeFrequency;
  category: IncomeCategory;
  context: Context;
  organisationId?: string;
  nextReceiptDate: string;
  startDate: string;
  notes?: string;
  isActive: boolean;
}

export const billingCycleLabels: Record<BillingCycle, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  "semi-annual": "Semi-Annual",
  annual: "Annual",
  "one-time": "One-Time",
};

export const billingCycleMultiplier: Record<BillingCycle, number> = {
  monthly: 1,
  quarterly: 3,
  "semi-annual": 6,
  annual: 12,
  "one-time": 0,
};

export const incomeFrequencyLabels: Record<IncomeFrequency, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  "semi-annual": "Semi-Annual",
  annual: "Annual",
  "one-time": "One-Time",
};

export const incomeFrequencyMultiplier: Record<IncomeFrequency, number> = {
  daily: 365,
  weekly: 52,
  monthly: 12,
  quarterly: 4,
  "semi-annual": 2,
  annual: 1,
  "one-time": 0,
};

const defaultCategoryLabels: Record<string, string> = {
  entertainment: "Entertainment",
  productivity: "Productivity",
  hosting: "Hosting & Infra",
  business: "Business",
  finance: "Finance",
  communication: "Communication",
  development: "Development",
  other: "Other",
};

const defaultIncomeCategoryLabels: Record<string, string> = {
  salary: "Salary",
  freelance: "Freelance",
  investment: "Investment",
  passive: "Passive Income",
  bonus: "Bonus",
  gift: "Gift",
  other: "Other",
};

export const getCategoryLabel = (category: string): string => {
  return defaultCategoryLabels[category] || category;
};

export const getIncomeCategoryLabel = (category: string): string => {
  return defaultIncomeCategoryLabels[category] || category;
};

export const categoryLabels = defaultCategoryLabels;
export const incomeCategoryLabels = defaultIncomeCategoryLabels;
