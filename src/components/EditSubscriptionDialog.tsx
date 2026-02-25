import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BillingCycle,
  SubscriptionCategory,
  billingCycleLabels,
  categoryLabels,
  defaultSubscriptionCategories,
  Subscription,
} from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription | null;
}

export function EditSubscriptionDialog({
  open,
  onOpenChange,
  subscription: sub,
}: Props) {
  const { updateSubscription } = useApp();
  const [form, setForm] = useState({
    name: "",
    publisher: "",
    cost: "",
    currency: "EUR",
    billingCycle: "monthly" as BillingCycle,
    category: "entertainment" as SubscriptionCategory,
    customCategory: "",
    nextBillingDate: "",
    notes: "",
  });

  useEffect(() => {
    if (sub) {
      setForm({
        name: sub.name,
        publisher: sub.publisher,
        cost: sub.cost.toString(),
        currency: sub.currency,
        billingCycle: sub.billingCycle,
        category: sub.category,
        customCategory: defaultSubscriptionCategories.includes(sub.category)
          ? ""
          : sub.category,
        nextBillingDate: sub.nextBillingDate,
        notes: sub.notes || "",
      });
    }
  }, [sub, open]);

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sub || !form.name || !form.cost || !form.nextBillingDate) return;

    const finalCategory =
      form.category === "other" && form.customCategory
        ? form.customCategory
        : form.category;

    updateSubscription(sub.id, {
      name: form.name,
      publisher: form.publisher,
      cost: parseFloat(form.cost),
      currency: form.currency,
      billingCycle: form.billingCycle,
      category: finalCategory,
      nextBillingDate: form.nextBillingDate,
      notes: form.notes || undefined,
    });

    onOpenChange(false);
  };

  if (!sub) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass-strong border-border">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Netflix"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                placeholder="e.g. Netflix Inc."
                value={form.publisher}
                onChange={(e) =>
                  setForm((p) => ({ ...p, publisher: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Cost *</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                placeholder="9.99"
                value={form.cost}
                onChange={(e) =>
                  setForm((p) => ({ ...p, cost: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={form.currency}
                onValueChange={(v) => setForm((p) => ({ ...p, currency: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR €</SelectItem>
                  <SelectItem value="USD">USD $</SelectItem>
                  <SelectItem value="GBP">GBP £</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Billing Cycle *</Label>
              <Select
                value={form.billingCycle}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, billingCycle: v as BillingCycle }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(billingCycleLabels).map(([k, l]) => (
                    <SelectItem key={k} value={k}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) =>
                setForm((p) => ({
                  ...p,
                  category: v as SubscriptionCategory,
                  customCategory: "",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {defaultSubscriptionCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {categoryLabels[cat] || cat}
                  </SelectItem>
                ))}
                <SelectItem key="custom-category-option" value="other">
                  Custom Category...
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {form.category === "other" && (
            <div className="space-y-2">
              <Label htmlFor="customCat">Custom Category</Label>
              <Input
                id="customCat"
                placeholder="e.g. Gaming"
                value={form.customCategory}
                onChange={(e) =>
                  setForm((p) => ({ ...p, customCategory: e.target.value }))
                }
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="nextBilling">Next Billing Date *</Label>
            <Input
              id="nextBilling"
              type="date"
              value={form.nextBillingDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, nextBillingDate: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Optional notes..."
              value={form.notes}
              onChange={(e) =>
                setForm((p) => ({ ...p, notes: e.target.value }))
              }
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-sm"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
