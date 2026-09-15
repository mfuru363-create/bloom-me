import type { Flower } from "@/types/flower";

export const FLOWERS: Flower[] = [
  {
    id: "jp_sakura",
    country: "Japan",
    flower: "Sakura",
    hanakotoba: "優美・精神の美 (Grace, beauty of mind)",
    theme: "A bustling marketplace in Edo-period Tokyo at sunset, cinematic lighting, wooden stalls, paper lanterns",
    outfits: {
      female:
        "A young town girl (machimusume) in a soft silk kimono with delicate pale cherry blossom patterns, tied with a traditional brocade obi",
      male:
        "A young Edo-period townsman in an indigo silk kimono with subtle pale cherry blossom motifs, a dark haori coat, and wooden geta sandals",
    },
  },
  {
    id: "fr_iris",
    country: "France",
    flower: "Iris",
    hanakotoba: "高貴・希望 (Noble, hope)",
    theme: "The grand Hall of Mirrors in the 18th-century Palace of Versailles, Rococo architectural details, golden hour sunlight",
    outfits: {
      female:
        "An intricate 18th-century Rococo gown, layered silk, lace frills, powdered hair, and noble accessories",
      male:
        "An 18th-century French courtier in a richly embroidered silk justaucorps coat, lace cravat, powdered wig, and polished buckled shoes",
    },
  },
  {
    id: "es_carnation",
    country: "Spain",
    flower: "Carnation",
    hanakotoba: "情熱 (Passion)",
    theme: "A majestic 16th-century Spanish court courtyard at high noon, ornate stone arches, shadows of palm trees",
    outfits: {
      female:
        "A Spanish Golden Age noblewoman in a heavy black velvet dress with gold embroidery and a stiff farthingale",
      male:
        "A Spanish Golden Age nobleman in a black velvet doublet with gold embroidery, a short cape, and a refined ruff collar",
    },
  },
  {
    id: "nl_tulip",
    country: "Netherlands",
    flower: "Tulip",
    hanakotoba: "誠実・恋の予感 (Sincerity, premonition of love)",
    theme: "A 17th-century Dutch Golden Age canal street with cobblestones and brick facades, Vermeer-style lighting",
    outfits: {
      female:
        "A young Dutch woman in 17th-century attire with realistic linen textures and simple yet elegant wool garments",
      male:
        "A young Dutch merchant in 17th-century attire: dark wool coat, white collar, linen shirt, and simple elegant wool garments in Vermeer-style realism",
    },
  },
  {
    id: "kr_mugunghwa",
    country: "Korea",
    flower: "Mugunghwa",
    hanakotoba: "忍耐・信念 (Perseverance, belief)",
    theme: "A royal Joseon Dynasty palace pavilion surrounded by a calm pond and weeping willows",
    outfits: {
      female:
        "A noble lady in a crimson and gold silk jeogori, deep blue embroidered chima, swinging norigae ornaments, and an elegant binyeo hairpin",
      male:
        "A Joseon Dynasty yangban nobleman in a crimson and gold silk durumagi overcoat, white jeogori, and a traditional gat hat",
    },
  },
  {
    id: "us_rose",
    country: "USA",
    flower: "Rose",
    hanakotoba: "愛・勇気 (Love, courage)",
    theme: "A glamorous 1920s Gatsby-era ballroom with art deco geometry, champagne towers, and jazz atmosphere",
    outfits: {
      female:
        "A 1920s flapper in a shimmering sequined dress with pearl necklaces and a jeweled headpiece",
      male:
        "A 1920s gentleman in a classic black tuxedo with a white bow tie, slicked hair, and art deco cufflinks",
    },
  },
  {
    id: "it_violet",
    country: "Italy",
    flower: "Violet",
    hanakotoba: "謙虚・誠意 (Humility, sincerity)",
    theme: "A 15th-century Renaissance Florence villa terrace overlooking the Arno river, warm tuscan sun",
    outfits: {
      female:
        "A Renaissance noblewoman in a heavy brocade dress with slashed sleeves and a pearl-encrusted bodice, capturing the era of Leonardo",
      male:
        "A Renaissance Florentine nobleman in a velvet doublet with slashed sleeves, a richly patterned cloak, and a soft biretta cap",
    },
  },
  {
    id: "br_ipe",
    country: "Brazil",
    flower: "Ipê (Tabebuia)",
    hanakotoba: "豊かさ・生命力 (Abundance, life force)",
    theme: "A 19th-century Imperial Brazil plaza in Rio de Janeiro, colonial architecture mixed with tropical palms",
    outfits: {
      female:
        "A high-society lady in a 19th-century silk gown with lace parasol, embodying the elegance of the Brazilian Empire",
      male:
        "A 19th-century Brazilian Empire gentleman in a tailored frock coat, waistcoat, cravat, and polished boots under tropical sunlight",
    },
  },
  {
    id: "gb_tudor_rose",
    country: "United Kingdom",
    flower: "Tudor Rose",
    hanakotoba: "調和・誇り (Harmony, pride)",
    theme: "A manicured 16th-century Tudor knot garden with red and white roses, ancient stone castle walls",
    outfits: {
      female:
        "A Queen Elizabeth I style court dress, massive ruff collar, pearls, and a bodice stiffened with stays, very regal",
      male:
        "A Tudor court nobleman in a richly embroidered doublet, padded hose, a short cloak, and a gold chain of office",
    },
  },
  {
    id: "th_ratchaphruek",
    country: "Thailand",
    flower: "Ratchaphruek",
    hanakotoba: "友情・繁栄 (Friendship, prosperity)",
    theme: "The 17th-century Ayutthaya Kingdom royal court, golden spires and statues in the background",
    outfits: {
      female:
        "Traditional Thai royal attire (Chut Thai), golden silk sabai shawl, ornate gold jewelry, and intricate embroidery",
      male:
        "Traditional Thai royal male court attire with golden silk, ornate embroidery, a sash, and ceremonial gold jewelry of the Ayutthaya court",
    },
  },
];

export const FLOWER_LABELS: Record<string, string> = {
  jp_sakura: "🌸 桜（日本）",
  fr_iris: "⚜️ アイリス（フランス）",
  es_carnation: "🌹 カーネーション（スペイン）",
  nl_tulip: "🌷 チューリップ（オランダ）",
  kr_mugunghwa: "🌺 無窮花（韓国）",
  us_rose: "🌹 バラ（アメリカ）",
  it_violet: "💜 スミレ（イタリア）",
  br_ipe: "🌼 イペー（ブラジル）",
  gb_tudor_rose: "👑 チューダーローズ（英国）",
  th_ratchaphruek: "🌟 ラチャプルック（タイ）",
};
