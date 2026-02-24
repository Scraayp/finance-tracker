import { useApp } from "@/context/AppContext";
import {
  User, Building2, LayoutDashboard, List, Plus,
  ChevronLeft, ChevronRight, ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  onAddClick: () => void;
}

export function AppSidebar({ onAddClick }: Props) {
  const { activeContext, setActiveContext, organisations, activeOrg, setActiveOrgId } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 shrink-0 border-r border-sidebar-border relative",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-4">
        {!collapsed && (
          <span className="text-lg font-bold gradient-text tracking-tight">SubTrackr</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg"
          onClick={() => setCollapsed((p) => !p)}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </Button>
      </div>

      <Separator className="bg-sidebar-border opacity-50" />

      {/* Context Switcher */}
      <div className="px-3 pt-5 pb-2">
        {!collapsed && (
          <p className="mb-2.5 px-2 section-label text-sidebar-muted">Context</p>
        )}
        <div className="space-y-1">
          <SidebarButton
            icon={User}
            label="Personal"
            collapsed={collapsed}
            active={activeContext === "personal"}
            onClick={() => setActiveContext("personal")}
          />
          <SidebarButton
            icon={Building2}
            label="Organisation"
            collapsed={collapsed}
            active={activeContext === "organisation"}
            onClick={() => setActiveContext("organisation")}
          />
        </div>
      </div>

      {/* Org Switcher */}
      {activeContext === "organisation" && (
        <div className="px-3 pb-2">
          {!collapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm glass-subtle hover:border-primary/30 transition-all duration-200">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="flex-1 text-left truncate font-medium text-sm">
                    {activeOrg?.name || "Select org"}
                  </span>
                  <ChevronDown className="h-3 w-3 text-sidebar-muted shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 glass-strong">
                {organisations.map((org) => (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => setActiveOrgId(org.id)}
                    className={cn(
                      "cursor-pointer rounded-lg",
                      org.id === activeOrg?.id && "text-primary font-medium"
                    )}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    <div className="flex flex-col">
                      <span>{org.name}</span>
                      {org.kvkNumber && (
                        <span className="text-[10px] text-muted-foreground">
                          KVK: {org.kvkNumber}
                        </span>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center justify-center rounded-xl p-2 glass-subtle hover:border-primary/30 transition-all">
                  <Building2 className="h-4 w-4 text-primary" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 glass-strong">
                {organisations.map((org) => (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => setActiveOrgId(org.id)}
                    className={cn(
                      "cursor-pointer rounded-lg",
                      org.id === activeOrg?.id && "text-primary font-medium"
                    )}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    {org.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      <Separator className="mx-3 bg-sidebar-border opacity-50" />

      {/* Navigation */}
      <div className="px-3 pt-5 pb-2">
        {!collapsed && (
          <p className="mb-2.5 px-2 section-label text-sidebar-muted">Menu</p>
        )}
        <div className="space-y-1">
          <SidebarButton icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} active />
          <SidebarButton icon={List} label="All Subscriptions" collapsed={collapsed} />
        </div>
      </div>

      {/* Add button */}
      <div className="mt-auto px-3 pb-5">
        <Button
          onClick={onAddClick}
          className={cn(
            "w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-sm rounded-xl h-10 font-medium transition-all duration-200",
            collapsed && "px-0"
          )}
        >
          <Plus className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Add Subscription</span>}
        </Button>
      </div>
    </aside>
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
        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200",
        active
          ? "bg-primary/10 text-primary font-medium shadow-sm"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        collapsed && "justify-center px-0"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </button>
  );
}
