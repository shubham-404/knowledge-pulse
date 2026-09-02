"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, PlusCircle, Settings, Activity, LayoutDashboard } from "lucide-react";

// Mock interface for dashboard data
interface DashboardData {
  activeServices: number;
  totalBookings: number;
  unreadMessages: number;
  recentActivity: { id: string; action: string; date: string }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchDashboardData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate an API call to fetch dashboard data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulating a successful response with mock data
      setData({
        activeServices: 3,
        totalBookings: 12,
        unreadMessages: 2,
        recentActivity: [
          { id: "1", action: "Updated Profile", date: "2 hours ago" },
          { id: "2", action: "Published 'Web Development' service", date: "1 day ago" },
          { id: "3", action: "Received a new review", date: "3 days ago" },
        ],
      });
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <main className="container max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            My Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your account and recent activities.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => router.push("/my-services")} variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Manage Services
          </Button>
          <Button onClick={() => router.push("/services/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Service
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[300px] rounded-lg border bg-card p-8 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center min-h-[300px] rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mb-4" />
          <h2 className="text-lg font-semibold text-destructive mb-2">Unable to load dashboard</h2>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <Button variant="outline" onClick={fetchDashboardData}>Try Again</Button>
        </div>
      )}

      {/* Success / Populated State */}
      {!isLoading && !error && data && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">Active Services</h3>
              <p className="mt-2 text-3xl font-bold text-foreground">{data.activeServices}</p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">Total Bookings</h3>
              <p className="mt-2 text-3xl font-bold text-foreground">{data.totalBookings}</p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">Unread Messages</h3>
              <p className="mt-2 text-3xl font-bold text-foreground">{data.unreadMessages}</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <div className="bg-muted/40 p-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Recent Activity
              </h3>
            </div>
            <div className="p-0">
              {data.recentActivity.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No recent activity found.
                </div>
              ) : (
                <ul className="divide-y">
                  {data.recentActivity.map((activity) => (
                    <li key={activity.id} className="p-4 flex justify-between items-center hover:bg-muted/10 transition-colors">
                      <span className="text-sm font-medium">{activity.action}</span>
                      <span className="text-xs text-muted-foreground">{activity.date}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}