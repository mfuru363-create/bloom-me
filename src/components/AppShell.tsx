"use client";

import { useState } from "react";
import { ChatScreen } from "@/components/ChatScreen";
import { HomeScreen } from "@/components/HomeScreen";
import type { HomeEnterPayload } from "@/types/app";

export function AppShell() {
  const [session, setSession] = useState<HomeEnterPayload | null>(null);

  if (!session) {
    return <HomeScreen onEnter={setSession} />;
  }

  return (
    <ChatScreen
      userName={session.userName}
      gender={session.gender}
      onBack={() => setSession(null)}
    />
  );
}
