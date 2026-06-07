"use client";

import { useCallback, useState } from "react";
import type { Post } from "@/types/social";
import { initialPosts } from "@/data/posts";
import HomeScreen from "@/screens/HomeScreen";
import GeneratorScreen from "@/screens/GeneratorScreen";
import FeedScreen from "@/screens/FeedScreen";
import ChatScreen from "@/screens/ChatScreen";

type Screen = "home" | "generator" | "feed" | "chat";

const NAV_ITEMS: { screen: Exclude<Screen, "home">; label: string; icon: string }[] = [
  { screen: "generator", label: "Generator", icon: "✨" },
  { screen: "feed", label: "Feed", icon: "🌍" },
  { screen: "chat", label: "Chat", icon: "💬" },
];

export function BloomMeApp() {
  const [activeScreen, setActiveScreen] = useState<Screen>("home");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newlyGeneratedImage, setNewlyGeneratedImage] = useState<string | null>(null);

  const handleImageGenerated = useCallback((image: string | null) => {
    setNewlyGeneratedImage(image);
  }, []);

  const handleCreatePost = useCallback(
    (caption: string, author: string) => {
      if (!newlyGeneratedImage) return;
      const newPost: Post = {
        id: `post_${Date.now()}`,
        author,
        image: newlyGeneratedImage,
        caption,
        likes: 0,
        comments: [],
        timestamp: new Date().toISOString(),
      };
      setPosts((prev) => [newPost, ...prev]);
      setActiveScreen("feed");
    },
    [newlyGeneratedImage]
  );

  if (activeScreen === "home") {
    return <HomeScreen onEnter={() => setActiveScreen("generator")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-teal-100 text-gray-800">
      <header className="sticky top-0 z-10 text-center p-4 bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <h1
            className="text-3xl md:text-4xl font-bold text-pink-700"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Bloom Me
          </h1>
          <nav className="flex space-x-1 rounded-full bg-white/50 p-1 shadow-inner">
            {NAV_ITEMS.map(({ screen, label, icon }) => (
              <button
                key={screen}
                onClick={() => setActiveScreen(screen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 min-h-[44px] ${
                  activeScreen === screen
                    ? "bg-pink-100 text-pink-700 shadow-sm"
                    : "text-gray-500 hover:text-pink-500"
                }`}
              >
                <span>{icon}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 max-w-5xl">
        {activeScreen === "generator" && (
          <GeneratorScreen
            onImageGenerated={handleImageGenerated}
            newlyGeneratedImage={newlyGeneratedImage}
            onCreatePost={handleCreatePost}
          />
        )}
        {activeScreen === "feed" && <FeedScreen posts={posts} setPosts={setPosts} />}
        {activeScreen === "chat" && <ChatScreen />}
      </main>

      <footer className="text-center p-4 mt-8 text-gray-500 text-sm">
        <p>Powered by Google Gemini. Designed with love.</p>
      </footer>
    </div>
  );
}
