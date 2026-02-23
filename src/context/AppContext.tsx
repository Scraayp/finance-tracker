import React, { createContext, useContext, useState, useCallback } from "react";
import { Subscription, Context } from "@/lib/types";
import { mockSubscriptions } from "@/lib/mock-data";

interface AppState {
  subscriptions: Subscription[];
  activeContext: Context;
  setActiveContext: (ctx: Context) => void;
  addSubscription: (sub: Omit<Subscription, "id">) => void;
  removeSubscription: (id: string) => void;
  updateSubscription: (id: string, data: Partial<Subscription>) => void;
  filtered: Subscription[];
}

const AppContext = createContext<AppState | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [activeContext, setActiveContext] = useState<Context>("personal");

  const filtered = subscriptions.filter((s) => s.context === activeContext);

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
        activeContext,
        setActiveContext,
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
