import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Lock,
  Mail,
  Shield,
  Eye,
  EyeOff,
  Palette,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { TwoFactorSetup } from "./TwoFactorSetup";
import { useTheme } from "next-themes";
import { accentOptions, useAppearance } from "@/context/AppearanceContext";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: Props) {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { accent, setAccent } = useAppearance();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Email change state
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // 2FA state
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);

  // Confirmation dialogs
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [show2FAConfirm, setShow2FAConfirm] = useState(false);

  // Check if 2FA is already enabled on mount
  useEffect(() => {
    if (user?.user_metadata?.two_factor_enabled) {
      setTwoFAEnabled(true);
    } else {
      // Check localStorage as backup
      const storedSecret = localStorage.getItem(`totp_secret_${user?.id}`);
      if (storedSecret) {
        setTwoFAEnabled(true);
      }
    }
  }, [user?.id, user?.user_metadata]);

  const handleChangeEmail = async () => {
    if (!newEmail.trim()) {
      toast.error("Please enter a new email address");
      return;
    }

    if (newEmail === user?.email) {
      toast.error("New email must be different from current email");
      return;
    }

    setEmailLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your new email to confirm the change");
        setNewEmail("");
        setShowEmailConfirm(false);
      }
    } catch (error) {
      toast.error("Failed to change email");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      // First verify current password by signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Current password is incorrect");
        setPasswordLoading(false);
        return;
      }

      // Now update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        toast.error(updateError.message);
      } else {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordConfirm(false);
        setShowPasswordFields(false);
      }
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    if (!twoFAEnabled) {
      // Show setup flow
      setShow2FASetup(true);
      setShow2FAConfirm(false);
    } else {
      // Disable 2FA
      setTwoFALoading(true);
      try {
        const { error } = await supabase.auth.updateUser({
          data: {
            two_factor_secret: null,
            two_factor_enabled: false,
          },
        });

        if (error) {
          toast.error(`Failed to disable 2FA: ${error.message}`);
        } else {
          // Clear from localStorage
          localStorage.removeItem(`totp_secret_${user?.id}`);
          setTwoFAEnabled(false);
          toast.success("Two-factor authentication has been disabled");
        }
        setShow2FAConfirm(false);
      } catch (error) {
        toast.error("Failed to update 2FA settings");
      } finally {
        setTwoFALoading(false);
      }
    }
  };

  const handle2FASetupComplete = (secret: string) => {
    setTwoFAEnabled(true);
    setShow2FASetup(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg glass-strong border-border">
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogDescription>
              Manage your account security and preferences
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="2fa">2FA</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-4 pt-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Current Email</Label>
                  <div className="mt-1 p-3 rounded-lg bg-muted/50 border border-border/50">
                    <p className="text-sm font-medium">{user?.email}</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="new-email" className="text-sm font-medium">
                    New Email Address
                  </Label>
                  <Input
                    id="new-email"
                    type="email"
                    placeholder="new@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Button
                  onClick={() => setShowEmailConfirm(true)}
                  disabled={!newEmail.trim() || emailLoading}
                  className="w-full"
                  variant="outline"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Change Email
                </Button>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-4 pt-4">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Update your password to keep your account secure
                </p>

                {!showPasswordFields ? (
                  <Button
                    onClick={() => setShowPasswordFields(true)}
                    className="w-full"
                    variant="outline"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label
                        htmlFor="current-pw"
                        className="text-sm font-medium"
                      >
                        Current Password
                      </Label>
                      <div className="mt-1 relative">
                        <Input
                          id="current-pw"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter current password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="new-pw" className="text-sm font-medium">
                        New Password
                      </Label>
                      <Input
                        id="new-pw"
                        type="password"
                        placeholder="Enter new password (min 6 characters)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="confirm-pw"
                        className="text-sm font-medium"
                      >
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirm-pw"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => {
                          setShowPasswordFields(false);
                          setCurrentPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => setShowPasswordConfirm(true)}
                        disabled={
                          !currentPassword || !newPassword || !confirmPassword
                        }
                        className="flex-1"
                      >
                        Update Password
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* 2FA Tab */}
            <TabsContent value="2fa" className="space-y-4 pt-4">
              {show2FASetup ? (
                <TwoFactorSetup
                  onComplete={handle2FASetupComplete}
                  onCancel={() => setShow2FASetup(false)}
                />
              ) : (
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50 space-y-3">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                          Two-Factor Authentication
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Add an extra layer of security to your account by
                          requiring a second verification method
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${twoFAEnabled ? "bg-green-500" : "bg-gray-300"}`}
                        />
                        <span className="text-sm font-medium">
                          Status: {twoFAEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      <Button
                        onClick={() => setShow2FAConfirm(true)}
                        variant={twoFAEnabled ? "destructive" : "default"}
                        size="sm"
                        disabled={twoFALoading}
                      >
                        {twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
                      </Button>
                    </div>
                  </div>

                  {!twoFAEnabled && (
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
                      <p className="text-xs text-blue-800 dark:text-blue-200">
                        💡 <strong>Recommended:</strong> Enable two-factor
                        authentication to protect your account from unauthorized
                        access.
                      </p>
                    </div>
                  )}

                  {twoFAEnabled && (
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50">
                      <p className="text-xs text-green-800 dark:text-green-200">
                        ✓ <strong>Enabled:</strong> Your account is protected
                        with two-factor authentication.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Monitor className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Theme Mode</p>
                      <p className="text-xs text-muted-foreground">
                        Choose between light, dark, or follow your system
                        setting.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={theme === "light" ? "default" : "outline"}
                      onClick={() => setTheme("light")}
                      className="justify-start"
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </Button>
                    <Button
                      type="button"
                      variant={theme === "dark" ? "default" : "outline"}
                      onClick={() => setTheme("dark")}
                      className="justify-start"
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </Button>
                    <Button
                      type="button"
                      variant={theme === "system" ? "default" : "outline"}
                      onClick={() => setTheme("system")}
                      className="justify-start"
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      System
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Palette className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Primary Color</p>
                      <p className="text-xs text-muted-foreground">
                        Pick the primary color used across buttons, highlights,
                        and accents.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {accentOptions.map((option) => {
                      const selected = accent === option.value;
                      return (
                        <Button
                          key={option.value}
                          type="button"
                          variant="outline"
                          onClick={() => setAccent(option.value)}
                          className={
                            selected ? "border-primary text-primary" : ""
                          }
                        >
                          <span
                            className="mr-2 h-3.5 w-3.5 rounded-full border border-white/40"
                            style={{ backgroundColor: option.swatch }}
                          />
                          {option.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Email Change Confirmation */}
      <AlertDialog open={showEmailConfirm} onOpenChange={setShowEmailConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Email Address?</AlertDialogTitle>
            <AlertDialogDescription>
              A confirmation link will be sent to <strong>{newEmail}</strong>.
              You'll need to verify it to complete the change.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end pt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleChangeEmail}
              disabled={emailLoading}
            >
              {emailLoading ? "Sending..." : "Confirm"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Change Confirmation */}
      <AlertDialog
        open={showPasswordConfirm}
        onOpenChange={setShowPasswordConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Password?</AlertDialogTitle>
            <AlertDialogDescription>
              Your password will be changed immediately. Make sure to remember
              your new password.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end pt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleChangePassword}
              disabled={passwordLoading}
            >
              {passwordLoading ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* 2FA Toggle Confirmation */}
      <AlertDialog open={show2FAConfirm} onOpenChange={setShow2FAConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {twoFAEnabled ? "Disable 2FA?" : "Enable 2FA?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {twoFAEnabled
                ? "Disabling two-factor authentication will make your account less secure. Are you sure?"
                : "Enabling two-factor authentication adds extra security to your account."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end pt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggle2FA}
              disabled={twoFALoading}
              className={
                twoFAEnabled ? "bg-destructive hover:bg-destructive/90" : ""
              }
            >
              {twoFALoading ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
