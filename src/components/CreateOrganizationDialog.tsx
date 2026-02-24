import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreateOrganizationDialog: React.FC<
  CreateOrganizationDialogProps
> = ({ open, onOpenChange, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [kvkNumber, setKvkNumber] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    // Ensure profile exists before creating organization
    console.log("Checking if profile exists for user:", user.id);
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (profileCheckError) {
      console.error("Error checking profile:", profileCheckError);
      toast.error("Failed to verify user profile. Please try again.");
      setLoading(false);
      return;
    }

    // Create profile if it doesn't exist
    if (!existingProfile) {
      console.log("Profile doesn't exist, creating it now...");
      const { error: createProfileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
        });

      if (createProfileError) {
        console.error("Failed to create profile:", createProfileError);
        toast.error("Failed to create user profile. Please refresh the page.");
        setLoading(false);
        return;
      }
      console.log("Profile created successfully");
    } else {
      console.log("Profile already exists");
    }

    // Create organization
    console.log("Creating organization with created_by:", user.id);
    console.log("User object:", { id: user.id, email: user.email });
    console.log("Auth session:", await supabase.auth.getSession());

    // Test what auth.uid() returns in Supabase via RPC
    const { data: authUidTest, error: authUidError } = await supabase.rpc(
      "get_current_user_id",
    );
    console.log("Supabase auth.uid() via RPC:", authUidTest, authUidError);
    console.log("Does auth.uid() match user.id?", authUidTest === user.id);

    // Test if user_profile_exists() works
    const { data: profileExistsTest, error: profileExistsError } =
      await supabase.rpc("user_profile_exists");
    console.log(
      "user_profile_exists() result:",
      profileExistsTest,
      profileExistsError,
    );

    // Try to verify RLS is working by selecting from profiles
    const { data: profileTest, error: profileTestError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("id", user.id)
      .single();
    console.log(
      "Profile SELECT test (should work with RLS):",
      profileTest,
      profileTestError,
    );

    const { data: orgData, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name,
        logo_url: logoUrl || null,
        kvk_number: kvkNumber || null,
        created_by: user.id,
      } as any)
      .select()
      .single();

    if (orgError || !orgData) {
      console.error("Failed to create organization:", orgError);
      console.error("Full error object:", JSON.stringify(orgError, null, 2));

      // Check if it's a database setup issue
      if (
        orgError?.message?.includes("404") ||
        orgError?.message?.includes("relation") ||
        orgError?.message?.includes("does not exist")
      ) {
        toast.error(
          "Database setup required! Please run supabase-schema-fixed.sql in your Supabase SQL Editor.",
          { duration: 10000 },
        );
      } else if (
        orgError?.code === "42501" ||
        orgError?.message?.includes("row-level security")
      ) {
        toast.error(
          "Permission error. Please refresh the page and try again.",
          { duration: 5000 },
        );
      } else {
        toast.error(
          `Failed to create organization: ${orgError?.message || "Unknown error"}`,
        );
      }

      setLoading(false);
      return;
    }

    const org = orgData as any;

    // Add creator as owner
    const { error: memberError } = await supabase
      .from("organization_members")
      .insert({
        organization_id: org.id,
        user_id: user.id,
        role: "owner",
      } as any);

    setLoading(false);

    if (memberError) {
      toast.error("Failed to add you as owner");
      return;
    }

    toast.success("Organization created successfully");
    setName("");
    setLogoUrl("");
    setKvkNumber("");
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>
            Create a new organization to manage team subscriptions
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreate}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Company"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL (optional)</Label>
              <Input
                id="logo"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kvk">KVK Number (optional)</Label>
              <Input
                id="kvk"
                value={kvkNumber}
                onChange={(e) => setKvkNumber(e.target.value)}
                placeholder="12345678"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name}>
              {loading ? "Creating..." : "Create Organization"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
