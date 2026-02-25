import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { Subscription, Income, Context } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export interface Organisation {
  id: string;
  name: string;
  logo_url?: string | null;
  kvk_number?: string | null;
}

interface AppState {
  subscriptions: Subscription[];
  incomes: Income[];
  organisations: Organisation[];
  activeContext: Context;
  activeOrgId: string | null;
  activeOrg: Organisation | null;
  loading: boolean;
  setActiveContext: (ctx: Context) => void;
  setActiveOrgId: (id: string) => void;
  addSubscription: (sub: Omit<Subscription, "id">) => Promise<void>;
  removeSubscription: (id: string) => Promise<void>;
  updateSubscription: (
    id: string,
    data: Partial<Subscription>,
  ) => Promise<void>;
  addIncome: (income: Omit<Income, "id">) => Promise<void>;
  removeIncome: (id: string) => Promise<void>;
  updateIncome: (id: string, data: Partial<Income>) => Promise<void>;
  filtered: Subscription[];
  filteredIncomes: Income[];
  refreshOrganisations: () => Promise<void>;
  refreshSubscriptions: () => Promise<void>;
  refreshIncomes: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [activeContext, setActiveContext] = useState<Context>("personal");
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const activeOrg = useMemo(
    () => organisations.find((o) => o.id === activeOrgId) || null,
    [organisations, activeOrgId],
  );

  const filtered = useMemo(() => {
    if (activeContext === "personal") {
      return subscriptions.filter((s) => s.context === "personal");
    }
    return subscriptions.filter(
      (s) => s.context === "organisation" && s.organisationId === activeOrgId,
    );
  }, [subscriptions, activeContext, activeOrgId]);

  const filteredIncomes = useMemo(() => {
    if (activeContext === "personal") {
      return incomes.filter((i) => i.context === "personal");
    }
    return incomes.filter(
      (i) => i.context === "organisation" && i.organisationId === activeOrgId,
    );
  }, [incomes, activeContext, activeOrgId]);

