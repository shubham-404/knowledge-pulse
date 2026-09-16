"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart3,
  Bot,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Layers,
  Lightbulb,
  LogOut,
  LucideIcon,
  Mail,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { logoutUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import servicesData from "@/data/services.json";
import { SafeUser } from "@/models/user";

interface ProfileCardProps {
  user: SafeUser;
}

const iconMap: Record<string, LucideIcon> = {
  FileText,
  Bot,
  BarChart3,
  Lightbulb,
};

export function ProfileCard({ user }: ProfileCardProps) {
  const selectedServices = servicesData.filter((s) =>
    user.services?.includes(s.id),
  );

  async function handleLogout() {
    await logoutUser();
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* ─────────────────────────────────────────
       * Header Account Card
       * ───────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-md-surface-container p-6 sm:p-8 shadow-sm">
        {/* Background glow accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-md-primary/10 blur-3xl"
        />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <UserAvatar name={user.name} size="lg" className="h-16 w-16 text-xl" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-md-on-surface sm:text-3xl">
                  {user.name}
                </h1>
                {user.isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    <Clock className="h-3 w-3" />
                    Pending Verification
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-md-on-surface-variant">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Building className="h-4 w-4" />
                  {user.organization_name}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <Link
              href="/overview"
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-[#6750A4] active:scale-95 dark:bg-white dark:text-slate-950"
            >
              <Sparkles className="h-4 w-4" />
              Open Workspace
            </Link>

            <Button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-rose-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-200 shadow-none"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-md-outline/10 pt-6">
          <div className="rounded-2xl bg-white/70 p-3.5 dark:bg-zinc-900/70 border border-slate-100 dark:border-zinc-800">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Subscription
            </span>
            <p className="mt-1 text-sm font-bold capitalize text-slate-900 dark:text-white flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${
                  user.subscription === "active"
                    ? "bg-emerald-500"
                    : "bg-slate-400"
                }`}
              />
              {user.subscription}
            </p>
          </div>

          <div className="rounded-2xl bg-white/70 p-3.5 dark:bg-zinc-900/70 border border-slate-100 dark:border-zinc-800">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Services Active
            </span>
            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              {user.services?.length ?? 0}
            </p>
          </div>

          <div className="rounded-2xl bg-white/70 p-3.5 dark:bg-zinc-900/70 border border-slate-100 dark:border-zinc-800">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Documents Linked
            </span>
            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              {user.documents?.length ?? 0}
            </p>
          </div>

          <div className="rounded-2xl bg-white/70 p-3.5 dark:bg-zinc-900/70 border border-slate-100 dark:border-zinc-800">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              URL Resources
            </span>
            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              {user.resources?.length ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
       * Selected Services Section
       * ───────────────────────────────────────── */}
      <div className="rounded-[32px] border border-slate-200/80 bg-md-surface-container p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-md-on-surface">
              Activated Services
            </h2>
            <p className="mt-1 text-sm text-md-on-surface-variant">
              The intelligence modules provisioned for your organization workspace.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-md-primary hover:underline"
          >
            <Layers className="h-4 w-4" />
            Manage Services &rarr;
          </Link>
        </div>

        {selectedServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedServices.map((service) => {
              const IconComp = iconMap[service.icon] || Sparkles;
              return (
                <div
                  key={service.id}
                  className="flex flex-col justify-between rounded-[24px] border border-slate-200/90 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-md-secondary-container text-md-on-secondary-container">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                      </span>
                    </div>

                    <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
                      {service.name}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-3 dark:border-zinc-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Included Capabilities
                    </span>
                    <ul className="mt-1.5 space-y-1">
                      {service.features.slice(0, 2).map((f, i) => (
                        <li
                          key={i}
                          className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-md-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
            <Sparkles className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
              No services selected yet
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Select one or more services to configure your knowledge intelligence workspace.
            </p>
            <Link
              href="/services"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-md-primary px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-md-primary/90"
            >
              Select Services
            </Link>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────
       * Knowledge Sources Section
       * ───────────────────────────────────────── */}
      <div className="rounded-[32px] border border-slate-200/80 bg-md-surface-container p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-md-on-surface">
              Connected Knowledge Sources
            </h2>
            <p className="mt-1 text-sm text-md-on-surface-variant">
              Documents and documentation URLs linked to your services.
            </p>
          </div>

          <Link
            href="/onboarding/resources"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-md-primary hover:underline"
          >
            <Plus className="h-4 w-4" />
            Add Resources &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Documents Column */}
          <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-md-primary" />
                Uploaded Documents ({user.documents?.length ?? 0})
              </h3>
            </div>

            {user.documents && user.documents.length > 0 ? (
              <ul className="mt-3 divide-y divide-slate-100 dark:divide-zinc-800">
                {user.documents.map((doc) => (
                  <li key={doc.id} className="py-2.5 flex items-center justify-between">
                    <div className="min-w-0 pr-3">
                      <p className="truncate text-xs sm:text-sm font-medium text-slate-900 dark:text-white">
                        {doc.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {doc.type || "Document"} &bull; Added{" "}
                        {new Date(doc.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-xs text-slate-400 text-center py-4">
                No documents uploaded yet.
              </p>
            )}
          </div>

          {/* Resources Column */}
          <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-md-primary" />
                Web & Documentation URLs ({user.resources?.length ?? 0})
              </h3>
            </div>

            {user.resources && user.resources.length > 0 ? (
              <ul className="mt-3 divide-y divide-slate-100 dark:divide-zinc-800">
                {user.resources.map((res) => (
                  <li key={res.id} className="py-2.5 flex items-center justify-between">
                    <div className="min-w-0 pr-3">
                      <p className="truncate text-xs sm:text-sm font-medium text-slate-900 dark:text-white">
                        {res.title || res.url}
                      </p>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-md-primary hover:underline truncate max-w-xs"
                      >
                        {res.url}
                        <ExternalLink className="h-2.5 w-2.5 inline" />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-xs text-slate-400 text-center py-4">
                No resource URLs connected yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
       * Organization & Account Details
       * ───────────────────────────────────────── */}
      <div className="rounded-[32px] border border-slate-200/80 bg-md-surface-container p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-md-on-surface">
          Account & Organization Details
        </h2>
        <p className="mt-1 text-sm text-md-on-surface-variant">
          Organization identity parameters used for tenant-scoped knowledge isolation.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <span className="text-xs font-medium text-slate-500">Organization Name</span>
            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
              {user.organization_name}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <span className="text-xs font-medium text-slate-500">Tenant Identifier</span>
            <p className="mt-1 font-mono text-xs text-slate-600 dark:text-slate-400">
              {user.organization_id || "Unassigned"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
