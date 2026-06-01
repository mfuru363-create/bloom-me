import type { AppTheme } from "@/types/app";

export const APP_NAME = "BLOOM Me";

export const BGM_URL = "/bgm/main-theme.mp3";

export const THEME_CONFIG: Record<
  AppTheme,
  {
    label: string;
    backgroundImage: string;
    accent: string;
    accentMuted: string;
    gradient: string;
  }
> = {
  female: {
    label: "女性",
    backgroundImage: "/images/female/floral.png",
    accent: "#e8a4c9",
    accentMuted: "#f5d6e8",
    gradient: "from-rose-100/90 via-pink-50/85 to-violet-100/90",
  },
  male: {
    label: "男性",
    backgroundImage: "/images/female/hero.jpg",
    accent: "#7eb8da",
    accentMuted: "#c5e4f5",
    gradient: "from-sky-100/90 via-blue-50/85 to-indigo-100/90",
  },
};
