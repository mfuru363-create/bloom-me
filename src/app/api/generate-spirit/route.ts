import { GoogleGenAI, Modality } from "@google/genai";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE_HIGH_USED,
  COOKIE_LAST_GEN,
  checkCooldown,
  isHighQualityAvailable,
  setGenerationCookies,
} from "@/lib/rate-limit";

interface GenerationParams {
  flower: string;
  country: string;
  hanakotoba: string;
  personality: string[];
  outfit: string;
  background: string;
  color_tone: string;
  userImage?: { mimeType: string; data: string } | null;
  quality: "standard" | "high";
  gender: "female" | "male";
}

function buildPrompt(params: GenerationParams): string {
  const personalityString = params.personality.join(", ");
  const styleHint =
    params.quality === "high"
      ? "ultra-realistic photography, 8k, historically accurate, cinematic"
      : "beautiful fantasy illustration, artistic";
  const genderHint =
    params.gender === "male"
      ? "Portray a masculine male Flower Spirit (adult man)."
      : "Portray a feminine female Flower Spirit (adult woman).";
  return `
Transform${params.userImage ? " the person in the provided photo into" : ""} a "Flower Spirit" character from a specific historical era.
- ${genderHint}
- National Spirit: ${params.flower} (${params.country})
- Hanakotoba (Spirit's Essence): "${params.hanakotoba}"
- Character Personality: ${personalityString}
- Clothing & Outfit: ${params.outfit}
- Background Environment: ${params.background}
- Lighting & Color: ${params.color_tone}
- Style: ${styleHint}
- No nudity or inappropriate content. Portrait or full-body composition.
  `.trim();
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY が設定されていません" }, { status: 500 });
  }

  try {
    const body = (await request.json()) as GenerationParams;
    const {
      flower,
      country,
      hanakotoba,
      personality,
      outfit,
      background,
      color_tone,
      userImage,
      quality,
      gender,
    } = body;

    if (!flower || !country) {
      return NextResponse.json({ error: "flower と country は必須です" }, { status: 400 });
    }

    if (gender !== "female" && gender !== "male") {
      return NextResponse.json({ error: "gender は female または male が必須です" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const lastGen = cookieStore.get(COOKIE_LAST_GEN)?.value;
    const lastGenTs = lastGen ? parseInt(lastGen, 10) : 0;
    const cooldown = checkCooldown(lastGenTs);
    if (!cooldown.ok) {
      return NextResponse.json(
        {
          error: `生成は ${cooldown.retryAfter} 秒後に再度お試しください`,
          retryAfter: cooldown.retryAfter,
        },
        { status: 429 },
      );
    }

    if (quality === "high") {
      const highUsed = cookieStore.get(COOKIE_HIGH_USED)?.value;
      if (!isHighQualityAvailable(highUsed)) {
        return NextResponse.json(
          {
            error: "高品質モードは1日1回までです。Standard をお試しください。",
            highQualityAvailable: false,
          },
          { status: 429 },
        );
      }
    }

    const ai = new GoogleGenAI({ apiKey });

    const standardModel = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image";
    const highModel = process.env.GEMINI_IMAGE_QUALITY_MODEL ?? "gemini-3-pro-image-preview";
    const model = quality === "high" ? highModel : standardModel;

    const prompt = buildPrompt({
      flower,
      country,
      hanakotoba,
      personality,
      outfit,
      background,
      color_tone,
      userImage,
      quality,
      gender,
    });

    const parts: { text?: string; inlineData?: { data: string; mimeType: string } }[] = [];

    if (userImage) {
      parts.push({ inlineData: { data: userImage.data, mimeType: userImage.mimeType } });
    }
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const responseParts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of responseParts) {
      if (part.inlineData?.mimeType?.startsWith("image/") && part.inlineData.data) {
        const jsonResponse = NextResponse.json({ imageBase64: part.inlineData.data });
        return setGenerationCookies(jsonResponse, quality);
      }
    }

    return NextResponse.json({ error: "AIから画像が返されませんでした" }, { status: 502 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "画像生成に失敗しました";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
