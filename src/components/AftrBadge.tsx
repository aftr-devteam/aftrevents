// src/components/AftrBadge.tsx
// Reusable badge shown on profiles, cards, dashboards.
// Import anywhere: import { AftrBadge } from "@/components/AftrBadge";

import { useLang } from "@/lib/i18n";

export type BadgeType = "connector" | "builder" | "admin" | "founding";

const BADGE_CONFIG: Record<BadgeType, {
  icon: string;
  labelEn: string;
  labelEs: string;
  color: string;
  bg: string;
  border: string;
}> = {
  connector: {
    icon:    "🌿",
    labelEn: "Connector",
    labelEs: "Connector",
    color:   "#4b664a",
    bg:      "rgba(75,102,74,0.1)",
    border:  "rgba(75,102,74,0.25)",
  },
  builder: {
    icon:    "🔶",
    labelEn: "Builder",
    labelEs: "Builder",
    color:   "#b85c24",
    bg:      "rgba(184,92,36,0.1)",
    border:  "rgba(184,92,36,0.25)",
  },
  founding: {
    icon:    "⭐",
    labelEn: "Founding Builder",
    labelEs: "Builder Fundador",
    color:   "#b8860b",
    bg:      "rgba(255,194,74,0.15)",
    border:  "rgba(255,194,74,0.4)",
  },
  admin: {
    icon:    "⚡",
    labelEn: "Aftr Admin",
    labelEs: "Admin Aftr",
    color:   "#3f779d",
    bg:      "rgba(63,119,157,0.1)",
    border:  "rgba(63,119,157,0.25)",
  },
};

interface Props {
  type: BadgeType;
  size?: "xs" | "sm" | "md";
  showIcon?: boolean;
}

export function AftrBadge({ type, size = "sm", showIcon = true }: Props) {
  const { lang } = useLang();
  const c = BADGE_CONFIG[type];

  const sizeClass = {
    xs: "px-2 py-0.5 text-xs gap-1",
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3 py-1.5 text-sm gap-1.5",
  }[size];

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${sizeClass}`}
      style={{ color: c.color, background: c.bg, borderColor: c.border }}
    >
      {showIcon && <span>{c.icon}</span>}
      {lang === "en" ? c.labelEn : c.labelEs}
    </span>
  );
}

// Helper: derive badge types from a profile object
export function getBadgesForProfile(profile: {
  is_admin?: boolean;
  is_verified_organizer?: boolean;
  is_connector?: boolean;
  is_community_builder?: boolean;
  current_plan?: string;
}): BadgeType[] {
  const badges: BadgeType[] = [];
  if (profile.is_admin) badges.push("admin");
  if (profile.is_verified_organizer) {
    // Show "founding" badge if they're on the founding plan
    if (profile.current_plan === "founding") {
      badges.push("founding");
    } else {
      badges.push("builder");
    }
  }
  // is_connector OR is_community_builder (backward compat)
  if (profile.is_connector || profile.is_community_builder) badges.push("connector");
  return badges;
}
