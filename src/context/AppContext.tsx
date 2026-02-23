import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { Subscription, Context } from "@/lib/types";
import { mockSubscriptions, mockOrganisations, Organisation } from "@/lib/mock-data";

interface AppState {
  subscriptions: Subscription[];
  organisations: Organisation[];
  activeContext: Context;
  activeOrgId: string | null;
  activeOrg: Organisation | null;
  setActiveContext: (ctx: Context) => void;
  setActiveOrgId: (id: string) => void;
  addSubscription: (sub: Omit<Subscription, "id">) => void;
  removeSubscription: (id: string) => void;
  updateSubscription: (id: string, data: Partial<Subscription>) => void;
  filtered: Subscription[];
}

const AppContext = createContext<AppState | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [activeContext, setActiveContext] = useState<Context>("personal");
  const [activeOrgId, setActiveOrgId] = useState<string>(mockOrganisations[0].id);

  const activeOrg = useMemo(
    () => mockOrganisations.find((o) => o.id === activeOrgId) || null,
    [activeOrgId]
  );

  const filtered = useMemo(() => {
    if (activeContext === "personal") {
      return subscriptions.filter((s) => s.context === "personal");
    }
    return subscriptions.filter(
      (s) => s.context === "organisation" && s.organisationId === activeOrgId
    );
  }, [subscriptions, activeContext, activeOrgId]);

  const addSubscription = useCallback((sub: Omit<Subscription, "id">) => {
    setSubscriptions((prev) => [
      ...prev,
      { ...sub, id: crypto.randomUUID() },
    ]);
  }, []);

  const removeSubscription = useCallback((id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updateSubscription = useCallback((id: string, data: Partial<Subscription>) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        subscriptions,
        organisations: mockOrganisations,
        activeContext,
        activeOrgId,
        activeOrg,
        setActiveContext,
        setActiveOrgId,
        addSubscription,
        removeSubscription,
        updateSubscription,
        filtered,
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
