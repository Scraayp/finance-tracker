export type BillingCycle = "monthly" | "quarterly" | "semi-annual" | "annual" | "one-time";
export type SubscriptionCategory = "entertainment" | "productivity" | "hosting" | "business" | "finance" | "communication" | "development" | "other";
export type Context = "personal" | "organisation";

export interface Subscription {
  id: string;
  name: string;
  publisher: string;
  cost: number;
  currency: string;
  billingCycle: BillingCycle;
  category: SubscriptionCategory;
  context: Context;
  nextBillingDate: string;
  startDate: string;
  notes?: string;
  isActive: boolean;
}

export interface Organisation {
  id: string;
  name: string;
  kvkNumber?: string;
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

export const categoryLabels: Record<SubscriptionCategory, string> = {
  entertainment: "Entertainment",
  productivity: "Productivity",
  hosting: "Hosting & Infra",
  business: "Business",
  finance: "Finance",
  communication: "Communication",
  development: "Development",
  other: "Other",
};
