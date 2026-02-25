import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SetupRequired } from "@/components/SetupRequired";
import Index from "./pages/Index";
import { LoginPage } from "./pages/LoginPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "next-themes";
import { AppearanceProvider } from "@/context/AppearanceContext";

const queryClient = new QueryClient();

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Check if values exist and aren't placeholders
  return (
    url &&
    key &&
    url !== "" &&
    key !== "" &&
    !key.startsWith("sb_publishable__") &&
    !url.includes("placeholder")
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppearanceProvider>
          <TooltipProvider>
            {/* Show setup page if Supabase isn't configured */}
            {!isSupabaseConfigured() ? (
              <>
                <Toaster />
                <Sonner />
                <SetupRequired />
              </>
            ) : (
              <AuthProvider>
                <AppProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/login" element={<LoginPage />} />
                      <Route
                        path="/reset-password"
                        element={<ResetPasswordPage />}
                      />
                      <Route
                        path="/"
                        element={
                          <ProtectedRoute>
                            <Index />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </AppProvider>
              </AuthProvider>
            )}
          </TooltipProvider>
        </AppearanceProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
