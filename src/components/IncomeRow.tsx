import { useState } from "react";
import {
  Income,
  incomeFrequencyLabels,
  getIncomeCategoryLabel,
} from "@/lib/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Trash2, ChevronRight, Pencil, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

interface Props {
  income: Income;
  onSelect?: (income: Income) => void;
  onEdit?: (income: Income) => void;
}

export function IncomeRow({ income: i, onSelect, onEdit }: Props) {
  const { removeIncome } = useApp();

  const getCategoryColor = (category: typeof i.category) => {
    const colors: Record<typeof category, { bg: string; fg: string }> = {
      salary: { bg: "bg-emerald-500/15", fg: "text-emerald-600" },
      freelance: { bg: "bg-blue-500/15", fg: "text-blue-600" },
      investment: { bg: "bg-amber-500/15", fg: "text-amber-600" },
      passive: { bg: "bg-violet-500/15", fg: "text-violet-600" },
      bonus: { bg: "bg-pink-500/15", fg: "text-pink-600" },
      gift: { bg: "bg-rose-500/15", fg: "text-rose-600" },
      other: { bg: "bg-gray-500/15", fg: "text-gray-600" },
    };
    return colors[category];
  };

  const colors = getCategoryColor(i.category);

  return (
    <div
      className="subscription-row animate-slide-up cursor-pointer group flex-wrap sm:flex-nowrap gap-3 sm:gap-4"
      onClick={() => onSelect?.(i)}
    >
      {/* Icon Badge */}
      <div
        className={`icon-badge shrink-0 overflow-hidden ${colors.bg} ${colors.fg}`}
      >
        <DollarSign className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{i.name}</span>
          <span className="text-[11px] text-muted-foreground truncate hidden sm:inline opacity-60">
            {i.source}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="bg-muted/50 px-1.5 py-0.5 rounded-md">
            {incomeFrequencyLabels[i.frequency]}
          </span>
          <span className="opacity-40">•</span>
          <span>
            Next: {format(new Date(i.nextReceiptDate), "dd MMM yyyy")}
          </span>
        </div>
      </div>

      <Badge
        variant="secondary"
        className="hidden md:inline-flex text-[10px] font-medium bg-muted/60 border-0"
      >
        {getIncomeCategoryLabel(i.category)}
      </Badge>

      <div className="text-left sm:text-right shrink-0 ml-12 sm:ml-2 w-full sm:w-auto order-3 sm:order-none">
        <span className="font-semibold font-mono text-sm text-emerald-600">
          +{i.currency === "EUR" ? "€" : "$"}
          {i.amount.toFixed(2)}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 text-muted-foreground/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-primary/15 hover:text-primary"
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(i);
        }}
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 text-muted-foreground/40 hover:text-destructive opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          removeIncome(i.id);
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>

      <ChevronRight className="hidden sm:block h-4 w-4 text-muted-foreground/20 group-hover:text-muted-foreground/50 transition-colors shrink-0" />
    </div>
  );
}
