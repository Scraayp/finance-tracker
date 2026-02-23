import { Subscription, billingCycleLabels, categoryLabels } from "@/lib/types";
import { getSubscriptionIcon } from "@/lib/icons";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

interface Props {
  subscription: Subscription;
  onSelect?: (sub: Subscription) => void;
}

export function SubscriptionRow({ subscription: s, onSelect }: Props) {
  const { removeSubscription } = useApp();
  const { icon: Icon, bg, fg } = getSubscriptionIcon(s.name, s.category);

  return (
    <div className="subscription-row animate-slide-up cursor-pointer" onClick={() => onSelect?.(s)}>
      <div className={`icon-badge ${bg} ${fg} shrink-0`}>
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{s.name}</span>
          <span className="text-xs text-muted-foreground truncate hidden sm:inline">
            {s.publisher}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{billingCycleLabels[s.billingCycle]}</span>
          <span>·</span>
          <span>Next: {format(new Date(s.nextBillingDate), "dd MMM yyyy")}</span>
        </div>
      </div>

      <Badge variant="secondary" className="hidden md:inline-flex text-xs">
        {categoryLabels[s.category]}
      </Badge>

      <div className="text-right shrink-0 ml-2">
        <span className="font-semibold font-mono text-sm">
          {s.currency === "EUR" ? "€" : "$"}{s.cost.toFixed(2)}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
        onClick={(e) => {
          e.stopPropagation();
          removeSubscription(s.id);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
