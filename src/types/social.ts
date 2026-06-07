export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  author: string;
  image: string;
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "spirit";
  text: string;
  translation?: string;
  educationalNote?: Record<string, string>;
}
