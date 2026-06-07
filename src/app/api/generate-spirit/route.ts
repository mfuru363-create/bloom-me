import { GoogleGenAI, SubjectReferenceImage, SubjectReferenceType } from "@google/genai";
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
  return `
A "Flower Spirit" character from a specific historical era.
- National Spirit: ${params.flower} (${params.country})
- Hanakotoba (Spirit's Essence): "${params.hanakotoba}"
- Character Personality: ${personalityString}
- Clothing & Outfit: ${params.outfit}
- Background Environment: ${params.background}
- Lighting & Color: ${params.color_tone}
- Style: ${params.quality === "high" ? "ultra-realistic photography, 8k, historically accurate, cinematic" : "beautiful fantasy illustration, artistic"}
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
    const prompt = buildPrompt({ flower, country, hanakotoba, personality, outfit, background, color_tone, userImage, quality });

    let imageBytes: string | undefined;

    if (userImage) {
      // 顔参照あり: editImage で人物変換
      const subjectRef = new SubjectReferenceImage();
      subjectRef.referenceImage = { imageBytes: userImage.data };
      subjectRef.referenceId = 1;
      subjectRef.config = { subjectType: SubjectReferenceType.SUBJECT_TYPE_PERSON };

      const editModel = process.env.GEMINI_EDIT_MODEL ?? "imagen-3.0-capability-001";
      const response = await ai.models.editImage({
        model: editModel,
        prompt,
        referenceImages: [subjectRef],
        config: { numberOfImages: 1, aspectRatio: "1:1" },
      });
      imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    } else {
      // 顔参照なし: generateImages でテキスト→画像
      const genModel = process.env.GEMINI_IMAGE_MODEL ?? "imagen-3.0-generate-002";
      const response = await ai.models.generateImages({
        model: genModel,
        prompt,
        config: { numberOfImages: 1, aspectRatio: "1:1" },
      });
      imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    }

    if (!imageBytes) {
      return NextResponse.json({ error: "AIから画像が返されませんでした" }, { status: 502 });
    }

    return NextResponse.json({ imageBase64: imageBytes });
  } catch (error) {
    const message = error instanceof Error ? error.message : "画像生成に失敗しました";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
