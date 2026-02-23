import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { StatsCards } from "@/components/StatsCards";
import { SubscriptionList } from "@/components/SubscriptionList";
import { SpendByCategory } from "@/components/SpendByCategory";
import { SubscriptionDetail } from "@/components/SubscriptionDetail";
import { AddSubscriptionDialog } from "@/components/AddSubscriptionDialog";
import { AppSidebar } from "@/components/AppSidebar";
import { Subscription } from "@/lib/types";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { activeContext, activeOrg } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleSelect = (sub: Subscription) => {
    setSelectedSub(sub);
    setDetailOpen(true);
  };

  const title =
    activeContext === "personal"
      ? "Personal Dashboard"
      : activeOrg
        ? `${activeOrg.name}`
        : "Organisation Dashboard";

  return (
    <div className="flex min-h-screen w-full bg-grid">
      <AppSidebar onAddClick={() => setAddOpen(true)} />

      <main className="flex-1 overflow-auto">
        <header className="flex h-14 items-center justify-between border-b border-border px-6 glass-subtle">
          <div>
            <h1 className="text-lg font-semibold">{title}</h1>
            {activeContext === "organisation" && activeOrg?.kvkNumber && (
              <p className="text-xs text-muted-foreground">KVK: {activeOrg.kvkNumber}</p>
            )}
          </div>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 md:hidden"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </header>

        <div className="p-6 space-y-6 max-w-6xl">
          <StatsCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-sm font-medium text-muted-foreground mb-3">Subscriptions</h2>
              <SubscriptionList onSelect={handleSelect} />
            </div>
            <div>
              <SpendByCategory />
            </div>
          </div>
        </div>
      </main>

      <AddSubscriptionDialog open={addOpen} onOpenChange={setAddOpen} />
      <SubscriptionDetail
        subscription={selectedSub}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
};

export default Index;
