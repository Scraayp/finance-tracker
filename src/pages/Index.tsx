import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { StatsCards } from "@/components/StatsCards";
import { SubscriptionList } from "@/components/SubscriptionList";
import { IncomeList } from "@/components/IncomeList";
import { SpendByCategory } from "@/components/SpendByCategory";
import { SubscriptionDetail } from "@/components/SubscriptionDetail";
import { AddSubscriptionDialog } from "@/components/AddSubscriptionDialog";
import { AddIncomeDialog } from "@/components/AddIncomeDialog";
import { AddChoiceDialog } from "@/components/AddChoiceDialog";
import { AppSidebar } from "@/components/AppSidebar";
import { Subscription, Income } from "@/lib/types";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { activeContext, activeOrg, loading } = useApp();
  const [choiceOpen, setChoiceOpen] = useState(false);
  const [addSubOpen, setAddSubOpen] = useState(false);
  const [addIncomeOpen, setAddIncomeOpen] = useState(false);
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

  // Show loading screen while fetching data
  if (loading) {
    return (
      <div className="flex min-h-screen w-full">
        <AppSidebar onAddClick={() => setChoiceOpen(true)} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar onAddClick={() => setChoiceOpen(true)} />

      <main className="flex-1 overflow-auto bg-grid">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border/50 px-6 glass-strong">
          <div>
            <h1 className="text-base font-semibold">{title}</h1>
            {activeContext === "organisation" && activeOrg?.kvkNumber && (
              <p className="text-[11px] text-muted-foreground">
                KVK: {activeOrg.kvkNumber}
              </p>
            )}
          </div>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg md:hidden"
            onClick={() => setChoiceOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </header>

        <div className="p-6 space-y-6 max-w-[1200px]">
          <StatsCards />

          <Tabs defaultValue="subscriptions" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="incomes">Incomes</TabsTrigger>
            </TabsList>

            <TabsContent value="subscriptions">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h2 className="section-label mb-3">Subscriptions</h2>
                  <SubscriptionList onSelect={handleSelect} />
                </div>
                <div>
                  <SpendByCategory />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="incomes">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h2 className="section-label mb-3">Incomes</h2>
                  <IncomeList />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AddChoiceDialog
        open={choiceOpen}
        onOpenChange={setChoiceOpen}
        onAddSubscription={() => setAddSubOpen(true)}
        onAddIncome={() => setAddIncomeOpen(true)}
      />
      <AddSubscriptionDialog open={addSubOpen} onOpenChange={setAddSubOpen} />
      <AddIncomeDialog open={addIncomeOpen} onOpenChange={setAddIncomeOpen} />
      <SubscriptionDetail
        subscription={selectedSub}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
};

export default Index;
