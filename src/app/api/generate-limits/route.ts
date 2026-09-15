import { NextResponse } from "next/server";
import { getGenerationLimits } from "@/lib/rate-limit";

export async function GET() {
  const limits = await getGenerationLimits();
  return NextResponse.json(limits);
}
