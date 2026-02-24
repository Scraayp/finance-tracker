import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, UserPlus, X } from "lucide-react";

interface OrganizationSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string | null;
}

interface Organization {
  id: string;
  name: string;
  logo_url: string | null;
  kvk_number: string | null;
}

export const OrganizationSettingsDialog: React.FC<
  OrganizationSettingsDialogProps
> = ({ open, onOpenChange, organizationId }) => {
  const { user } = useAuth();
  const { refreshOrganisations } = useApp();
  const [loading, setLoading] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [kvkNumber, setKvkNumber] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "admin">("member");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (open && organizationId) {
      loadOrganization();
      loadMembers();
    }
  }, [open, organizationId]);

  const loadOrganization = async () => {
    if (!organizationId) return;

    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", organizationId)
      .single();

    if (error || !data) {
      toast.error("Failed to load organization");
      return;
    }

    const org = data as any;
    setOrganization(org);
    setName(org.name);
    setLogoUrl(org.logo_url || "");
    setKvkNumber(org.kvk_number || "");
  };

  const loadMembers = async () => {
    if (!organizationId) return;

    const { data, error } = await supabase
      .from("organization_members")
      .select(
        `
        id,
        role,
        created_at,
        profiles:user_id (
          id,
          email,
          full_name
        )
      `,
      )
      .eq("organization_id", organizationId);

    if (error) {
      console.error("Failed to load members:", error);
      return;
    }

    const membersData = data as any[];
    setMembers(membersData || []);

    // Load current user's role
    if (user) {
      const currentMember = membersData?.find(
        (m: any) => m.profiles?.id === user.id,
      );
      setUserRole(currentMember?.role || null);
    }
  };

  const handleSave = async () => {
    if (!organizationId || !user) return;

    setLoading(true);

    const updateData: any = {
      name,
      logo_url: logoUrl || null,
      kvk_number: kvkNumber || null,
    };

    const { error } = await (supabase as any)
      .from("organizations")
      .update(updateData)
      .eq("id", organizationId);

    setLoading(false);

    if (error) {
      toast.error("Failed to update organization");
      return;
    }

    toast.success("Organization updated successfully");
    onOpenChange(false);
  };

  const handleInviteMember = async () => {
    if (!organizationId || !inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setIsInviting(true);

    try {
      // First, check if user with this email exists
      const { data: existingUser, error: userCheckError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", inviteEmail.toLowerCase().trim())
        .single();

      if (userCheckError && userCheckError.code !== "PGRST116") {
        console.error("Error checking user:", userCheckError);
        toast.error("Failed to invite member");
        setIsInviting(false);
        return;
      }

      if (!existingUser) {
        toast.error(
          "User with this email does not exist. They must sign up first.",
        );
        setIsInviting(false);
        return;
      }

      const userId = (existingUser as any).id;

      // Check if user is already a member
      const { data: existingMember, error: memberCheckError } = await supabase
        .from("organization_members")
        .select("id")
        .eq("organization_id", organizationId)
        .eq("user_id", userId)
        .single();

      if (!memberCheckError || memberCheckError.code !== "PGRST116") {
        if (existingMember) {
          toast.error("User is already a member of this organization");
          setIsInviting(false);
          return;
        }
      }

      // Add member to organization
      const insertData: any = {
        organization_id: organizationId,
        user_id: userId,
        role: inviteRole,
      };

      const { error: insertError } = await (supabase as any)
        .from("organization_members")
        .insert(insertData);

      if (insertError) {
        console.error("Error adding member:", insertError);
        toast.error("Failed to add member to organization");
        setIsInviting(false);
        return;
      }

      toast.success(`Member invited successfully as ${inviteRole}`);
      setInviteEmail("");
      setInviteRole("member");
      await loadMembers();
    } catch (error) {
      console.error("Error inviting member:", error);
      toast.error("Failed to invite member");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberEmail: string) => {
    if (!organizationId) return;

    const { error } = await supabase
      .from("organization_members")
      .delete()
      .eq("id", memberId);

    if (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
      return;
    }

    toast.success(`${memberEmail} removed from organization`);
    await loadMembers();
  };

  const handleDeleteOrganization = async () => {
    if (!organizationId) return;

    setIsDeleting(true);

    const { error } = await supabase
      .from("organizations")
      .delete()
      .eq("id", organizationId);

    setIsDeleting(false);

    if (error) {
      console.error("Error deleting organization:", error);
      toast.error("Failed to delete organization");
      return;
    }

    toast.success("Organization deleted successfully");
    await refreshOrganisations();
    onOpenChange(false);
  };

  if (!organizationId) return null;

  const isOwner = userRole === "owner";
  const isAdmin = userRole === "admin";
  const canManageMembers = isOwner || isAdmin;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Organization Settings</DialogTitle>
            <DialogDescription>
              Manage your organization settings and members
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">General Settings</h3>

              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input
                  id="org-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Organization"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="org-logo">Logo URL</Label>
                <Input
                  id="org-logo"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="org-kvk">KVK Number</Label>
                <Input
                  id="org-kvk"
                  value={kvkNumber}
                  onChange={(e) => setKvkNumber(e.target.value)}
                  placeholder="12345678"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Members ({members.length})
                </h3>
              </div>

              {canManageMembers && (
                <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Invite New Member
                  </h4>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="member@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      disabled={isInviting}
                    />
                    <select
                      value={inviteRole}
                      onChange={(e) =>
                        setInviteRole(e.target.value as "member" | "admin")
                      }
                      disabled={isInviting}
                      className="px-3 py-2 border rounded-md text-sm bg-background"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button
                      onClick={handleInviteMember}
                      disabled={isInviting || !inviteEmail.trim()}
                      className="whitespace-nowrap"
                    >
                      {isInviting ? "Inviting..." : "Invite"}
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {members.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No members yet
                  </p>
                ) : (
                  members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">
                          {member.profiles?.full_name || member.profiles?.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.profiles?.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                        <span className="text-xs px-2 py-1 bg-muted rounded capitalize font-medium">
                          {member.role}
                        </span>
                        {canManageMembers &&
                          member.profiles?.id !== user?.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveMember(
                                  member.id,
                                  member.profiles?.email || "member",
                                )
                              }
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {isOwner && (
              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Organization
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Organization</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{name}"? This action cannot be
              undone. All organization data and subscriptions will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOrganization}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
