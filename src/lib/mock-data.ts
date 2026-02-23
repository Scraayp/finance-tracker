import { Subscription, Context } from "./types";

export const mockSubscriptions: Subscription[] = [
  // Personal
  {
    id: "1", name: "Netflix", publisher: "Netflix Inc.", cost: 15.99,
    currency: "EUR", billingCycle: "monthly", category: "entertainment",
    context: "personal", nextBillingDate: "2026-03-15", startDate: "2023-01-10", isActive: true,
  },
  {
    id: "2", name: "YouTube Premium", publisher: "Google LLC", cost: 11.99,
    currency: "EUR", billingCycle: "monthly", category: "entertainment",
    context: "personal", nextBillingDate: "2026-03-01", startDate: "2022-06-01", isActive: true,
  },
  {
    id: "3", name: "Spotify", publisher: "Spotify AB", cost: 9.99,
    currency: "EUR", billingCycle: "monthly", category: "entertainment",
    context: "personal", nextBillingDate: "2026-03-05", startDate: "2021-03-15", isActive: true,
  },
  {
    id: "4", name: "1Password", publisher: "AgileBits Inc.", cost: 35.88,
    currency: "EUR", billingCycle: "annual", category: "productivity",
    context: "personal", nextBillingDate: "2026-08-12", startDate: "2023-08-12", isActive: true,
  },
  {
    id: "5", name: "Disney+", publisher: "The Walt Disney Company", cost: 8.99,
    currency: "EUR", billingCycle: "monthly", category: "entertainment",
    context: "personal", nextBillingDate: "2026-03-20", startDate: "2024-01-01", isActive: true,
  },
  // Organisation
  {
    id: "6", name: "Hetzner", publisher: "Hetzner Online GmbH", cost: 46.41,
    currency: "EUR", billingCycle: "monthly", category: "hosting",
    context: "organisation", nextBillingDate: "2026-03-01", startDate: "2022-01-01", isActive: true,
    notes: "CX31 + CX21 dedicated servers",
  },
  {
    id: "7", name: "KVK Inschrijving", publisher: "Kamer van Koophandel", cost: 75.00,
    currency: "EUR", billingCycle: "annual", category: "business",
    context: "organisation", nextBillingDate: "2026-07-01", startDate: "2021-07-01", isActive: true,
  },
  {
    id: "8", name: "GitHub", publisher: "GitHub Inc.", cost: 4.00,
    currency: "USD", billingCycle: "monthly", category: "development",
    context: "organisation", nextBillingDate: "2026-03-10", startDate: "2022-04-10", isActive: true,
    notes: "Team plan - 5 seats",
  },
  {
    id: "9", name: "Vercel", publisher: "Vercel Inc.", cost: 20.00,
    currency: "USD", billingCycle: "monthly", category: "hosting",
    context: "organisation", nextBillingDate: "2026-03-08", startDate: "2023-03-08", isActive: true,
  },
  {
    id: "10", name: "Slack", publisher: "Salesforce", cost: 87.50,
    currency: "EUR", billingCycle: "quarterly", category: "communication",
    context: "organisation", nextBillingDate: "2026-04-01", startDate: "2022-10-01", isActive: true,
    notes: "Pro plan - 10 members",
  },
  {
    id: "11", name: "Figma", publisher: "Figma Inc.", cost: 144.00,
    currency: "USD", billingCycle: "annual", category: "development",
    context: "organisation", nextBillingDate: "2026-09-15", startDate: "2023-09-15", isActive: true,
  },
  {
    id: "12", name: "Cloudflare", publisher: "Cloudflare Inc.", cost: 25.00,
    currency: "USD", billingCycle: "monthly", category: "hosting",
    context: "organisation", nextBillingDate: "2026-03-12", startDate: "2023-06-12", isActive: true,
    notes: "Pro plan with WAF",
  },
  {
    id: "13", name: "Notion", publisher: "Notion Labs", cost: 96.00,
    currency: "USD", billingCycle: "annual", category: "productivity",
    context: "organisation", nextBillingDate: "2026-11-01", startDate: "2024-11-01", isActive: true,
  },
];
