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
