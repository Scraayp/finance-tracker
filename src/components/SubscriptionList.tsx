import { useApp } from "@/context/AppContext";
import { SubscriptionRow } from "./SubscriptionRow";
import { Subscription, categoryLabels, SubscriptionCategory } from "@/lib/types";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface Props {
  onSelect?: (sub: Subscription) => void;
}

export function SubscriptionList({ onSelect }: Props) {
  const { filtered } = useApp();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const displayed = useMemo(() => {
    let list = filtered;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.publisher.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "all") {
      list = list.filter((s) => s.category === categoryFilter);
    }
    return list.sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime());
  }, [filtered, search, categoryFilter]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subscriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {displayed.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No subscriptions found
          </div>
        ) : (
          displayed.map((s) => (
            <SubscriptionRow key={s.id} subscription={s} onSelect={onSelect} />
          ))
        )}
      </div>
    </div>
  );
}