  // Ensure user profile exists
  const ensureProfile = useCallback(async () => {
    if (!user) return;

    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected if profile doesn't exist
      console.error("Error checking profile:", checkError);
      return;
    }

    // If profile doesn't exist, create it
    if (!existingProfile) {
      console.log("Creating profile for user:", user.id);
      const { error: createError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email || "",
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
      });

      if (createError) {
        console.error("Failed to create profile:", createError);
        toast.error(
          "Failed to create user profile. Please try refreshing the page.",
        );
      } else {
        console.log("Profile created successfully");
      }
    }
  }, [user]);

  // Load organizations
  const refreshOrganisations = useCallback(async () => {
    if (!user) {
      setOrganisations([]);
      return;
    }

    const { data: members, error } = await supabase
      .from("organization_members")
      .select(
        `
        organization_id,
        organizations (
          id,
          name,
          logo_url,
          kvk_number
        )
      `,
      )
      .eq("user_id", user.id);

    if (error) {
      console.error("Failed to load organizations:", error);

      // Check if it's a 404 error (table doesn't exist)
      if (
        error.message?.includes("404") ||
        error.message?.includes("relation") ||
        error.message?.includes("does not exist")
      ) {
        toast.error(
          "Database tables not found. Please run the supabase-schema.sql file in your Supabase SQL Editor.",
          { duration: 10000 },
        );
        console.error("⚠️ DATABASE SETUP REQUIRED");
        console.error("Go to: Supabase Dashboard → SQL Editor");
        console.error("Run the entire supabase-schema.sql file");
        console.error("See DATABASE_README.md for detailed instructions");
      }

      return;
    }

    const orgs =
      members?.map((m: any) => m.organizations).filter(Boolean) || [];

    setOrganisations(orgs);

    // Set first org as active if none selected
    if (!activeOrgId && orgs.length > 0) {
      setActiveOrgId(orgs[0].id);
    }
  }, [user, activeOrgId]);

  // Load subscriptions
  const refreshSubscriptions = useCallback(async () => {
    if (!user) {
      setSubscriptions([]);
      return;
    }

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Failed to load subscriptions:", error);

      // Check if it's a 404 error (table doesn't exist)
      if (
        error.message?.includes("404") ||
        error.message?.includes("relation") ||
        error.message?.includes("does not exist")
      ) {
        toast.error(
          "Database tables not found. Please run the supabase-schema.sql file in your Supabase SQL Editor.",
          { duration: 10000 },
        );
      }

      return;
    }

    // Map database format to app format
    const mappedSubs: Subscription[] = (data || []).map((sub: any) => ({
      id: sub.id,
      name: sub.name,
      publisher: sub.publisher,
      cost: parseFloat(sub.cost),
      currency: sub.currency,
      billingCycle: sub.billing_cycle,
      category: sub.category,
      context: sub.context,
      organisationId: sub.organization_id,
      nextBillingDate: sub.next_billing_date,
      startDate: sub.start_date,
      notes: sub.notes,
      isActive: sub.is_active,
    }));

    setSubscriptions(mappedSubs);
  }, [user]);

  // Load incomes
  const refreshIncomes = useCallback(async () => {
    if (!user) {
      setIncomes([]);
      return;
    }

    const { data, error } = await supabase
      .from("incomes")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Failed to load incomes:", error);

      // Check if it's a 404 error (table doesn't exist)
      if (
        error.message?.includes("404") ||
        error.message?.includes("relation") ||
        error.message?.includes("does not exist")
      ) {
        console.warn("Incomes table not found. Please update supabase schema.");
      }

      return;
    }

    // Map database format to app format
    const mappedIncomes: Income[] = (data || []).map((income: any) => ({
      id: income.id,
      name: income.name,
      source: income.source,
      amount: parseFloat(income.amount),
      currency: income.currency,
      frequency: income.frequency,
      category: income.category,
      context: income.context,
      organisationId: income.organization_id,
      nextReceiptDate: income.next_receipt_date,
      startDate: income.start_date,
      notes: income.notes,
      isActive: income.is_active,
    }));

    setIncomes(mappedIncomes);
  }, [user]);

  // Load data when user changes
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      // Ensure profile exists before loading data
      await ensureProfile();

      await Promise.all([
        refreshOrganisations(),
        refreshSubscriptions(),
        refreshIncomes(),
      ]);
      setLoading(false);
    };

    loadData();
  }, [
    user,
    ensureProfile,
    refreshOrganisations,
    refreshSubscriptions,
    refreshIncomes,
  ]);

  const addSubscription = useCallback(
    async (sub: Omit<Subscription, "id">) => {
      if (!user) return;

      const { error } = await supabase.from("subscriptions").insert({
        name: sub.name,
        publisher: sub.publisher,
        cost: sub.cost,
        currency: sub.currency,
        billing_cycle: sub.billingCycle,
        category: sub.category,
        context: sub.context,
        organization_id: sub.organisationId || null,
        user_id: user.id,
        next_billing_date: sub.nextBillingDate,
        start_date: sub.startDate,
        notes: sub.notes,
        is_active: sub.isActive,
      });

      if (error) {
        toast.error("Failed to add subscription");
        console.error(error);
        return;
      }

      toast.success("Subscription added successfully");
      await refreshSubscriptions();
    },
    [user, refreshSubscriptions],
  );

  const removeSubscription = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error("Failed to remove subscription");
        console.error(error);
        return;
      }

      toast.success("Subscription removed");
      await refreshSubscriptions();
    },
    [refreshSubscriptions],
  );

  const updateSubscription = useCallback(
    async (id: string, data: Partial<Subscription>) => {
      // Map app format to database format
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.publisher !== undefined) updateData.publisher = data.publisher;
      if (data.cost !== undefined) updateData.cost = data.cost;
      if (data.currency !== undefined) updateData.currency = data.currency;
      if (data.billingCycle !== undefined)
        updateData.billing_cycle = data.billingCycle;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.context !== undefined) updateData.context = data.context;
      if (data.organisationId !== undefined)
        updateData.organization_id = data.organisationId;
      if (data.nextBillingDate !== undefined)
        updateData.next_billing_date = data.nextBillingDate;
      if (data.startDate !== undefined) updateData.start_date = data.startDate;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.isActive !== undefined) updateData.is_active = data.isActive;

      const { error } = await supabase
        .from("subscriptions")
        .update(updateData)
        .eq("id", id);

      if (error) {
        toast.error("Failed to update subscription");
        console.error(error);
        return;
      }

      toast.success("Subscription updated");
      await refreshSubscriptions();
    },
    [refreshSubscriptions],
  );

  // Income functions
  const addIncome = useCallback(
    async (income: Omit<Income, "id">) => {
      if (!user) return;

      const { error } = await supabase.from("incomes").insert({
        name: income.name,
        source: income.source,
        amount: income.amount,
        currency: income.currency,
        frequency: income.frequency,
        category: income.category,
        context: income.context,
        organization_id: income.organisationId || null,
        user_id: user.id,
        next_receipt_date: income.nextReceiptDate,
        start_date: income.startDate,
        notes: income.notes,
        is_active: income.isActive,
      });

      if (error) {
        toast.error("Failed to add income");
        console.error(error);
        return;
      }

      toast.success("Income added successfully");
      await refreshIncomes();
    },
    [user, refreshIncomes],
  );

  const removeIncome = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("incomes").delete().eq("id", id);

      if (error) {
        toast.error("Failed to remove income");
        console.error(error);
        return;
      }

      toast.success("Income removed");
      await refreshIncomes();
    },
    [refreshIncomes],
  );

  const updateIncome = useCallback(
    async (id: string, data: Partial<Income>) => {
      // Map app format to database format
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.source !== undefined) updateData.source = data.source;
      if (data.amount !== undefined) updateData.amount = data.amount;
      if (data.currency !== undefined) updateData.currency = data.currency;
      if (data.frequency !== undefined) updateData.frequency = data.frequency;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.context !== undefined) updateData.context = data.context;
      if (data.organisationId !== undefined)
        updateData.organization_id = data.organisationId;
      if (data.nextReceiptDate !== undefined)
        updateData.next_receipt_date = data.nextReceiptDate;
      if (data.startDate !== undefined) updateData.start_date = data.startDate;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.isActive !== undefined) updateData.is_active = data.isActive;

      const { error } = await supabase
        .from("incomes")
        .update(updateData)
        .eq("id", id);

      if (error) {
        toast.error("Failed to update income");
        console.error(error);
        return;
      }

      toast.success("Income updated");
      await refreshIncomes();
    },
    [refreshIncomes],
  );

  return (
    <AppContext.Provider
      value={{
        subscriptions,
        incomes,
        organisations,
        activeContext,
        activeOrgId,
        activeOrg,
        loading,
        setActiveContext,
        setActiveOrgId,
        addSubscription,
        removeSubscription,
        updateSubscription,
        addIncome,
        removeIncome,
        updateIncome,
        filtered,
        filteredIncomes,
        refreshOrganisations,
        refreshSubscriptions,
        refreshIncomes,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
