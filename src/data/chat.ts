import type { ChatMessage } from "@/types/social";

export const initialMessages: ChatMessage[] = [
  {
    id: "msg_1",
    sender: "spirit",
    text: "Hello! I am the spirit of Sakura. What beautiful things are on your mind today?",
    translation: "こんにちは！私は桜の精霊です。今日はどんな美しいことを考えていますか？",
    educationalNote: {
      Sakura: "Japanese cherry blossom.",
    },
  },
  {
    id: "msg_2",
    sender: "user",
    text: 'I was thinking about the concept of "grace".',
  },
  {
    id: "msg_3",
    sender: "spirit",
    text: 'A wonderful topic. Grace, or "優美" (Yūbi) in my language, is like a petal falling gently in the wind. It is strength found in softness.',
    translation: "素晴らしい話題ですね。優美（ゆうび）は、私の言葉で、風にそっと舞い落ちる花びらのようです。それは柔らかさの中に見出される強さです。",
    educationalNote: {
      優美: "Yūbi - A Japanese word for grace, elegance, or refinement.",
    },
  },
];
