import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AccentColor =
  | "green"
  | "blue"
  | "red"
  | "yellow"
  | "purple"
  | "pink";

export const accentOptions: Array<{
  value: AccentColor;
  label: string;
  swatch: string;
}> = [
  { value: "green", label: "Green", swatch: "hsl(152 58% 46%)" },
  { value: "blue", label: "Blue", swatch: "hsl(217 91% 60%)" },
  { value: "red", label: "Red", swatch: "hsl(0 84% 60%)" },
  { value: "yellow", label: "Yellow", swatch: "hsl(45 93% 52%)" },
  { value: "purple", label: "Purple", swatch: "hsl(263 70% 60%)" },
  { value: "pink", label: "Pink", swatch: "hsl(330 81% 60%)" },
];

interface AppearanceContextValue {
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
}

const STORAGE_KEY = "finance-tracker-accent";
const DEFAULT_ACCENT: AccentColor = "green";

const AppearanceContext = createContext<AppearanceContextValue | undefined>(
  undefined,
);

const applyAccent = (accent: AccentColor) => {
  document.documentElement.setAttribute("data-accent", accent);
};

export function AppearanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [accent, setAccentState] = useState<AccentColor>(DEFAULT_ACCENT);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as AccentColor | null;
    const isValid = accentOptions.some((option) => option.value === stored);
    const initial = isValid && stored ? stored : DEFAULT_ACCENT;

    setAccentState(initial);
    applyAccent(initial);
  }, []);

  const setAccent = (nextAccent: AccentColor) => {
    setAccentState(nextAccent);
    applyAccent(nextAccent);
    localStorage.setItem(STORAGE_KEY, nextAccent);
  };

  const value = useMemo(
    () => ({
      accent,
      setAccent,
    }),
    [accent],
  );

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error("useAppearance must be used within an AppearanceProvider");
  }
  return context;
}
