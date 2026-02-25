import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { StatsCards } from "@/components/StatsCards";
import { SubscriptionList } from "@/components/SubscriptionList";
import { IncomeList } from "@/components/IncomeList";
import { SpendByCategory } from "@/components/SpendByCategory";
import { SubscriptionDetail } from "@/components/SubscriptionDetail";
import { AddSubscriptionDialog } from "@/components/AddSubscriptionDialog";
import { AddIncomeDialog } from "@/components/AddIncomeDialog";
import { EditSubscriptionDialog } from "@/components/EditSubscriptionDialog";
import { EditIncomeDialog } from "@/components/EditIncomeDialog";
import { AddChoiceDialog } from "@/components/AddChoiceDialog";
import { AppSidebar } from "@/components/AppSidebar";
import { Subscription, Income } from "@/lib/types";
import { Plus, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const Index = () => {
  const { activeContext, activeOrg, loading } = useApp();
  const [choiceOpen, setChoiceOpen] = useState(false);
  const [addSubOpen, setAddSubOpen] = useState(false);
  const [addIncomeOpen, setAddIncomeOpen] = useState(false);
  const [editSubOpen, setEditSubOpen] = useState(false);
  const [editIncomeOpen, setEditIncomeOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleSelect = (sub: Subscription) => {
    setSelectedSub(sub);
    setDetailOpen(true);
  };

  const handleEditSub = (sub: Subscription) => {
    setSelectedSub(sub);
    setEditSubOpen(true);
  };

  const handleEditIncome = (income: Income) => {
    setSelectedIncome(income);
    setEditIncomeOpen(true);
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
      <div className="flex min-h-screen w-full overflow-x-hidden">
        <div
          className="hidden lg:block bg-sidebar"
          style={{
            backgroundImage:
              "linear-gradient(180deg, hsl(var(--sidebar-background)) 0%, hsl(var(--sidebar-background)) 100%)",
          }}
        >
          <AppSidebar onAddClick={() => setChoiceOpen(true)} />
        </div>
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
    <div className="flex min-h-screen w-full overflow-x-hidden">
      <div
        className="hidden lg:block bg-sidebar"
        style={{
          backgroundImage:
            "linear-gradient(180deg, hsl(var(--sidebar-background)) 0%, hsl(var(--sidebar-background)) 100%)",
        }}
      >
        <AppSidebar onAddClick={() => setChoiceOpen(true)} />
      </div>

      <main className="flex-1 overflow-auto bg-grid">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border/40 px-4 sm:px-6 glass-subtle">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg lg:hidden"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold tracking-tight truncate">
                {title}
              </h1>
              {activeContext === "organisation" && activeOrg?.kvkNumber && (
                <p className="text-[11px] text-muted-foreground truncate">
                  KVK: {activeOrg.kvkNumber}
                </p>
              )}
            </div>
          </div>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg lg:hidden"
            onClick={() => setChoiceOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </header>

        <div className="mx-auto w-full max-w-[1280px] p-4 sm:p-6 space-y-6">
          <StatsCards />

          <Tabs defaultValue="subscriptions" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-5 rounded-xl border border-border/60 bg-muted/60 p-1.5 h-auto">
              <TabsTrigger
                value="subscriptions"
                className="h-10 rounded-lg text-sm font-semibold text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/60"
              >
                Subscriptions
              </TabsTrigger>
              <TabsTrigger
                value="incomes"
                className="h-10 rounded-lg text-sm font-semibold text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/60"
              >
                Incomes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="subscriptions">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h2 className="section-label mb-3">Subscriptions</h2>
                  <SubscriptionList
                    onSelect={handleSelect}
                    onEdit={handleEditSub}
                  />
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
                  <IncomeList onEdit={handleEditIncome} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[85vw] max-w-sm border-r-0">
          <AppSidebar
            onAddClick={() => setChoiceOpen(true)}
            mobile
            onNavigate={() => setMobileSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <AddChoiceDialog
        open={choiceOpen}
        onOpenChange={setChoiceOpen}
        onAddSubscription={() => setAddSubOpen(true)}
        onAddIncome={() => setAddIncomeOpen(true)}
      />
      <AddSubscriptionDialog open={addSubOpen} onOpenChange={setAddSubOpen} />
      <AddIncomeDialog open={addIncomeOpen} onOpenChange={setAddIncomeOpen} />
      <EditSubscriptionDialog
        open={editSubOpen}
        onOpenChange={setEditSubOpen}
        subscription={selectedSub}
      />
      <EditIncomeDialog
        open={editIncomeOpen}
        onOpenChange={setEditIncomeOpen}
        income={selectedIncome}
      />
      <SubscriptionDetail
        subscription={selectedSub}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
};

export default Index;
