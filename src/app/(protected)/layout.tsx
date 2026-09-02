import * as React from "react";
import { Navbar } from "@/components/navbar/Navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}