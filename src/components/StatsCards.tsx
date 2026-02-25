import { useApp } from "@/context/AppContext";
import { billingCycleMultiplier, incomeFrequencyMultiplier } from "@/lib/types";
import {
  TrendingUp,
  CreditCard,
  CalendarClock,
  AlertTriangle,
  TrendingDown,
} from "lucide-react";
import { useMemo } from "react";

export function StatsCards() {
  const { filtered, filteredIncomes } = useApp();

  const stats = useMemo(() => {
    // Expenses calculation
    const activeExpenses = filtered.filter((s) => s.isActive);
    const monthlyExpenses = activeExpenses.reduce((sum, s) => {
      const mult = billingCycleMultiplier[s.billingCycle];
      return sum + (mult > 0 ? s.cost / mult : 0);
    }, 0);

    const annualExpenses = monthlyExpenses * 12;

    // Incomes calculation
    const activeIncomes = filteredIncomes.filter((i) => i.isActive);
    const monthlyIncomes = activeIncomes.reduce((sum, i) => {
      const mult = incomeFrequencyMultiplier[i.frequency];
      return sum + (mult > 0 ? i.amount / mult : 0);
    }, 0);

    const annualIncomes = monthlyIncomes * 12;

    // Net calculation
    const monthlyNet = monthlyIncomes - monthlyExpenses;
    const annualNet = monthlyNet * 12;

    // Upcoming subscriptions
    const now = new Date();
    const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcoming = activeExpenses.filter((s) => {
      const next = new Date(s.nextBillingDate);
      return next >= now && next <= soon;
    });

    return {
      monthlyExpenses,
      annualExpenses,
      monthlyIncomes,
      annualIncomes,
      monthlyNet,
      annualNet,
      upcomingExpenses: upcoming.length,
    };
  }, [filtered, filteredIncomes]);

  const cards = [
    {
      label: "Monthly Income",
      value: `€${stats.monthlyIncomes.toFixed(2)}`,
      icon: TrendingUp,
      accent: "text-emerald-600",
      iconBg: "bg-emerald-500/10",
    },
    {
      label: "Monthly Expenses",
      value: `€${stats.monthlyExpenses.toFixed(2)}`,
      icon: TrendingDown,
      accent: "text-red-600",
      iconBg: "bg-red-500/10",
    },
    {
      label: "Net Monthly",
      value: `€${stats.monthlyNet.toFixed(2)}`,
      icon: CreditCard,
      accent: stats.monthlyNet >= 0 ? "text-primary" : "text-orange-600",
      iconBg: stats.monthlyNet >= 0 ? "bg-primary/10" : "bg-orange-500/10",
    },
    {
      label: "Annual Projection",
      value: `€${stats.annualNet.toFixed(2)}`,
      icon: CalendarClock,
      accent:
        stats.annualNet >= 0 ? "text-foreground" : "text-muted-foreground",
      iconBg: stats.annualNet >= 0 ? "bg-muted" : "bg-muted",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => (
        <div
          key={c.label}
          className="stat-card animate-fade-in"
          style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {c.label}
            </span>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.iconBg}`}
            >
              <c.icon className={`h-4 w-4 ${c.accent}`} />
            </div>
          </div>
          <p className={`text-3xl font-bold tracking-tight ${c.accent}`}>
            {c.value}
          </p>
        </div>
      ))}
    </div>
  );
}
