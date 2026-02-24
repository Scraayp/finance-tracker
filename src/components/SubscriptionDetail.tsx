import { useState } from "react";
import { Subscription, billingCycleLabels, categoryLabels, billingCycleMultiplier } from "@/lib/types";
import { getSubscriptionIcon } from "@/lib/icons";
import { getLogoUrl } from "@/lib/logos";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Props {
  subscription: Subscription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriptionDetail({ subscription: s, open, onOpenChange }: Props) {
  const [logoError, setLogoError] = useState(false);

  if (!s) return null;

  const { icon: Icon, bg, fg } = getSubscriptionIcon(s.name, s.category);
  const logoUrl = getLogoUrl(s.name, s.publisher);
  const mult = billingCycleMultiplier[s.billingCycle];
  const monthlyEquiv = mult > 0 ? s.cost / mult : s.cost;
  const currSymbol = s.currency === "EUR" ? "€" : s.currency === "GBP" ? "£" : "$";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center gap-3 mt-2">
            <div className={`icon-badge h-12 w-12 overflow-hidden ${logoUrl && !logoError ? "bg-foreground/5" : `${bg} ${fg}`}`}>
              {logoUrl && !logoError ? (
                <img
                  src={logoUrl}
                  alt={`${s.name} logo`}
                  className="h-7 w-7 object-contain"
                  onError={() => setLogoError(true)}
                  loading="lazy"
                />
              ) : (
                <Icon className="h-6 w-6" />
              )}
            </div>
            <div>
              <SheetTitle className="text-left">{s.name}</SheetTitle>
              <p className="text-sm text-muted-foreground">{s.publisher}</p>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card text-center">
              <p className="text-xs text-muted-foreground mb-1">Cost</p>
              <p className="text-xl font-bold font-mono">{currSymbol}{s.cost.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{billingCycleLabels[s.billingCycle]}</p>
            </div>
            <div className="stat-card text-center">
              <p className="text-xs text-muted-foreground mb-1">Monthly Equiv.</p>
              <p className="text-xl font-bold font-mono text-accent">{currSymbol}{monthlyEquiv.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <DetailRow label="Category">
              <Badge variant="secondary">{categoryLabels[s.category]}</Badge>
            </DetailRow>
            <DetailRow label="Billing Cycle">{billingCycleLabels[s.billingCycle]}</DetailRow>
            <DetailRow label="Next Billing">
              {format(new Date(s.nextBillingDate), "dd MMMM yyyy")}
            </DetailRow>
            <DetailRow label="Start Date">
              {format(new Date(s.startDate), "dd MMMM yyyy")}
            </DetailRow>
            <DetailRow label="Status">
              <Badge variant={s.isActive ? "default" : "secondary"} className={s.isActive ? "bg-success text-success-foreground" : ""}>
                {s.isActive ? "Active" : "Inactive"}
              </Badge>
            </DetailRow>
            {s.notes && <DetailRow label="Notes">{s.notes}</DetailRow>}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{children}</span>
    </div>
  );
}
