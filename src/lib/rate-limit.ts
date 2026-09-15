import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import {
  COOKIE_HIGH_USED,
  COOKIE_LAST_GEN,
  GENERATION_COOLDOWN_SEC,
  HIGH_QUALITY_DAILY_LIMIT,
  checkCooldown,
  getTodayKeyJST,
  isHighQualityAvailable,
  type GenerationLimits,
} from "@/lib/rate-limit-config";

export {
  COOKIE_HIGH_USED,
  COOKIE_LAST_GEN,
  GENERATION_COOLDOWN_SEC,
  HIGH_QUALITY_DAILY_LIMIT,
  checkCooldown,
  getTodayKeyJST,
  isHighQualityAvailable,
  type GenerationLimits,
};

const cookieBase = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
});

export async function getGenerationLimits(): Promise<GenerationLimits> {
  const cookieStore = await cookies();
  const lastGen = cookieStore.get(COOKIE_LAST_GEN)?.value;
  const highUsed = cookieStore.get(COOKIE_HIGH_USED)?.value;

  const lastGenTs = lastGen ? parseInt(lastGen, 10) : 0;
  const nowSec = Math.floor(Date.now() / 1000);
  const elapsed = nowSec - lastGenTs;
  const cooldownRemainingSec = Math.max(0, GENERATION_COOLDOWN_SEC - elapsed);

  return {
    cooldownRemainingSec,
    highQualityAvailable: isHighQualityAvailable(highUsed),
    highQualityDailyLimit: HIGH_QUALITY_DAILY_LIMIT,
    cooldownSec: GENERATION_COOLDOWN_SEC,
  };
}

export function setGenerationCookies(
  response: NextResponse,
  quality: "standard" | "high",
): NextResponse {
  const nowSec = Math.floor(Date.now() / 1000);

  response.cookies.set(COOKIE_LAST_GEN, String(nowSec), {
    ...cookieBase(),
    maxAge: GENERATION_COOLDOWN_SEC * 2,
  });

  if (quality === "high") {
    response.cookies.set(COOKIE_HIGH_USED, getTodayKeyJST(), {
      ...cookieBase(),
      maxAge: 60 * 60 * 24,
    });
  }

  return response;
}
