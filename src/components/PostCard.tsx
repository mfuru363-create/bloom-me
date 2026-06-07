"use client";

import { useState } from "react";
import type { Post } from "@/types/social";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, commentText: string) => void;
}

export default function PostCard({ post, onLike, onComment }: PostCardProps) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 flex items-center space-x-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://picsum.photos/seed/${post.author}/40`}
          alt={post.author}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-800">{post.author}</p>
          <p className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleString("ja-JP")}</p>
        </div>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={post.image} alt="Post" className="w-full h-auto object-contain bg-gray-100" />

      <div className="p-4">
        <p className="text-gray-700 mb-3">{post.caption}</p>
        <div className="flex items-center space-x-4 text-gray-500">
          <button
            onClick={() => onLike(post.id)}
            className="flex items-center space-x-1 group min-h-[44px] px-2"
          >
            <span className="text-2xl group-hover:text-red-500 transition-colors">❤️</span>
            <span className="group-hover:text-red-500">{post.likes}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 group min-h-[44px] px-2"
          >
            <span className="text-2xl group-hover:text-blue-500 transition-colors">💬</span>
            <span className="group-hover:text-blue-500">{post.comments.length}</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="p-4 border-t border-gray-100">
          <div className="space-y-2 mb-2 max-h-40 overflow-y-auto">
            {post.comments.map((comment) => (
              <div key={comment.id} className="text-sm bg-gray-50 p-2 rounded-md">
                <span className="font-semibold text-gray-700">{comment.author}: </span>
                <span className="text-gray-600">{comment.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-3 py-1.5 border border-gray-200 rounded-full text-sm focus:ring-pink-500 focus:border-pink-500 text-base"
            />
            <button type="submit" className="text-sm font-semibold text-pink-600 hover:text-pink-800 min-h-[44px] px-2">
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
