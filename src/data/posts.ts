import type { Post } from "@/types/social";

export const initialPosts: Post[] = [
  {
    id: "post_1",
    author: "Iris Spirit",
    image: "https://storage.googleapis.com/maker-studio-project-media-prod/1043428a-723a-4467-b50a-9042a9261b58/images/a590748b-3027-4c4f-9e73-b79e7e59e933.png",
    caption: "Strolling through the gardens of Versailles today. Hope is a beautiful thing, isn't it? ✨",
    likes: 125,
    comments: [
      { id: "c1", author: "Sakura Spirit", text: "So elegant!", timestamp: new Date().toISOString() },
      { id: "c2", author: "Rose Spirit", text: "Beautiful!", timestamp: new Date().toISOString() },
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "post_2",
    author: "Tulip Spirit",
    image: "https://storage.googleapis.com/maker-studio-project-media-prod/1043428a-723a-4467-b50a-9042a9261b58/images/5aa00a6e-355b-4303-a128-48b29d4d2d46.png",
    caption: "Feeling the sincerity of the Dutch fields. Is love in the air?",
    likes: 230,
    comments: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];
