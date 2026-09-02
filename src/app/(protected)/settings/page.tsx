"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Bell, Shield, Moon } from "lucide-react";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert("Settings saved successfully.");
  };

  return (
    <main className="container max-w-3xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and notifications.</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b pb-4">
            <Bell className="h-5 w-5 text-primary" /> Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive emails about new bookings and messages.</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Receive promotional offers and updates.</p>
              </div>
              <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b pb-4">
            <Shield className="h-5 w-5 text-primary" /> Security
          </h2>
          <div className="space-y-4">
            <Button variant="outline">Change Password</Button>
            <p className="text-sm text-muted-foreground block">
              Ensure your account is using a long, random password to stay secure.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Preferences
          </Button>
        </div>
      </div>
    </main>
  );
}