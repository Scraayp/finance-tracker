import { useState } from "react";
import { Subscription, billingCycleLabels, categoryLabels } from "@/lib/types";
import { getSubscriptionIcon } from "@/lib/icons";
import { getLogoUrl } from "@/lib/logos";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

interface Props {
  subscription: Subscription;
  onSelect?: (sub: Subscription) => void;
}

export function SubscriptionRow({ subscription: s, onSelect }: Props) {
  const { removeSubscription } = useApp();
  const { icon: Icon, bg, fg } = getSubscriptionIcon(s.name, s.category);
  const logoUrl = getLogoUrl(s.name, s.publisher);
  const [logoError, setLogoError] = useState(false);

  return (
    <div
      className="subscription-row animate-slide-up cursor-pointer group"
      onClick={() => onSelect?.(s)}
    >
      {/* Logo / Icon Badge */}
      <div className={`icon-badge shrink-0 overflow-hidden ${logoUrl && !logoError ? "bg-foreground/5" : `${bg} ${fg}`}`}>
        {logoUrl && !logoError ? (
          <img
            src={logoUrl}
            alt={`${s.name} logo`}
            className="h-6 w-6 object-contain"
            onError={() => setLogoError(true)}
            loading="lazy"
          />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{s.name}</span>
          <span className="text-[11px] text-muted-foreground truncate hidden sm:inline opacity-60">
            {s.publisher}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="bg-muted/50 px-1.5 py-0.5 rounded-md">{billingCycleLabels[s.billingCycle]}</span>
          <span className="opacity-40">•</span>
          <span>Next: {format(new Date(s.nextBillingDate), "dd MMM yyyy")}</span>
        </div>
      </div>

      <Badge variant="secondary" className="hidden md:inline-flex text-[10px] font-medium bg-muted/60 border-0">
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
        className="h-7 w-7 shrink-0 text-muted-foreground/40 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          removeSubscription(s.id);
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>

      <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-muted-foreground/50 transition-colors shrink-0" />
    </div>
  );
}
