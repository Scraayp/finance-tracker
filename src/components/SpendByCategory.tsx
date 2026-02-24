import { useApp } from "@/context/AppContext";
import { billingCycleMultiplier, categoryLabels, SubscriptionCategory } from "@/lib/types";
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "hsl(152, 58%, 46%)",
  "hsl(190, 65%, 42%)",
  "hsl(38, 88%, 50%)",
  "hsl(280, 45%, 52%)",
  "hsl(0, 60%, 52%)",
  "hsl(210, 55%, 48%)",
  "hsl(340, 50%, 48%)",
  "hsl(120, 35%, 48%)",
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

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="stat-card animate-fade-in h-full">
      <h3 className="section-label mb-5">Spend by Category</h3>

      <div className="flex flex-col items-center gap-5">
        <div className="h-44 w-44 shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={72}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
                cornerRadius={4}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `€${value.toFixed(2)}`}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid hsl(150, 6%, 13%)",
                  background: "hsl(150, 12%, 7%)",
                  color: "hsl(0, 0%, 96%)",
                  fontSize: "12px",
                  boxShadow: "0 8px 32px -8px rgba(0,0,0,0.5)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-bold">€{total.toFixed(0)}</span>
            <span className="text-[10px] text-muted-foreground">/month</span>
          </div>
        </div>

        <div className="w-full space-y-2.5">
          {data.map((d, i) => {
            const pct = total > 0 ? (d.value / total) * 100 : 0;
            return (
              <div key={d.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-mono font-medium text-foreground">€{d.value.toFixed(2)}</span>
                </div>
                <div className="h-1 w-full rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: COLORS[i % COLORS.length],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
