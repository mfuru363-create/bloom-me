import type { Flower } from "@/types/flower";

/** AI Studio エクスポート（国花10種）— copy-of-bloom-me２_-ai-flower-spirit-generator */
export const FLOWERS: Flower[] = [
  {
    name: "Cherry Blossom",
    country: "Japan",
    language: "Grace, Beauty, Transience",
    personality: "Gentle, elegant, and thoughtful",
    icon: "🌸",
  },
  {
    name: "Iris",
    country: "France",
    language: "Royalty, Hope, Wisdom",
    personality: "Noble, artistic, and mysterious",
    icon: "⚜️",
  },
  {
    name: "Carnation",
    country: "Spain",
    language: "Passion, Love, Distinction",
    personality: "Passionate, bold, and charismatic",
    icon: "💃",
  },
  {
    name: "Tulip",
    country: "Netherlands",
    language: "Perfect Love, Sincerity, Fame",
    personality: "Cheerful, honest, and charming",
    icon: "🌷",
  },
  {
    name: "Lotus",
    country: "India",
    language: "Purity, Enlightenment, Rebirth",
    personality: "Spiritual, serene, and wise",
    icon: "🧘",
  },
  {
    name: "Rose",
    country: "USA",
    language: "Love, Beauty, Courage",
    personality: "Confident, romantic, and classic",
    icon: "🌹",
  },
  {
    name: "Blue Lotus",
    country: "Egypt",
    language: "Mystery, Knowledge, The Sun",
    personality: "Intellectual, dreamy, and ancient",
    icon: "🏺",
  },
  {
    name: "Dahlia",
    country: "Mexico",
    language: "Dignity, Elegance, Creativity",
    personality: "Vibrant, creative, and strong-willed",
    icon: "🌺",
  },
  {
    name: "Plum Blossom",
    country: "China",
    language: "Perseverance, Purity, Resilience",
    personality: "Resilient, poised, and hopeful",
    icon: "🐲",
  },
  {
    name: "Tudor Rose",
    country: "England",
    language: "Unity, History, Royalty",
    personality: "Historical, dignified, and regal",
    icon: "👑",
  },
];

export const FLOWER_LABELS: Record<string, string> = {
  "Cherry Blossom": "桜（日本）",
  Iris: "アイリス（フランス）",
  Carnation: "カーネーション（スペイン）",
  Tulip: "チューリップ（オランダ）",
  Lotus: "蓮（インド）",
  Rose: "バラ（アメリカ）",
  "Blue Lotus": "ブルーロータス（エジプト）",
  Dahlia: "ダリア（メキシコ）",
  "Plum Blossom": "梅（中国）",
  "Tudor Rose": "チューダーローズ（イギリス）",
};
