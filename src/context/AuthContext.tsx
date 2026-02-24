import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { TOTP } from "otpauth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName?: string,
  ) => Promise<{ error: AuthError | null }>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithDiscord: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  verify2FA: (code: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl =
      import.meta.env.VITE_AUTH_REDIRECT_URL || `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(
        "Account created! Please check your email to verify your account.",
      );
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back!");
    }

    return { error };
  };

  const signInWithGoogle = async () => {
    const redirectUrl =
      import.meta.env.VITE_AUTH_REDIRECT_URL || `${window.location.origin}/`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      toast.error(error.message);
    }

    return { error };
  };

  const signInWithDiscord = async () => {
    const redirectUrl =
      import.meta.env.VITE_AUTH_REDIRECT_URL || `${window.location.origin}/`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      toast.error(error.message);
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signed out successfully");
    }
  };

  const resetPassword = async (email: string) => {
    const baseUrl =
      import.meta.env.VITE_AUTH_REDIRECT_URL || `${window.location.origin}`;
    const resetUrl = `${baseUrl}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset email sent!");
    }

    return { error };
  };

  const verify2FA = async (code: string): Promise<boolean> => {
    try {
      if (!user) {
        toast.error("No user session found");
        return false;
      }

      // Get the stored TOTP secret
      const storedSecret =
        user?.user_metadata?.two_factor_secret ||
        JSON.parse(localStorage.getItem(`totp_secret_${user?.id}`) || "{}")
          ?.secret;

      if (!storedSecret) {
        toast.error("2FA not configured");
        return false;
      }

      // Verify the code
      const totp = new TOTP({
        issuer: "Finance Tracker",
        label: user.email || "User",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: storedSecret,
      });

      const delta = totp.validate({
        token: code.replace(/\s/g, ""),
        window: 1,
      });

      if (delta === null) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("2FA verification error:", error);
      return false;
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithDiscord,
    signOut,
    resetPassword,
    verify2FA,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
