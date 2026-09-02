"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, LayoutGrid, Loader2 } from "lucide-react";

export default function MyServicesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [services, setServices] = React.useState<{id: string, title: string, status: string}[]>([]);

  React.useEffect(() => {
    const fetchMyServices = async () => {
      setIsLoading(true);
      await new Promise(res => setTimeout(res, 800)); // Mock network
      setServices([
        { id: "1", title: "Full-Stack Web Development", status: "Active" },
        { id: "2", title: "Database Architecture", status: "Draft" }
      ]);
      setIsLoading(false);
    };
    fetchMyServices();
  }, []);

  return (
    <main className="container max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Services</h1>
          <p className="text-muted-foreground mt-1">Manage the services you provide to clients.</p>
        </div>
        <Button onClick={() => router.push("/services/new")}>
          <Plus className="mr-2 h-4 w-4" /> Create Service
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12 border rounded-lg bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-lg bg-card">
          <LayoutGrid className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold mb-2">No Services Yet</h2>
          <p className="text-muted-foreground mb-6">You haven't created any services. Start offering your skills today.</p>
          <Button onClick={() => router.push("/services/new")}>
            Create Your First Service
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 text-muted-foreground border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Service Name</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {services.map((svc) => (
                <tr key={svc.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{svc.title}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${svc.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'}`}>
                      {svc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}