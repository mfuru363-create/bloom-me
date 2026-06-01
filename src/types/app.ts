export type AppTheme = "female" | "male";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type HomeEnterPayload = {
  userName: string;
  gender: AppTheme;
};
