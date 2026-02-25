import { useApp } from "@/context/AppContext";
import { billingCycleMultiplier, incomeFrequencyMultiplier } from "@/lib/types";
import {
  TrendingUp,
  CreditCard,
  CalendarClock,
  TrendingDown,
} from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export function StatsCards() {
  const { filtered, filteredIncomes } = useApp();
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [],
  );

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
      value: currencyFormatter.format(stats.monthlyIncomes),
      helper: "Based on active income sources",
      icon: TrendingUp,
      valueClass: "text-foreground",
      iconClass: "text-success",
      iconBg: "bg-success/12",
    },
    {
      label: "Monthly Expenses",
      value: currencyFormatter.format(stats.monthlyExpenses),
      helper: "Based on active subscriptions",
      icon: TrendingDown,
      valueClass: "text-foreground",
      iconClass: "text-destructive",
      iconBg: "bg-destructive/12",
    },
    {
      label: "Net Monthly",
      value: currencyFormatter.format(stats.monthlyNet),
      helper:
        stats.monthlyNet >= 0
          ? "Positive monthly balance"
          : "Negative monthly balance",
      icon: CreditCard,
      valueClass: stats.monthlyNet >= 0 ? "text-success" : "text-destructive",
      iconClass: stats.monthlyNet >= 0 ? "text-primary" : "text-destructive",
      iconBg: stats.monthlyNet >= 0 ? "bg-primary/12" : "bg-destructive/12",
    },
    {
      label: "Annual Projection",
      value: currencyFormatter.format(stats.annualNet),
      helper: "12-month estimate from current data",
      icon: CalendarClock,
      valueClass: "text-foreground",
      iconClass: "text-muted-foreground",
      iconBg: "bg-muted/70",
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
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {c.label}
              </span>
              <p
                className={cn(
                  "mt-1 text-2xl sm:text-[1.75rem] font-semibold tracking-tight",
                  c.valueClass,
                )}
              >
                {c.value}
              </p>
            </div>
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg",
                c.iconBg,
              )}
            >
              <c.icon className={cn("h-4 w-4", c.iconClass)} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{c.helper}</p>
        </div>
      ))}
    </div>
  );
}
