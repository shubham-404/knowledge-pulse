"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setIsSuccess(false);
    
    // Simulate API update
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setIsSuccess(true);
    setTimeout(() => router.push("/profile"), 2000);
  };

  return (
    <main className="container max-w-2xl mx-auto px-4 py-8 md:py-12">
      <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="rounded-lg border bg-card p-6 md:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground mb-6">Edit Profile</h1>

        {isSuccess && (
          <div className="mb-6 p-4 rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center border border-emerald-200 dark:border-emerald-900">
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Profile updated successfully. Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" defaultValue="Jane Doe" required disabled={isSaving} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="jane@example.com" required disabled={isSaving} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea 
              id="bio"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="I am a professional software engineer with 5 years of experience."
              disabled={isSaving}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => router.push("/profile")} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}