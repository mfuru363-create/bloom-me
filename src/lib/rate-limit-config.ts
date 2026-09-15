/** 連続生成の最小間隔（秒） */
export const GENERATION_COOLDOWN_SEC = 30;

/** 高品質モードの1日あたり上限 */
export const HIGH_QUALITY_DAILY_LIMIT = 1;

export const COOKIE_LAST_GEN = "bloom_last_gen";
export const COOKIE_HIGH_USED = "bloom_high_used";

export type GenerationLimits = {
  cooldownRemainingSec: number;
  highQualityAvailable: boolean;
  highQualityDailyLimit: number;
  cooldownSec: number;
};

export function getTodayKeyJST(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(new Date());
}

export function checkCooldown(lastGenTs: number): { ok: boolean; retryAfter: number } {
  const nowSec = Math.floor(Date.now() / 1000);
  const elapsed = nowSec - lastGenTs;
  if (elapsed < GENERATION_COOLDOWN_SEC) {
    return { ok: false, retryAfter: GENERATION_COOLDOWN_SEC - elapsed };
  }
  return { ok: true, retryAfter: 0 };
}

export function isHighQualityAvailable(highUsedDate: string | undefined): boolean {
  return highUsedDate !== getTodayKeyJST();
}
