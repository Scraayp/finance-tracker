import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Zap } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSubscription: () => void;
  onAddIncome: () => void;
}

export function AddChoiceDialog({
  open,
  onOpenChange,
  onAddSubscription,
  onAddIncome,
}: Props) {
  const handleSubscription = () => {
    onAddSubscription();
    onOpenChange(false);
  };

  const handleIncome = () => {
    onAddIncome();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-strong border-border">
        <DialogHeader>
          <DialogTitle>What would you like to add?</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleSubscription}
            className="h-auto flex flex-col items-center justify-center py-6 gap-2 bg-transparent text-primary hover:bg-primary/5 border-2 border-primary rounded-lg transition-all"
          >
            <Zap className="h-6 w-6" />
            <span className="font-semibold text-sm">Add Subscription</span>
            <span className="text-xs opacity-70">Expense tracker</span>
          </Button>
          <Button
            onClick={handleIncome}
            className="h-auto flex flex-col items-center justify-center py-6 gap-2 bg-transparent text-primary hover:bg-primary/5 border-2 border-primary rounded-lg transition-all"
          >
            <Plus className="h-6 w-6" />
            <span className="font-semibold text-sm">Add Income</span>
            <span className="text-xs opacity-70">Earnings tracker</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
