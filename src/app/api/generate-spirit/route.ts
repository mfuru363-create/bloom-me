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
  const userImageInstruction = params.userImage
    ? `- User Face Reference: Provided. Please subtly map the facial structure and features of the person in the image onto the character. Maintain the historical look while making the character feel like a realistic reincarnation of the person.`
    : `- Original Character: Generate a unique, period-accurate face that reflects the character's background.`;

  const styleInstruction =
    params.quality === "high"
      ? "ultra-realistic photography, high-end cinema shot, 8k resolution, authentic historical textures (silk, velvet, stone, wood), shallow depth of field, masterful lighting, historically accurate in every detail"
      : "fantasy art style";

  return `
You are a world-class historical image generator.
Task: Create a highly detailed image of a "Flower Spirit" who has taken human form during a specific historical era.

[HISTORICAL SETTING & CONTEXT]
- National Spirit: ${params.flower} (${params.country})
- Historical Era Context: The golden age or significant historical period associated with ${params.country}.
- Hanakotoba (Spirit's Essence): "${params.hanakotoba}"
- Character Personality: ${personalityString}

[VISUAL DETAILS]
- Clothing & Outfit: ${params.outfit}. Focus on authentic materials and period-appropriate tailoring.
- Background Environment: ${params.background}. Ensure architecture and surroundings match the historical era precisely.
- Lighting & Color: ${params.color_tone}. Use lighting to create a cinematic, dramatic atmosphere.

[STYLE SPECIFICATION]
- Primary Style: ${styleInstruction}
${userImageInstruction}

[CONSTRAINTS]
- For high quality: The image must look like a real photograph from a film set.
- For standard: Maintain a beautiful, artistic fantasy illustration style.
- The character should embody the flower's traits through their attire and demeanor.
- No nudity or inappropriate content.
- Portrait or full-body composition based on the scene's requirement for cinematic impact.
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
    const model = quality === "high"
      ? (process.env.GEMINI_HIGH_QUALITY_MODEL ?? process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.0-flash-exp")
      : (process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.0-flash-exp");

    const prompt = buildPrompt({ flower, country, hanakotoba, personality, outfit, background, color_tone, userImage, quality });

    const contentParts: { text?: string; inlineData?: { mimeType: string; data: string } }[] = [];
    if (userImage) {
      contentParts.push({ inlineData: { mimeType: userImage.mimeType, data: userImage.data } });
    }
    contentParts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model,
      contents: { parts: contentParts },
      config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
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
