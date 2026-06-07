"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/types/social";
import { initialMessages } from "@/data/chat";
import ChatBubble from "@/components/ChatBubble";

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (inputValue.trim() === "") return;

      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        sender: "user",
        text: inputValue,
      };

      const spiritResponse: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: "spirit",
        text: "That's interesting! Tell me more.",
        translation: "それは面白いですね！もっと教えてください。",
      };

      setMessages((prev) => [...prev, userMessage, spiritResponse]);
      setInputValue("");
    },
    [inputValue]
  );

  return (
    <div className="max-w-2xl mx-auto h-[75vh] flex flex-col">
      <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-700 mb-4">
        Chat with Sakura Spirit
      </h2>
      <div className="flex-1 overflow-y-auto p-4 bg-white/70 rounded-t-lg shadow-inner space-y-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <div ref={chatEndRef} />
      </div>
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white rounded-b-lg shadow-md flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-pink-500 focus:border-pink-500 transition-colors text-base"
        />
        <button
          type="submit"
          className="bg-pink-500 text-white rounded-full p-3 hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 flex-shrink-0"
          aria-label="Send"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
