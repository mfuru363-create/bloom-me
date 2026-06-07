import { NextRequest, NextResponse } from "next/server";
import { generateCharacterProfile } from "@/lib/gemini-server";
import type { LegacyFlower as Flower } from "@/types/flower";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      flower?: Flower;
      userPrompt?: string;
    };

    if (!body.flower?.name) {
      return NextResponse.json({ error: "flower が必要です" }, { status: 400 });
    }

    const result = await generateCharacterProfile(
      body.flower,
      body.userPrompt ?? "",
    );
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "生成に失敗しました";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
