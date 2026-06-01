import { NextRequest, NextResponse } from "next/server";
import { generateCharacterImageBytes } from "@/lib/gemini-server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      description?: string;
      flowerName?: string;
      base64ImageData?: string;
      mimeType?: string;
    };

    const { name, description, flowerName, base64ImageData, mimeType } = body;
    if (!name || !description || !flowerName || !base64ImageData || !mimeType) {
      return NextResponse.json({ error: "必須パラメータが不足しています" }, { status: 400 });
    }

    const imageBytes = await generateCharacterImageBytes(
      name,
      description,
      flowerName,
      base64ImageData,
      mimeType,
    );

    return NextResponse.json({ imageBase64: imageBytes });
  } catch (error) {
    const message = error instanceof Error ? error.message : "画像生成に失敗しました";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
