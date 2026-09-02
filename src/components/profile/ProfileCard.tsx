"use client";

import * as React from "react";
import { UserProfile } from "@/app/(protected)/profile/page";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, LogOut, RefreshCw, ShieldCheck } from "lucide-react";

interface ProfileCardProps {
  user: UserProfile;
  isLoggingOut: boolean;
  onLogout: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

// THIS IS THE LINE THAT WAS MISSING THE "export" KEYWORD
export function ProfileCard({
  user,
  isLoggingOut,
  onLogout,
  onRefresh,
}: ProfileCardProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getInitials = (name: string, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    return email ? email.substring(0, 2).toUpperCase() : "U";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
      {/* Top Banner / Avatar Header */}
      <div className="bg-muted/40 p-6 md:p-8 border-b">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold border border-primary/20">
            {getInitials(user.name, user.email)}
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {user.name || "KnowledgePulse User"}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5" />
                Active
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Profile Details List */}
      <div className="p-6 md:p-8 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-md bg-secondary text-secondary-foreground">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Full Name</p>
              <p className="text-sm font-medium text-foreground mt-0.5">
                {user.name || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-md bg-secondary text-secondary-foreground">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Email Address</p>
              <p className="text-sm font-medium text-foreground mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          {user.createdAt && (
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-md bg-secondary text-secondary-foreground">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Member Since</p>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          )}

          {user.id && (
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-md bg-secondary text-secondary-foreground">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">User ID</p>
                <p className="text-sm font-mono text-muted-foreground mt-0.5 break-all">
                  {user.id}
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Actions Footer */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshClick}
            disabled={isRefreshing || isLoggingOut}
            className="w-full sm:w-auto"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh Profile"}
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={onLogout}
            disabled={isLoggingOut || isRefreshing}
            className="w-full sm:w-auto"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </div>
    </div>
  );
}