"use client";

import { ArrowRight, LogOut, Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { logoutUser } from "@/actions/auth";
import { UserAvatar } from "@/components/ui/user-avatar";
import { SafeUser } from "@/models/user";
import Logo from "../design/Logo";

interface NavbarProps {
  user?: SafeUser | null;
}

export function Navbar({ user: initialUser }: NavbarProps) {
  const [fetchedUser, setFetchedUser] = useState<SafeUser | null>(null);
  const user = initialUser !== undefined ? initialUser : fetchedUser;
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (initialUser !== undefined) {
      return;
    }

    let isMounted = true;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.user) {
          setFetchedUser(data.user);
        }
      })
      .catch(() => { });

    return () => {
      isMounted = false;
    };
  }, [initialUser, pathname]);

  async function handleLogout() {
    try {
      await logoutUser();
    } catch {
      // Fallback
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-1">

          <Logo w={35} h={35} />


          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Knowledge<span className="text-md-primary">Pulse</span>
          </span>
        </Link>

        {/* Navigation - Authenticated vs Public */}
        {user ? (
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/overview"
              className={`text-sm font-medium transition hover:text-md-primary ${pathname.startsWith("/overview") ||
                  pathname.startsWith("/insights") ||
                  pathname.startsWith("/report") ||
                  pathname.startsWith("/ask") ||
                  pathname.startsWith("/sources") ||
                  pathname.startsWith("/evaluation")
                  ? "text-md-primary font-semibold"
                  : "text-slate-600 dark:text-slate-300"
                }`}
            >
              Workspace
            </Link>
            <Link
              href="/services"
              className={`text-sm font-medium transition hover:text-md-primary ${pathname === "/services"
                  ? "text-md-primary font-semibold"
                  : "text-slate-600 dark:text-slate-300"
                }`}
            >
              Services
            </Link>
            <Link
              href="/onboarding/resources"
              className={`text-sm font-medium transition hover:text-md-primary ${pathname === "/onboarding/resources"
                  ? "text-md-primary font-semibold"
                  : "text-slate-600 dark:text-slate-300"
                }`}
            >
              Resources
            </Link>
            <Link
              href="/profile"
              className={`text-sm font-medium transition hover:text-md-primary ${pathname === "/profile"
                  ? "text-md-primary font-semibold"
                  : "text-slate-600 dark:text-slate-300"
                }`}
            >
              Profile
            </Link>
          </nav>
        ) : (
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/#product"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            >
              Product
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            >
              How it works
            </Link>
            <Link
              href="/#insights"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            >
              Insights
            </Link>
            <Link
              href="/#features"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            >
              Features
            </Link>
          </nav>
        )}

        {/* Right CTA / User profile */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                <UserAvatar name={user.name} size="sm" />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {user.name}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-rose-600 dark:border-zinc-800 dark:text-slate-300 dark:hover:bg-zinc-900"
                aria-label="Log out"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-md-primary active:scale-95 dark:bg-white dark:text-slate-950 dark:hover:bg-md-primary dark:hover:text-white"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-slate-700 md:hidden dark:text-slate-200"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-5 md:hidden dark:border-zinc-800 dark:bg-zinc-950">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-zinc-800">
                <UserAvatar name={user.name} size="md" />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
              </div>

              <nav className="flex flex-col gap-1">
                <Link
                  href="/overview"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-zinc-900"
                >
                  Workspace
                </Link>
                <Link
                  href="/services"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-zinc-900"
                >
                  Services
                </Link>
                <Link
                  href="/onboarding/resources"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-zinc-900"
                >
                  Resources
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-zinc-900"
                >
                  Account Profile
                </Link>
              </nav>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <nav className="flex flex-col gap-1">
              {["Product", "How it works", "Insights", "Features"].map((item) => (
                <Link
                  key={item}
                  href={`/#${item.toLowerCase().replaceAll(" ", "-")}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-zinc-900"
                >
                  {item}
                </Link>
              ))}

              <div className="mt-3 border-t border-slate-100 pt-4 space-y-2 dark:border-zinc-800">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-zinc-900"
                >
                  Sign in
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-md-primary"
                >
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </nav>
          )}
        </div>
      )}
    </header>
  );
}
