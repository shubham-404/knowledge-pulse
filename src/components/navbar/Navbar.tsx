import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, LayoutDashboard, Briefcase, Search } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        
        {/* Left side: Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight text-primary">
              KnowledgePulse
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link 
              href="/services" 
              className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-2"
            >
              <Search className="h-4 w-4" /> Explore
            </Link>
            <Link 
              href="/me/dashboard" 
              className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <Link 
              href="/my-services" 
              className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-2"
            >
              <Briefcase className="h-4 w-4" /> My Services
            </Link>
          </nav>
        </div>

        {/* Right side: User Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile-only dashboard icon */}
          <Link href="/me/dashboard" className="md:hidden p-2 text-foreground/60 hover:text-foreground">
            <LayoutDashboard className="h-5 w-5" />
            <span className="sr-only">Dashboard</span>
          </Link>
          
          <Link href="/profile">
            <Button variant="outline" size="sm">
              <User className="mr-2 h-4 w-4" /> Profile
            </Button>
          </Link>
        </div>
        
      </div>
    </header>
  );
}