import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { Flower } from "@/types/flower";

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY が設定されていません");
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateCharacterProfile(
  flower: Flower,
  userPrompt: string,
): Promise<{ name: string; description: string }> {
  const ai = getClient();
  const model = process.env.GEMINI_TEXT_MODEL ?? "gemini-2.5-flash";

  const prompt = `
    You are creating a detailed character profile for a "Flower Spirit".
    This spirit is a magical transformation of a real person from an image provided by the user.
    The spirit should embody the flower's cultural significance and personality traits, while also reflecting the essence of the original person. The user has provided additional creative direction.

    **Flower Details:**
    - Name: ${flower.name}
    - Associated Country: ${flower.country}
    - Flower Language (Symbolism): ${flower.language}
    - Core Personality: ${flower.personality}

    **User's Creative Direction:**
    "${userPrompt || "No specific direction provided, use your creativity."}"

    Generate a response in JSON format. The JSON object should contain:
    1. "name": A fitting and imaginative name for the character (e.g., "Sakura no Hime," "Iris de Lumière").
    2. "description": A rich, 2-3 paragraph description of the character. Describe their appearance (blending original features with flower motifs), personality, powers, and a short backstory related to their flower, culture, and their transformation. The tone should be fantastical and romantic.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["name", "description"],
      },
    },
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error("AI からテキスト応答がありませんでした");
  }

  try {
    return JSON.parse(text) as { name: string; description: string };
  } catch {
    throw new Error("AI 応答の解析に失敗しました");
  }
}

export async function generateCharacterImageBytes(
  name: string,
  description: string,
  flowerName: string,
  base64ImageData: string,
  mimeType: string,
): Promise<string> {
  const ai = getClient();
  const model = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image";

  const textPrompt = `
    Transform the person in the provided image into an anime-style "Flower Spirit" character.
    The spirit's theme is the ${flowerName}.

    **Character Name:** ${name}
    **Character Description:** ${description}

    **Transformation Instructions:**
    - Infuse the character with the essence of the ${flowerName}. This could be through colors, patterns on clothing, accessories, or a magical aura.
    - Retain the core facial features and hairstyle of the person in the original image, but adapt them to a romantic and fantastical anime art style.
    - The final image should be a high-quality, full-body portrait.
    - Place the character in a soft, magical background that complements their flower origin.
    - The lighting should be ethereal and glowing.
    - The overall mood must be whimsical and enchanting.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { data: base64ImageData, mimeType } },
        { text: textPrompt },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.mimeType?.startsWith("image/") && part.inlineData.data) {
      return part.inlineData.data;
    }
  }

  throw new Error("画像生成に失敗しました。AI から画像が返されませんでした");
}
