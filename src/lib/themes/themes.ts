export const DEFAULT_THEME = {
  preset: "default",
  radius: "default",
  scale: "none",
  contentLayout: "full"
} as const;

export type ThemeType = typeof DEFAULT_THEME;

export const THEMES = [
  {
    name: "Default",
    value: "default",
    colors: ["oklch(0.33 0 0)"]
  },
  {
    name: "Neo Brutalism",
    value: "neo-brutalism",
    colors: ["oklch(0.82 0.22 95)"]
  },
  {
    name: "Rose Garden",
    value: "rose-garden",
    colors: ["oklch(0.5827 0.2418 12.23)"]
  },
  {
    name: "Supabase",
    value: "supabase",
    colors: ["oklch(0.706 0.165 155)"]
  },
  {
    name: "Sunset Glow",
    value: "sunset-glow",
    colors: ["oklch(0.5827 0.2187 36.98)"]
  },
  {
    name: "Forest Whisper",
    value: "forest-whisper",
    colors: ["oklch(0.5276 0.1072 182.22)"]
  },
  {
    name: "Ocean Breeze",
    value: "ocean-breeze",
    colors: ["oklch(0.59 0.20 277.12)"]
  },
  {
    name: "Twitter",
    value: "twitter",
    colors: ["oklch(0.694 0.168 230)"]
  }
];