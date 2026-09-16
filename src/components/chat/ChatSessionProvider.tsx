"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { sendChatMessage } from "@/actions/intelligence";
import { ChatMessage } from "./MessageBubble";

export interface ChatSessionContextValue {
  sessionId: string;
  messages: ChatMessage[];
  isSending: boolean;
  error: string | null;
  sendMessage: (question: string) => Promise<void>;
  clearChat: () => void;
}

const ChatSessionContext = createContext<ChatSessionContextValue | null>(null);

function generateSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Lightweight, client-only ephemeral chat state provider.
 * Mounted in persistent protected layout so conversation survives sibling route navigation.
 * A full browser reload re-mounts the React tree, automatically resetting state without any storage persistence.
 */
export function ChatSessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string>(generateSessionId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || isSending) return;

      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        role: "user",
        text: trimmed,
        createdAt: new Date().toISOString(),
        confidence: null,
        citations: [],
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsSending(true);
      setError(null);

      try {
        const result = await sendChatMessage(trimmed, sessionId);

        if (result.success && result.data) {
          setMessages((prev) => [...prev, result.data!]);
        } else {
          const errText =
            result.error ||
            "Unable to get an answer right now. Please check if your intelligence backend is connected.";
          setError(errText);
          const errorMessage: ChatMessage = {
            id: `err_${Date.now()}`,
            role: "assistant",
            text: errText,
            createdAt: new Date().toISOString(),
            confidence: null,
            citations: [],
            isError: true,
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } catch {
        const fallbackErr = "Failed to communicate with intelligence service.";
        setError(fallbackErr);
        const errorMessage: ChatMessage = {
          id: `err_${Date.now()}`,
          role: "assistant",
          text: fallbackErr,
          createdAt: new Date().toISOString(),
          confidence: null,
          citations: [],
          isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsSending(false);
      }
    },
    [sessionId, isSending]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(generateSessionId());
    setError(null);
    setIsSending(false);
  }, []);

  return (
    <ChatSessionContext.Provider
      value={{
        sessionId,
        messages,
        isSending,
        error,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </ChatSessionContext.Provider>
  );
}

export function useChatSession(): ChatSessionContextValue {
  const context = useContext(ChatSessionContext);
  if (!context) {
    throw new Error("useChatSession must be used within a ChatSessionProvider");
  }
  return context;
}
