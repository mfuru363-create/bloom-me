import { GoogleGenAI, Modality } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

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
}

function buildPrompt(params: GenerationParams): string {
  const personalityString = params.personality.join(", ");
  const styleHint =
    params.quality === "high"
      ? "ultra-realistic photography, 8k, historically accurate, cinematic"
      : "beautiful fantasy illustration, artistic";
  return `
Transform${params.userImage ? " the person in the provided photo into" : ""} a "Flower Spirit" character from a specific historical era.
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
    const { flower, country, hanakotoba, personality, outfit, background, color_tone, userImage, quality } = body;

    if (!flower || !country) {
      return NextResponse.json({ error: "flower と country は必須です" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const standardModel = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image";
    const highModel = process.env.GEMINI_IMAGE_QUALITY_MODEL ?? "gemini-3-pro-image-preview";
    const model = quality === "high" ? highModel : standardModel;

    const prompt = buildPrompt({ flower, country, hanakotoba, personality, outfit, background, color_tone, userImage, quality });

    const parts: { text?: string; inlineData?: { data: string; mimeType: string } }[] = [];

    if (userImage) {
      parts.push({ inlineData: { data: userImage.data, mimeType: userImage.mimeType } });
    }
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const responseParts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of responseParts) {
      if (part.inlineData?.mimeType?.startsWith("image/") && part.inlineData.data) {
        return NextResponse.json({ imageBase64: part.inlineData.data });
      }
    }

    return NextResponse.json({ error: "AIから画像が返されませんでした" }, { status: 502 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "画像生成に失敗しました";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
