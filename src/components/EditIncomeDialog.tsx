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
  IncomeFrequency,
  IncomeCategory,
  incomeFrequencyLabels,
  incomeCategoryLabels,
  defaultIncomeCategories,
  Income,
} from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  income: Income | null;
}

export function EditIncomeDialog({ open, onOpenChange, income: inc }: Props) {
  const { updateIncome } = useApp();
  const [form, setForm] = useState({
    name: "",
    source: "",
    amount: "",
    currency: "EUR",
    frequency: "monthly" as IncomeFrequency,
    category: "salary" as IncomeCategory,
    customCategory: "",
    nextReceiptDate: "",
    notes: "",
  });

  useEffect(() => {
    if (inc) {
      setForm({
        name: inc.name,
        source: inc.source,
        amount: inc.amount.toString(),
        currency: inc.currency,
        frequency: inc.frequency,
        category: inc.category,
        customCategory: defaultIncomeCategories.includes(inc.category)
          ? ""
          : inc.category,
        nextReceiptDate: inc.nextReceiptDate,
        notes: inc.notes || "",
      });
    }
  }, [inc, open]);

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inc || !form.name || !form.amount || !form.nextReceiptDate) return;

    const finalCategory =
      form.category === "other" && form.customCategory
        ? form.customCategory
        : form.category;

    updateIncome(inc.id, {
      name: form.name,
      source: form.source,
      amount: parseFloat(form.amount),
      currency: form.currency,
      frequency: form.frequency,
      category: finalCategory,
      nextReceiptDate: form.nextReceiptDate,
      notes: form.notes || undefined,
    });

    onOpenChange(false);
  };

  if (!inc) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass-strong border-border">
        <DialogHeader>
          <DialogTitle>Edit Income</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Main Salary"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                placeholder="e.g. Employer Inc."
                value={form.source}
                onChange={(e) =>
                  setForm((p) => ({ ...p, source: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="2500.00"
                value={form.amount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, amount: e.target.value }))
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
              <Label>Frequency *</Label>
              <Select
                value={form.frequency}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, frequency: v as IncomeFrequency }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(incomeFrequencyLabels).map(([k, l]) => (
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
                  category: v as IncomeCategory,
                  customCategory: "",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {defaultIncomeCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {incomeCategoryLabels[cat] || cat}
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
                placeholder="e.g. Side Hustle"
                value={form.customCategory}
                onChange={(e) =>
                  setForm((p) => ({ ...p, customCategory: e.target.value }))
                }
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="nextReceipt">Next Receipt Date *</Label>
            <Input
              id="nextReceipt"
              type="date"
              value={form.nextReceiptDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, nextReceiptDate: e.target.value }))
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
