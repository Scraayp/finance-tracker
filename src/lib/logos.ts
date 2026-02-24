// Maps subscription names to their domain for logo fetching via Hunter.io Logo API
// API docs: https://hunter.io/api-documentation/v2#logos
// Usage: GET https://logos.hunter.io/{domain} — no auth required, returns image directly

const domainMap: Record<string, string> = {
  // Entertainment
  netflix: "netflix.com",
  youtube: "youtube.com",
  "youtube premium": "youtube.com",
  spotify: "spotify.com",
  "apple music": "apple.com",
  "disney+": "disneyplus.com",
  "disney plus": "disneyplus.com",
  "hbo max": "hbomax.com",
  "prime video": "primevideo.com",
  "amazon prime": "amazon.com",
  twitch: "twitch.tv",
  "xbox game pass": "xbox.com",

  // Hosting / Infra
  hetzner: "hetzner.com",
  aws: "aws.amazon.com",
  "amazon web services": "aws.amazon.com",
  "google cloud": "cloud.google.com",
  azure: "azure.microsoft.com",
  digitalocean: "digitalocean.com",
  vercel: "vercel.com",
  netlify: "netlify.com",
  cloudflare: "cloudflare.com",
  supabase: "supabase.com",
  render: "render.com",
  railway: "railway.app",
  fly: "fly.io",

  // Communication
  slack: "slack.com",
  zoom: "zoom.us",
  "microsoft teams": "microsoft.com",
  "google workspace": "google.com",
  discord: "discord.com",

  // Development
  github: "github.com",
  gitlab: "gitlab.com",
  jetbrains: "jetbrains.com",
  figma: "figma.com",
  "docker hub": "docker.com",
  docker: "docker.com",
  linear: "linear.app",
  jira: "atlassian.com",
  bitbucket: "bitbucket.org",

  // Business / Finance
  kvk: "kvk.nl",
  "kvk inschrijving": "kvk.nl",
  "kamer van koophandel": "kvk.nl",
  quickbooks: "quickbooks.intuit.com",
  stripe: "stripe.com",
  mollie: "mollie.com",

  // Productivity
  notion: "notion.so",
  "1password": "1password.com",
  lastpass: "lastpass.com",
  todoist: "todoist.com",
  trello: "trello.com",
  asana: "asana.com",
  dropbox: "dropbox.com",
  "google drive": "google.com",
  evernote: "evernote.com",
};

/**
 * Get the Hunter.io logo URL for a subscription.
 * Falls back to trying the publisher name as a domain.
 */
export function getLogoUrl(name: string, publisher?: string): string | null {
  const key = name.toLowerCase().trim();

  // Direct match
  if (domainMap[key]) {
    return `https://logos.hunter.io/${domainMap[key]}`;
  }

  // Partial match
  for (const [k, domain] of Object.entries(domainMap)) {
    if (key.includes(k) || k.includes(key)) {
      return `https://logos.hunter.io/${domain}`;
    }
  }

  // Try to extract domain from publisher
  if (publisher) {
    const pubKey = publisher.toLowerCase().trim();
    // Check if publisher itself maps
    for (const [k, domain] of Object.entries(domainMap)) {
      if (pubKey.includes(k)) {
        return `https://logos.hunter.io/${domain}`;
      }
    }
    // Try treating publisher as a potential domain-like string
    // e.g. "Hetzner Online GmbH" -> try "hetzner.com"
    const firstWord = pubKey.split(/\s+/)[0];
    if (firstWord && firstWord.length > 2) {
      return `https://logos.hunter.io/${firstWord}.com`;
    }
  }

  // Last resort: try name as domain
  const cleanName = key.replace(/[^a-z0-9]/g, "");
  if (cleanName.length > 2) {
    return `https://logos.hunter.io/${cleanName}.com`;
  }

  return null;
}
