import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Building2,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Settings,
  PlusCircle,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { OrganizationSettingsDialog } from "./OrganizationSettingsDialog";
import { CreateOrganizationDialog } from "./CreateOrganizationDialog";
import { ProfileDialog } from "./ProfileDialog";

interface Props {
  onAddClick: () => void;
  mobile?: boolean;
  onNavigate?: () => void;
}

export function AppSidebar({ onAddClick, mobile = false, onNavigate }: Props) {
  const {
    activeContext,
    setActiveContext,
    organisations,
    activeOrg,
    activeOrgId,
    setActiveOrgId,
    refreshOrganisations,
  } = useApp();
  const { signOut, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showOrgSettings, setShowOrgSettings] = useState(false);
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const isCollapsed = mobile ? false : collapsed;

  return (
    <>
      <aside
        className={cn(
          "flex flex-col text-sidebar-foreground transition-all duration-300 border-r border-sidebar-border/45 relative",
          mobile
            ? "h-full w-full border-r-0 bg-sidebar"
            : cn(
                "shrink-0 h-screen sticky top-0 overflow-y-auto bg-transparent",
                isCollapsed ? "w-[72px]" : "w-[280px]",
              ),
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border/35">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden">
                <img
                  src="/finance-tracker.png"
                  alt="Finance Tracker"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Finance Tracker
              </span>
            </div>
          )}
          {!mobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg transition-all"
              onClick={() => setCollapsed((p) => !p)}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {/* User Info */}
        {!isCollapsed && user && (
          <div className="px-4 pt-4 pb-3 border-b border-sidebar-border/20 space-y-2">
            <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-sidebar-accent/45 border border-sidebar-border/35">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-sidebar-muted truncate font-medium">
                  Email
                </p>
                <p className="text-sm text-sidebar-foreground truncate font-medium">
                  {user.email?.split("@")[0]}
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                setShowProfile(true);
                onNavigate?.();
              }}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <UserCog className="h-3.5 w-3.5 mr-2" />
              Settings
            </Button>
          </div>
        )}

        {/* Context Switcher */}
        <div className="px-4 pt-5 pb-3">
          {!isCollapsed && (
            <p className="mb-3 px-3 text-xs font-semibold text-sidebar-muted uppercase tracking-wider">
              Workspace
            </p>
          )}
          <div className="space-y-2">
            <SidebarButton
              icon={User}
              label="Personal"
              collapsed={isCollapsed}
              active={activeContext === "personal"}
              onClick={() => {
                setActiveContext("personal");
                onNavigate?.();
              }}
            />
            <SidebarButton
              icon={Building2}
              label="Organization"
              collapsed={isCollapsed}
              active={activeContext === "organisation"}
              onClick={() => {
                setActiveContext("organisation");
                onNavigate?.();
              }}
            />
          </div>
        </div>

        {/* Org Switcher */}
        {activeContext === "organisation" && (
          <div className="px-4 pb-4 border-b border-sidebar-border/20">
            {!isCollapsed ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm bg-sidebar-accent/50 hover:bg-sidebar-accent/65 border border-sidebar-border/35 hover:border-primary/40 transition-all duration-200 group">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 transition-all">
                      <Building2 className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="flex-1 text-left truncate font-medium text-sm text-sidebar-foreground group-hover:text-primary transition-colors">
                      {activeOrg?.name || "Select org"}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-sidebar-muted group-hover:text-sidebar-foreground transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-64 glass-strong"
                >
                  {organisations.map((org) => (
                    <DropdownMenuItem
                      key={org.id}
                      onClick={() => {
                        setActiveOrgId(org.id);
                        onNavigate?.();
                      }}
                      className={cn(
                        "cursor-pointer rounded-lg px-3 py-2 transition-all",
                        org.id === activeOrg?.id &&
                          "bg-primary/10 text-primary font-medium",
                      )}
                    >
                      <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
                      <div className="flex flex-col flex-1">
                        <span className="text-sm">{org.name}</span>
                        {org.kvk_number && (
                          <span className="text-xs text-muted-foreground">
                            KVK: {org.kvk_number}
                          </span>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setShowCreateOrg(true);
                      onNavigate?.();
                    }}
                    className="cursor-pointer rounded-lg text-primary hover:bg-primary/10"
                  >
                    <PlusCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    Create Organization
                  </DropdownMenuItem>
                  {activeOrg && (
                    <DropdownMenuItem
                      onClick={() => {
                        setShowOrgSettings(true);
                        onNavigate?.();
                      }}
                      className="cursor-pointer rounded-lg"
                    >
                      <Settings className="h-4 w-4 mr-2 flex-shrink-0" />
                      Organization Settings
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex w-full items-center justify-center rounded-xl p-2.5 bg-sidebar-accent/50 hover:bg-sidebar-accent/70 border border-sidebar-border/35 hover:border-primary/40 transition-all">
                    <Building2 className="h-4 w-4 text-primary" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-56 glass-strong"
                >
                  {organisations.map((org) => (
                    <DropdownMenuItem
                      key={org.id}
                      onClick={() => {
                        setActiveOrgId(org.id);
                        onNavigate?.();
                      }}
                      className={cn(
                        "cursor-pointer rounded-lg",
                        org.id === activeOrg?.id &&
                          "bg-primary/10 text-primary font-medium",
                      )}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      {org.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setShowCreateOrg(true);
                      onNavigate?.();
                    }}
                    className="cursor-pointer rounded-lg text-primary"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Org
                  </DropdownMenuItem>
                  {activeOrg && (
                    <DropdownMenuItem
                      onClick={() => {
                        setShowOrgSettings(true);
                        onNavigate?.();
                      }}
                      className="cursor-pointer rounded-lg"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}

        {/* Add button */}
        <div className="px-4 pt-5 pb-3">
          <Button
            onClick={() => {
              onAddClick();
              onNavigate?.();
            }}
            className={cn(
              "w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-10 font-medium transition-all duration-200",
              isCollapsed && "px-0",
            )}
          >
            <Plus className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Add Item</span>}
          </Button>
        </div>

        {/* Logout button */}
        <div className="px-4 pb-4 border-t border-sidebar-border/20 pt-3 flex flex-col gap-2">
          <Button
            onClick={() => {
              signOut();
              onNavigate?.();
            }}
            variant="ghost"
            className={cn(
              "w-full text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground rounded-lg h-10 transition-all border border-transparent hover:border-sidebar-border/50",
              isCollapsed && "px-0",
            )}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </aside>

      <OrganizationSettingsDialog
        open={showOrgSettings}
        onOpenChange={setShowOrgSettings}
        organizationId={activeOrgId}
      />

      <CreateOrganizationDialog
        open={showCreateOrg}
        onOpenChange={setShowCreateOrg}
        onSuccess={refreshOrganisations}
      />

      <ProfileDialog open={showProfile} onOpenChange={setShowProfile} />
    </>
  );
}

function SidebarButton({
  icon: Icon,
  label,
  collapsed,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative group",
        active
          ? "bg-primary/15 text-primary border border-primary/35"
          : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground border border-transparent hover:border-sidebar-border/40",
        collapsed && "justify-center px-0 py-2.5",
      )}
    >
      {active && !collapsed && (
        <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r transition-all" />
      )}
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-all",
          active && "text-primary",
        )}
      />
      {!collapsed && <span className="transition-colors">{label}</span>}
    </button>
  );
}
