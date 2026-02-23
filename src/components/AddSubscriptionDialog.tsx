import { useState } from "react";
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
} from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddSubscriptionDialog({ open, onOpenChange }: Props) {
  const { activeContext, activeOrgId, addSubscription } = useApp();
  const [form, setForm] = useState({
    name: "",
    publisher: "",
    cost: "",
    currency: "EUR",
    billingCycle: "monthly" as BillingCycle,
    category: "other" as SubscriptionCategory,
    nextBillingDate: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.cost || !form.nextBillingDate) return;

    addSubscription({
      name: form.name,
      publisher: form.publisher,
      cost: parseFloat(form.cost),
      currency: form.currency,
      billingCycle: form.billingCycle,
      category: form.category,
      context: activeContext,
      organisationId: activeContext === "organisation" ? activeOrgId || undefined : undefined,
      nextBillingDate: form.nextBillingDate,
      startDate: new Date().toISOString().split("T")[0],
      notes: form.notes || undefined,
      isActive: true,
    });

    setForm({
      name: "",
      publisher: "",
      cost: "",
      currency: "EUR",
      billingCycle: "monthly",
      category: "other",
      nextBillingDate: "",
      notes: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass-strong border-border">
        <DialogHeader>
          <DialogTitle>Add Subscription</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" placeholder="e.g. Netflix" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input id="publisher" placeholder="e.g. Netflix Inc." value={form.publisher} onChange={(e) => setForm((p) => ({ ...p, publisher: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Cost *</Label>
              <Input id="cost" type="number" step="0.01" placeholder="9.99" value={form.cost} onChange={(e) => setForm((p) => ({ ...p, cost: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={form.currency} onValueChange={(v) => setForm((p) => ({ ...p, currency: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR €</SelectItem>
                  <SelectItem value="USD">USD $</SelectItem>
                  <SelectItem value="GBP">GBP £</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Billing Cycle *</Label>
              <Select value={form.billingCycle} onValueChange={(v) => setForm((p) => ({ ...p, billingCycle: v as BillingCycle }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(billingCycleLabels).map(([k, l]) => (
                    <SelectItem key={k} value={k}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v as SubscriptionCategory }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([k, l]) => (
                    <SelectItem key={k} value={k}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextBilling">Next Billing Date *</Label>
              <Input id="nextBilling" type="date" value={form.nextBillingDate} onChange={(e) => setForm((p) => ({ ...p, nextBillingDate: e.target.value }))} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Optional notes..." value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={2} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-sm">Add Subscription</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
