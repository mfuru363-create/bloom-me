"use client";

import { useState } from "react";
import type { ChatMessage } from "@/types/social";

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const isUser = message.sender === "user";

  const textToShow =
    showTranslation && message.translation ? message.translation : message.text;

  const renderText = () => {
    if (!message.educationalNote) return textToShow;
    const regex = new RegExp(`(${Object.keys(message.educationalNote).join("|")})`, "g");
    return textToShow.split(regex).map((part, i) => {
      if (message.educationalNote?.[part]) {
        return (
          <span key={i} className="font-bold text-teal-600 underline decoration-dotted" title={message.educationalNote[part]}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-md ${
          isUser ? "bg-pink-500 text-white" : "bg-white text-gray-800"
        }`}
      >
        <p>{renderText()}</p>
        {message.translation && (
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`text-xs mt-2 ${
              isUser ? "text-pink-200 hover:text-white" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {showTranslation ? "Show Original" : "Translate"}
          </button>
        )}
      </div>
    </div>
  );
}
