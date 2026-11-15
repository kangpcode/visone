export type SupportedLocale = "id" | "en";

export const MESSAGES: Record<
  SupportedLocale,
  {
    tagline: string;
    nav: {
      dashboard: string;
      templates: string;
      deployments: string;
      settings: string;
    };
    status: {
      phase0Ready: string;
      healthy: string;
    };
  }
> = {
  id: {
    tagline: "Design. Share. Deploy. — All in one.",
    nav: {
      dashboard: "Dasbor",
      templates: "Templat",
      deployments: "Deployment",
      settings: "Pengaturan",
    },
    status: {
      phase0Ready: "Fase 0: Pondasi Arsitektur & Skema Aktif",
      healthy: "Sistem berjalan normal",
    },
  },
  en: {
    tagline: "Design. Share. Deploy. — All in one.",
    nav: {
      dashboard: "Dashboard",
      templates: "Templates",
      deployments: "Deployments",
      settings: "Settings",
    },
    status: {
      phase0Ready: "Phase 0: Architecture & Schema Foundation Active",
      healthy: "All systems operational",
    },
  },
};

export function getMessages(locale: SupportedLocale = "id") {
  return MESSAGES[locale] ?? MESSAGES.id;
}
