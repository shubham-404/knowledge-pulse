"use client";

import { useState } from "react";
import { Play, RefreshCw } from "lucide-react";
import { triggerAnalyticsBatchAction } from "@/actions/intelligence";

interface AnalyticsRunControlProps {
  period?: string | null;
}

export function AnalyticsRunControl({ period }: AnalyticsRunControlProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function handleRunAnalytics() {
    setIsRunning(true);
    setStatusMessage("Starting analytics batch…");

    try {
      const result = await triggerAnalyticsBatchAction(period);
      if (result.success) {
        setStatusMessage(
          "Analytics started. Results will appear once processing completes."
        );
      } else {
        setStatusMessage(result.error || "Unable to start analytics.");
      }
    } catch {
      setStatusMessage("Failed to trigger analytics.");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5 sm:flex-row sm:items-center">
      {statusMessage && (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {statusMessage}
        </span>
      )}

      <button
        type="button"
        onClick={handleRunAnalytics}
        disabled={isRunning}
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-200 dark:hover:bg-zinc-750"
      >
        {isRunning ? (
          <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#6750A4]" />
        ) : (
          <Play className="h-3.5 w-3.5 text-[#6750A4]" />
        )}
        <span>{isRunning ? "Starting batch…" : "Run analytics"}</span>
      </button>
    </div>
  );
}
