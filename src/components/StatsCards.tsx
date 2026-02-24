import { useApp } from "@/context/AppContext";
import { billingCycleMultiplier } from "@/lib/types";
import { TrendingUp, CreditCard, CalendarClock, AlertTriangle } from "lucide-react";
import { useMemo } from "react";

export function StatsCards() {
  const { filtered } = useApp();

  const stats = useMemo(() => {
    const active = filtered.filter((s) => s.isActive);
    const monthlyTotal = active.reduce((sum, s) => {
      const mult = billingCycleMultiplier[s.billingCycle];
      return sum + (mult > 0 ? s.cost / mult : 0);
    }, 0);

    const annualTotal = monthlyTotal * 12;

    const now = new Date();
    const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcoming = active.filter((s) => {
      const next = new Date(s.nextBillingDate);
      return next >= now && next <= soon;
    });

    return { count: active.length, monthlyTotal, annualTotal, upcoming: upcoming.length };
  }, [filtered]);

  const cards = [
    {
      label: "Monthly Spend",
      value: `€${stats.monthlyTotal.toFixed(2)}`,
      icon: CreditCard,
      accent: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      label: "Annual Projection",
      value: `€${stats.annualTotal.toFixed(2)}`,
      icon: TrendingUp,
      accent: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      label: "Active Subscriptions",
      value: stats.count.toString(),
      icon: CalendarClock,
      accent: "text-foreground",
      iconBg: "bg-muted",
    },
    {
      label: "Due This Week",
      value: stats.upcoming.toString(),
      icon: AlertTriangle,
      accent: stats.upcoming > 0 ? "text-warning" : "text-muted-foreground",
      iconBg: stats.upcoming > 0 ? "bg-warning/10" : "bg-muted",
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
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{c.label}</span>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.iconBg}`}>
              <c.icon className={`h-4 w-4 ${c.accent}`} />
            </div>
          </div>
          <p className={`text-3xl font-bold tracking-tight ${c.accent}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}
