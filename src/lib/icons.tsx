import React from "react";
import {
  Tv, Music, Film, Gamepad2, MonitorPlay,
  Cloud, Server, Globe, HardDrive, Database,
  Mail, MessageSquare, Phone, Video,
  CreditCard, Landmark, Receipt,
  Code, GitBranch, Terminal, Boxes,
  FileText, Briefcase, Building2, Stamp,
  Wrench, ShieldCheck, Zap,
  type LucideIcon,
} from "lucide-react";

// Additional icons for auth providers
export const Icons: {
  google: React.FC<React.ComponentProps<"svg">>;
  discord: React.FC<React.ComponentProps<"svg">>;
} = {
  google: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  ),
  discord: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
};

type IconEntry = {
  icon: LucideIcon;
  bg: string;
  fg: string;
};

const iconMap: Record<string, IconEntry> = {
  // Entertainment
  netflix:     { icon: MonitorPlay, bg: "bg-red-500/15",     fg: "text-red-600" },
  youtube:     { icon: Film,        bg: "bg-red-500/15",     fg: "text-red-500" },
  spotify:     { icon: Music,       bg: "bg-green-500/15",   fg: "text-green-600" },
  "apple music": { icon: Music,     bg: "bg-pink-500/15",    fg: "text-pink-600" },
  "disney+":   { icon: Tv,          bg: "bg-blue-500/15",    fg: "text-blue-600" },
  "disney plus": { icon: Tv,        bg: "bg-blue-500/15",    fg: "text-blue-600" },
  "hbo max":   { icon: Tv,          bg: "bg-purple-500/15",  fg: "text-purple-600" },
  "prime video": { icon: MonitorPlay, bg: "bg-blue-400/15",  fg: "text-blue-500" },
  twitch:      { icon: Gamepad2,    bg: "bg-purple-500/15",  fg: "text-purple-600" },
  "xbox game pass": { icon: Gamepad2, bg: "bg-green-600/15", fg: "text-green-700" },

  // Hosting / Infra
  hetzner:     { icon: Server,      bg: "bg-red-600/15",     fg: "text-red-700" },
  aws:         { icon: Cloud,       bg: "bg-amber-500/15",   fg: "text-amber-600" },
  "google cloud": { icon: Cloud,    bg: "bg-blue-500/15",    fg: "text-blue-600" },
  azure:       { icon: Cloud,       bg: "bg-sky-500/15",     fg: "text-sky-600" },
  digitalocean: { icon: HardDrive,  bg: "bg-blue-500/15",    fg: "text-blue-600" },
  vercel:      { icon: Globe,       bg: "bg-foreground/10",  fg: "text-foreground" },
  netlify:     { icon: Globe,       bg: "bg-teal-500/15",    fg: "text-teal-600" },
  cloudflare:  { icon: ShieldCheck, bg: "bg-orange-500/15",  fg: "text-orange-600" },
  supabase:    { icon: Database,    bg: "bg-emerald-500/15", fg: "text-emerald-600" },

  // Communication
  slack:       { icon: MessageSquare, bg: "bg-purple-500/15", fg: "text-purple-600" },
  zoom:        { icon: Video,       bg: "bg-blue-500/15",    fg: "text-blue-600" },
  "microsoft teams": { icon: Video, bg: "bg-indigo-500/15",  fg: "text-indigo-600" },
  "google workspace": { icon: Mail, bg: "bg-blue-500/15",    fg: "text-blue-600" },

  // Development
  github:      { icon: GitBranch,   bg: "bg-foreground/10",  fg: "text-foreground" },
  gitlab:      { icon: GitBranch,   bg: "bg-orange-500/15",  fg: "text-orange-600" },
  jetbrains:   { icon: Code,        bg: "bg-pink-500/15",    fg: "text-pink-600" },
  figma:       { icon: Boxes,       bg: "bg-purple-500/15",  fg: "text-purple-600" },
  "docker hub": { icon: Terminal,   bg: "bg-blue-500/15",    fg: "text-blue-600" },

  // Business / Finance
  "kvk inschrijving": { icon: Stamp, bg: "bg-amber-500/15",  fg: "text-amber-700" },
  kvk:         { icon: Stamp,       bg: "bg-amber-500/15",   fg: "text-amber-700" },
  quickbooks:  { icon: Receipt,     bg: "bg-green-500/15",   fg: "text-green-600" },
  stripe:      { icon: CreditCard,  bg: "bg-indigo-500/15",  fg: "text-indigo-600" },
  mollie:      { icon: CreditCard,  bg: "bg-black/10",       fg: "text-foreground" },

  // Productivity
  notion:      { icon: FileText,    bg: "bg-foreground/10",  fg: "text-foreground" },
  linear:      { icon: Zap,         bg: "bg-indigo-500/15",  fg: "text-indigo-600" },
  "1password": { icon: ShieldCheck, bg: "bg-blue-500/15",    fg: "text-blue-600" },
  lastpass:    { icon: ShieldCheck, bg: "bg-red-500/15",     fg: "text-red-600" },

  // Insurance / NL specifics
  "kamer van koophandel": { icon: Building2, bg: "bg-amber-500/15", fg: "text-amber-700" },
};

const categoryFallback: Record<string, IconEntry> = {
  entertainment:  { icon: Tv,          bg: "bg-purple-500/15",  fg: "text-purple-600" },
  productivity:   { icon: Wrench,      bg: "bg-blue-500/15",    fg: "text-blue-600" },
  hosting:        { icon: Server,      bg: "bg-sky-500/15",     fg: "text-sky-600" },
  business:       { icon: Briefcase,   bg: "bg-amber-500/15",   fg: "text-amber-600" },
  finance:        { icon: Landmark,    bg: "bg-green-500/15",   fg: "text-green-600" },
  communication:  { icon: Phone,       bg: "bg-indigo-500/15",  fg: "text-indigo-600" },
  development:    { icon: Code,        bg: "bg-pink-500/15",    fg: "text-pink-600" },
  other:          { icon: Zap,         bg: "bg-muted",          fg: "text-muted-foreground" },
};

export function getSubscriptionIcon(name: string, category?: string): IconEntry {
  const key = name.toLowerCase().trim();
  if (iconMap[key]) return iconMap[key];

  // partial match
  for (const [k, v] of Object.entries(iconMap)) {
    if (key.includes(k) || k.includes(key)) return v;
  }

  if (category && categoryFallback[category]) return categoryFallback[category];
  return categoryFallback.other;
}
