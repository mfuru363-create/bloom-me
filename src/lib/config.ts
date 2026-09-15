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

/** Tailwind クラス（female=pink / male=sky） */
export const THEME_UI: Record<
  AppTheme,
  {
    shellBg: string;
    title: string;
    linkHover: string;
    focusRing: string;
    qualityActive: string;
    submitButton: string;
    flowerSelected: string;
    flowerIdle: string;
    uploader: string;
    uploaderDragging: string;
    spinner: string;
  }
> = {
  female: {
    shellBg: "bg-gradient-to-br from-pink-100 via-rose-50 to-teal-100",
    title: "text-pink-700",
    linkHover: "hover:text-pink-600",
    focusRing: "focus:ring-pink-500 focus:border-pink-500",
    qualityActive: "bg-white text-pink-600 shadow-sm",
    submitButton:
      "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 focus:ring-rose-500",
    flowerSelected: "border-pink-400 bg-pink-50 shadow-lg shadow-pink-200",
    flowerIdle: "border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50/50",
    uploader:
      "cursor-pointer border-pink-200 bg-white/50 text-gray-500 hover:border-pink-400 hover:bg-pink-50/50",
    uploaderDragging: "border-pink-400 bg-pink-50/50 ring-4 ring-pink-500/20",
    spinner: "text-pink-600",
  },
  male: {
    shellBg: "bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100",
    title: "text-sky-700",
    linkHover: "hover:text-sky-600",
    focusRing: "focus:ring-sky-500 focus:border-sky-500",
    qualityActive: "bg-white text-sky-600 shadow-sm",
    submitButton:
      "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 focus:ring-sky-500",
    flowerSelected: "border-sky-400 bg-sky-50 shadow-lg shadow-sky-200",
    flowerIdle: "border-gray-200 bg-white hover:border-sky-300 hover:bg-sky-50/50",
    uploader:
      "cursor-pointer border-sky-200 bg-white/50 text-gray-500 hover:border-sky-400 hover:bg-sky-50/50",
    uploaderDragging: "border-sky-400 bg-sky-50/50 ring-4 ring-sky-500/20",
    spinner: "text-sky-600",
  },
};
