export type AppTheme = "female" | "male";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type HomeEnterPayload = {
  gender: AppTheme;
  /** 将来用。今回のUIでは未使用 */
  userName?: string;
};
