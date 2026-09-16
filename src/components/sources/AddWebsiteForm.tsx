"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Loader2, Plus } from "lucide-react";
import { createWebsiteSourceAction } from "@/actions/intelligence";

export function AddWebsiteForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError("Please enter a website URL.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createWebsiteSourceAction(url.trim(), label.trim() || null);
      if (!res.success) {
        setError(res.error || "Failed to add website source.");
      } else {
        setUrl("");
        setLabel("");
        setIsOpen(false);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred while adding website source.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-300 bg-white p-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-200"
      >
        <span className="flex flex-col items-center gap-1 rounded-2xl p-5">
          <Globe className="h-5 w-5 text-[#6750A4]" />
          <span className="text-sm text-slate-700 dark:text-slate-300">Add Website</span>
        </span>   
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-zinc-800">
        <Globe className="h-4 w-4 text-[#6750A4]" />
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
          Connect Website Source
        </h4>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <label
            htmlFor="website-url"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Website or Documentation URL *
          </label>
          <input
            id="website-url"
            type="url"
            required
            placeholder="https://docs.example.com/guide"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#6750A4] focus:outline-hidden focus:ring-1 focus:ring-[#6750A4] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="website-label"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Display Label (optional)
          </label>
          <input
            id="website-label"
            type="text"
            placeholder="Main Documentation"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#6750A4] focus:outline-hidden focus:ring-1 focus:ring-[#6750A4] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setError(null);
          }}
          className="rounded-full px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#6750A4] px-4 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-[#6750A4]/90 disabled:opacity-50 active:scale-95"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Connecting…</span>
            </>
          ) : (
            <span>Connect</span>
          )}
        </button>
      </div>
    </form>
  );
}
