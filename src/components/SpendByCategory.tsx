import { useApp } from "@/context/AppContext";
import { billingCycleMultiplier, categoryLabels, SubscriptionCategory } from "@/lib/types";
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "hsl(152, 60%, 48%)",
  "hsl(190, 70%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 50%, 55%)",
  "hsl(0, 65%, 55%)",
  "hsl(210, 60%, 50%)",
  "hsl(340, 55%, 50%)",
  "hsl(120, 40%, 50%)",
];

export function SpendByCategory() {
  const { filtered } = useApp();

  const data = useMemo(() => {
    const map = new Map<SubscriptionCategory, number>();
    filtered.filter((s) => s.isActive).forEach((s) => {
      const mult = billingCycleMultiplier[s.billingCycle];
      const monthly = mult > 0 ? s.cost / mult : 0;
      map.set(s.category, (map.get(s.category) || 0) + monthly);
    });
    return Array.from(map.entries())
      .map(([cat, value]) => ({
        name: categoryLabels[cat],
        value: parseFloat(value.toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  if (data.length === 0) return null;

  return (
    <div className="stat-card animate-fade-in">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Monthly Spend by Category</h3>
      <div className="flex items-center gap-6">
        <div className="h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `€${value.toFixed(2)}`}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(160, 6%, 16%)",
                  background: "hsl(160, 10%, 8%)",
                  color: "hsl(0, 0%, 95%)",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-muted-foreground">{d.name}</span>
              </div>
              <span className="font-mono font-medium">€{d.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
