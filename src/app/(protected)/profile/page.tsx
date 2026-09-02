"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isLoggingOut, setIsLoggingOut] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchProfile = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (res.status === 401) {
        router.push("/login?redirect=/profile");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load user profile data.");
      }

      const data = await res.json();
      if (!data?.user) {
        setUser(null);
      } else {
        setUser(data.user);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while loading your profile."
      );
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        router.push("/login");
        router.refresh();
      } else {
        setError("Failed to sign out. Please try again.");
      }
    } catch {
      setError("A network error occurred while signing out.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Account Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account details and authentication session.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div
            className="flex flex-col items-center justify-center min-h-[320px] rounded-lg border bg-card p-8 text-card-foreground shadow-sm"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground font-medium">
              Loading profile details...
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div
            className="flex flex-col items-center justify-center min-h-[320px] rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center"
            role="alert"
          >
            <div className="rounded-full bg-destructive/10 p-3 mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold text-destructive mb-1">
              Unable to load profile
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              {error}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchProfile}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && !user && (
          <div className="flex flex-col items-center justify-center min-h-[320px] rounded-lg border border-dashed p-8 text-center bg-card">
            <h2 className="text-lg font-medium text-foreground mb-1">
              No Profile Found
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Your profile information could not be located in the current session.
            </p>
            <Button onClick={() => router.push("/login")}>
              Go to Login
            </Button>
          </div>
        )}

        {/* Success / Populated State */}
        {!isLoading && !error && user && (
          <ProfileCard
            user={user}
            isLoggingOut={isLoggingOut}
            onLogout={handleLogout}
            onRefresh={fetchProfile}
          />
        )}
      </div>
    </main>
  );
}