"use client";

import type { Post } from "@/types/social";
import PostCard from "@/components/PostCard";

interface FeedScreenProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

export default function FeedScreen({ posts, setPosts }: FeedScreenProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-700 mb-6">
        Community Feed
      </h2>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={(postId) => {
            setPosts((prev) =>
              prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
            );
          }}
          onComment={(postId, commentText) => {
            const newComment = {
              id: `comment_${Date.now()}`,
              author: "You",
              text: commentText,
              timestamp: new Date().toISOString(),
            };
            setPosts((prev) =>
              prev.map((p) =>
                p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
              )
            );
          }}
        />
      ))}
      {posts.length === 0 && (
        <div className="text-center text-gray-500 py-16">
          <p className="text-5xl mb-4">🌿</p>
          <p className="text-lg">The feed is quiet...</p>
          <p>Generate a spirit and post it to start the community!</p>
        </div>
      )}
    </div>
  );
}
