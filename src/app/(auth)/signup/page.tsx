"use client"

import { ArrowRight, Sparkles } from "lucide-react"

import { SignupForm } from "@/components/auth/SignupForm"
import Logo from "@/components/design/Logo"
import Link from "next/link"

export default function SignupPage() {
  const APP_NAME = process.env.APP_NAME || "Knowledge Pulse";
  return (
    <main className="min-h-screen bg-md-background text-md-on-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ─────────────────────────────────────────
         * LEFT — Welcome / Brand section
         * Desktop: full-height expressive panel
         * Mobile: compact header
         * ───────────────────────────────────────── */}
        <section className="relative max-lg:hidden overflow-hidden bg-md-primary text-md-on-primary">
          {/* Atmospheric shapes */}
          <div
            aria-hidden="true"
            className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-md-tertiary/30 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-md-secondary-container/10 blur-3xl"
          />

          {/* Decorative organic shape */}
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -left-16 hidden h-72 w-[32rem] rotate-[-12deg] rounded-[100px] bg-white/5 blur-sm lg:block"
          />

          <div className="relative flex min-h-[300px] flex-col justify-between p-6 sm:p-10 lg:min-h-screen lg:p-14 xl:p-20">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <Logo w={80} h={80} />
              </div>

              <Link href="/" className="text-lg font-serif font-medium tracking-widest">
                {APP_NAME}
              </Link>
            </div>

            {/* Greeting */}
            <div className="max-w-xl py-10 lg:py-0">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-md-tertiary"
                />
                Welcome aboard
              </div>

              <h1 className="text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
                Great things
                <br />
                start with{" "}
                <span className="text-md-secondary-container">
                  you.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
                Create your account and discover a simpler,
                more personal way to get things done. We’re
                excited to have you here.
              </p>

              {/* Small visual feature */}
              <div className="mt-8 hidden max-w-sm items-center gap-4 rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur-md sm:flex lg:mt-12">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-md-secondary-container text-md-on-secondary-container">
                  <ArrowRight
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="font-medium">
                    Your journey starts here
                  </p>
                  <p className="mt-0.5 text-sm text-white/65">
                    It only takes a minute to get started.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="hidden text-sm text-white/55 lg:block">
              © {new Date().getFullYear()} YourBrand. All rights reserved.
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────
         * RIGHT — Signup form
         * ───────────────────────────────────────── */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-md-background px-4 py-10 sm:px-6 lg:px-10 xl:px-16">
          {/* Subtle mobile / form-side atmosphere */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-md-secondary-container/30 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 left-0 h-72 w-72 rounded-full bg-md-primary/10 blur-3xl"
          />

          <div className="relative w-full max-w-md">
            <SignupForm
              onSubmit={async (data) => {
                // Connect this to your signup API/auth provider.
                console.log("Create account:", data)
              }}
            />
          </div>
        </section>
      </div>
    </main>
  )
}
