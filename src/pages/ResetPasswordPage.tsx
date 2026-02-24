import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { AlertCircle, CheckCircle } from "lucide-react";

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Check if user has a valid session with reset token
  useEffect(() => {
    const checkResetSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setErrorMessage(
            "Invalid or expired reset link. Please request a new one.",
          );
          return;
        }

        // Session exists, user is authenticated through the reset link
        setIsResetting(true);
      } catch (err) {
        setErrorMessage("Error checking reset session. Please try again.");
      }
    };

    checkResetSession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error("Please enter a new password");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setErrorMessage(error.message);
        toast.error(error.message);
      } else {
        setSuccessMessage("Password reset successfully!");
        toast.success("Password has been reset. Redirecting to login...");

        // Sign out and redirect after 2 seconds
        await supabase.auth.signOut();
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      }
    } catch (error) {
      const err =
        error instanceof Error ? error.message : "Failed to reset password";
      setErrorMessage(err);
      toast.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isResetting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Loading reset credentials...</CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage ? (
              <>
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
                <Button
                  onClick={() => navigate("/login", { replace: true })}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </>
            ) : (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-4">
            {successMessage && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950/30">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || !!successMessage}
                required
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading || !!successMessage}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/login", { replace: true })}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !!successMessage}
              className="flex-1"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
