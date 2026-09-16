"use client";

import { MessageSquarePlus } from "lucide-react";
import { ChatComposer } from "./ChatComposer";
import { MessageList } from "./MessageList";
import { useChatSession } from "./ChatSessionProvider";

export function ChatWindow() {
  const { messages, isSending, sendMessage, clearChat } = useChatSession();

  return (
    <div className="flex h-[calc(100vh-14rem)] min-h-[500px] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Assistant Active
          </span>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={clearChat}
            disabled={isSending}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-300 dark:hover:bg-zinc-700"
            title="Start a new chat session"
            aria-label="New chat"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
            New chat
          </button>
        )}
      </div>

      <MessageList messages={messages} isLoading={isSending} />
      <ChatComposer onSend={sendMessage} isLoading={isSending} />
    </div>
  );
}
