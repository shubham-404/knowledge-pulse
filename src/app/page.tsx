"use client";

import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  ChevronRight,
  FileText,
  Lightbulb,
  Menu,
  MessageSquare,
  Search,
  Sparkles,
  TrendingUp,
  Upload,
  X,
} from "lucide-react"
import Link from "next/link";
import { useState } from "react"

const insights = [
  {
    title: "Password reset confusion",
    type: "Documentation",
    trend: "+42%",
    confidence: "38%",
    priority: "High",
    color: "text-rose-600 bg-rose-50",
  },
  {
    title: "Unable to export reports",
    type: "Product",
    trend: "+28%",
    confidence: "44%",
    priority: "High",
    color: "text-orange-600 bg-orange-50",
  },
  {
    title: "Invoice download location",
    type: "FAQ",
    trend: "+19%",
    confidence: "81%",
    priority: "Medium",
    color: "text-blue-600 bg-blue-50",
  },
]

export default function KnowledgePulseHome() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-slate-950">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <Sparkles className="h-4.5 w-4.5" />
            </div>

            <span className="text-lg font-bold tracking-tight">
              Knowledge<span className="text-indigo-600">Pulse</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#product"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Product
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              How it works
            </a>
            <a
              href="#insights"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Insights
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Features
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950">
              Sign in
            </Link>

            <Link href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate-700 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-5 md:hidden">
            <nav className="flex flex-col gap-1">
              {["Product", "How it works", "Insights", "Features"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {item}
                  </a>
                )
              )}

              <div className="mt-3 border-t border-slate-100 pt-4">
                <button className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700">
                  Sign in
                </button>

                <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.14),_transparent_35%),radial-gradient(circle_at_top_left,_rgba(129,140,248,0.10),_transparent_30%)]" />

          <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pb-28">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-sm font-medium text-indigo-700">
                <Sparkles className="h-3.5 w-3.5" />
                AI-powered customer intelligence
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Your customers are telling you what to fix.
                <span className="block text-indigo-600">
                  KnowledgePulse finds it.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Turn every customer conversation into actionable intelligence.
                KnowledgePulse detects knowledge gaps, emerging issues and
                product friction — then recommends what your team should do
                next.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700">
                  Start discovering insights
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
                  See how it works
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  RAG-powered
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Evidence-backed insights
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Automated reports
                </span>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="mx-auto mt-16 max-w-6xl">
              <div className="rounded-2xl border border-slate-200 bg-slate-950 p-2 shadow-2xl shadow-indigo-950/10 sm:p-3">
                <div className="overflow-hidden rounded-xl bg-slate-50">
                  {/* Fake browser bar */}
                  <div className="flex h-10 items-center gap-1.5 border-b border-slate-200 bg-white px-4">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-300" />

                    <div className="mx-auto hidden h-6 w-64 rounded-md bg-slate-50 sm:block" />
                  </div>

                  <div className="grid min-h-[480px] md:grid-cols-[190px_1fr]">
                    {/* Sidebar */}
                    <aside className="hidden border-r border-slate-200 bg-white p-4 md:block">
                      <div className="mb-7 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                          <Sparkles className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-bold">KnowledgePulse</span>
                      </div>

                      <div className="space-y-1">
                        {[
                          ["Overview", BarChart3],
                          ["Conversations", MessageSquare],
                          ["Knowledge", FileText],
                          ["Insights", Lightbulb],
                        ].map(([label, Icon], index) => (
                          <div
                            key={label as string}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                              index === 0
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-slate-500"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {label as string}
                          </div>
                        ))}
                      </div>
                    </aside>

                    {/* Dashboard */}
                    <div className="p-5 sm:p-7">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-slate-500">
                            Customer intelligence
                          </p>
                          <h3 className="mt-1 text-lg font-bold text-slate-950">
                            Overview
                          </h3>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">
                          Last 30 days
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                        {[
                          ["12,482", "Conversations", "+18.4%"],
                          ["87.2%", "Answer confidence", "+6.8%"],
                          ["34", "Topics discovered", "+9"],
                          ["18", "Actionable insights", "+5"],
                        ].map(([value, label, trend]) => (
                          <div
                            key={label}
                            className="rounded-xl border border-slate-200 bg-white p-4"
                          >
                            <p className="text-xl font-bold tracking-tight">
                              {value}
                            </p>
                            <p className="mt-1 text-[11px] text-slate-500">
                              {label}
                            </p>
                            <p className="mt-2 text-[10px] font-semibold text-emerald-600">
                              {trend}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Main dashboard */}
                      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-semibold">
                                Customer topics
                              </p>
                              <p className="mt-1 text-[10px] text-slate-500">
                                Volume over the last 30 days
                              </p>
                            </div>

                            <TrendingUp className="h-4 w-4 text-indigo-500" />
                          </div>

                          <div className="mt-6 flex h-36 items-end gap-2">
                            {[32, 44, 39, 58, 48, 70, 62, 78, 68, 88, 75, 96].map(
                              (height, index) => (
                                <div
                                  key={index}
                                  className="flex-1 rounded-t-md bg-indigo-100"
                                  style={{ height: `${height}%` }}
                                >
                                  <div
                                    className="h-full rounded-t-md bg-indigo-500"
                                    style={{
                                      opacity: index > 8 ? 0.95 : 0.55,
                                    }}
                                  />
                                </div>
                              )
                            )}
                          </div>

                          <div className="mt-4 flex justify-between text-[9px] text-slate-400">
                            <span>Aug 1</span>
                            <span>Aug 15</span>
                            <span>Aug 30</span>
                          </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-semibold">
                                Priority insights
                              </p>
                              <p className="mt-1 text-[10px] text-slate-500">
                                Ranked by impact
                              </p>
                            </div>
                            <Lightbulb className="h-4 w-4 text-amber-500" />
                          </div>

                          <div className="mt-4 space-y-2.5">
                            {insights.map((insight) => (
                              <div
                                key={insight.title}
                                className="rounded-lg border border-slate-100 p-2.5"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-[10px] font-semibold leading-4">
                                    {insight.title}
                                  </p>
                                  <span
                                    className={`rounded px-1.5 py-0.5 text-[8px] font-semibold ${insight.color}`}
                                  >
                                    {insight.priority}
                                  </span>
                                </div>

                                <div className="mt-2 flex items-center justify-between text-[8px] text-slate-400">
                                  <span>{insight.type}</span>
                                  <span className="font-semibold text-rose-500">
                                    {insight.trend}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value proposition */}
        <section className="border-y border-slate-100 bg-slate-50/70">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
            {[
              {
                icon: MessageSquare,
                title: "Every conversation becomes data",
                text: "Capture the questions customers actually ask — not just survey responses.",
              },
              {
                icon: Search,
                title: "Find what your chatbot misses",
                text: "Track retrieval confidence and discover recurring knowledge gaps automatically.",
              },
              {
                icon: Lightbulb,
                title: "Turn problems into action",
                text: "Get prioritized recommendations your product and documentation teams can use.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Product */}
        <section id="product" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-indigo-600">
                From conversation to intelligence
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Don't just deploy a chatbot.
                <span className="text-slate-400">
                  {" "}
                  Learn from everything it hears.
                </span>
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                KnowledgePulse closes the loop between customer questions and
                the decisions your team needs to make.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  number: "01",
                  icon: Upload,
                  title: "Connect knowledge",
                  text: "Crawl your website or upload PDFs, DOCX files and FAQs.",
                },
                {
                  number: "02",
                  icon: Bot,
                  title: "Answer customers",
                  text: "Serve grounded answers using retrieval-augmented generation.",
                },
                {
                  number: "03",
                  icon: BarChart3,
                  title: "Analyze conversations",
                  text: "Cluster questions and detect trends, recurring issues and emerging concerns.",
                },
                {
                  number: "04",
                  icon: Lightbulb,
                  title: "Take action",
                  text: "Receive prioritized recommendations backed by real customer questions.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <item.icon className="h-5 w-5" />
                    </div>

                    <span className="text-xs font-bold text-slate-300">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-6 font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Insights */}
        <section
          id="insights"
          className="overflow-hidden bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-8"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-indigo-400">
                Customer intelligence
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                See the problems before they become problems.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-400">
                KnowledgePulse doesn't simply count conversations. It
                identifies what is changing, what's unresolved and what your
                customers are struggling with most.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  [
                    "Emerging concerns",
                    "Spot rapidly growing topics before they dominate your support volume.",
                  ],
                  [
                    "Recurring issues",
                    "Identify problems that keep appearing because they haven't been resolved.",
                  ],
                  [
                    "Confidence gaps",
                    "Find topics where your knowledge base repeatedly fails to provide strong evidence.",
                  ],
                ].map(([title, text]) => (
                  <div key={title} className="flex gap-4">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-400">
                      <Check className="h-3.5 w-3.5" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insight card */}
            <div className="relative">
              <div className="absolute -inset-10 rounded-full bg-indigo-600/20 blur-3xl" />

              <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur sm:p-6">
                <div className="rounded-xl border border-white/10 bg-slate-900 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">
                        Insight detected
                      </p>
                      <h3 className="mt-1 font-semibold">
                        Password reset confusion
                      </h3>
                    </div>

                    <span className="rounded-full bg-rose-500/10 px-2.5 py-1 text-[10px] font-semibold text-rose-400">
                      Emerging
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-white/[0.04] p-3">
                      <p className="text-lg font-bold">+42%</p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Query growth
                      </p>
                    </div>

                    <div className="rounded-lg bg-white/[0.04] p-3">
                      <p className="text-lg font-bold">38%</p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Confidence
                      </p>
                    </div>

                    <div className="rounded-lg bg-white/[0.04] p-3">
                      <p className="text-lg font-bold">127</p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Questions
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
                    <div className="flex gap-3">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                      <div>
                        <p className="text-xs font-semibold text-indigo-300">
                          Recommended action
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Update the account recovery documentation with a
                          dedicated password reset walkthrough.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                      Evidence
                    </p>

                    <div className="mt-3 space-y-2">
                      {[
                        '"How do I reset my password?"',
                        '"The reset link never arrives"',
                        '"Where can I change my password?"',
                      ].map((question) => (
                        <div
                          key={question}
                          className="rounded-md bg-white/[0.035] px-3 py-2 text-xs text-slate-400"
                        >
                          {question}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-indigo-600">
                Built for the full customer intelligence loop
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to turn questions into decisions.
              </h2>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Bot,
                  title: "Grounded AI assistant",
                  text: "Answer questions from your own knowledge base with source citations attached to every response.",
                },
                {
                  icon: Search,
                  title: "Retrieval confidence",
                  text: "Measure confidence from retrieval evidence rather than relying on the model's self-reported certainty.",
                },
                {
                  icon: FileText,
                  title: "Automatic ingestion",
                  text: "Crawl websites and index PDF, DOCX and FAQ content with structure-aware chunking.",
                },
                {
                  icon: BarChart3,
                  title: "Topic intelligence",
                  text: "Automatically discover customer topics without manually defining the categories beforehand.",
                },
                {
                  icon: TrendingUp,
                  title: "Trend detection",
                  text: "Separate stable, recurring and emerging customer concerns across reporting periods.",
                },
                {
                  icon: Lightbulb,
                  title: "Actionable recommendations",
                  text: "Generate product, documentation, FAQ and customer issue recommendations with supporting evidence.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 p-6 transition hover:border-indigo-200 hover:bg-indigo-50/30"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <feature.icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 font-bold">{feature.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="border-y border-slate-100 bg-slate-50 px-4 py-24 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold text-indigo-600">
                  How it works
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  A continuous intelligence loop.
                </h2>

                <p className="mt-5 text-base leading-7 text-slate-600">
                  KnowledgePulse works quietly in the background, turning your
                  existing customer interactions into a recurring source of
                  product intelligence.
                </p>

                <button className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
                  Explore the platform
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  [
                    "Connect",
                    "Your website and internal documents become a searchable knowledge base.",
                  ],
                  [
                    "Converse",
                    "Customers interact with a grounded AI assistant and receive cited answers.",
                  ],
                  [
                    "Understand",
                    "Every question becomes part of an analytics-ready conversation archive.",
                  ],
                  [
                    "Prioritize",
                    "Topics are ranked using volume, growth, confidence deficit and severity.",
                  ],
                  [
                    "Act",
                    "Your team receives evidence-backed recommendations with the original customer questions.",
                  ],
                ].map(([title, text], index) => (
                  <div
                    key={title}
                    className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-indigo-600 px-6 py-16 text-center text-white shadow-2xl shadow-indigo-600/20 sm:px-12">
            <Sparkles className="mx-auto h-7 w-7 text-indigo-200" />

            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Stop letting valuable customer conversations disappear.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
              Turn your conversation archive into a prioritized roadmap for
              your product, documentation and customer experience teams.
            </p>

            <button className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50">
              Get started with KnowledgePulse
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div>
              <a href="#" className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>

                <span className="font-bold tracking-tight">
                  Knowledge<span className="text-indigo-600">Pulse</span>
                </span>
              </a>

              <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
                AI-driven conversational customer intelligence and
                recommendation platform.
              </p>
            </div>

            <div className="flex gap-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Platform
                </p>
                <div className="mt-4 space-y-3">
                  <a className="block text-sm text-slate-500 hover:text-slate-950" href="#product">
                    Product
                  </a>
                  <a className="block text-sm text-slate-500 hover:text-slate-950" href="#insights">
                    Insights
                  </a>
                  <a className="block text-sm text-slate-500 hover:text-slate-950" href="#features">
                    Features
                  </a>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Company
                </p>
                <div className="mt-4 space-y-3">
                  <a className="block text-sm text-slate-500 hover:text-slate-950" href="#">
                    About
                  </a>
                  <a className="block text-sm text-slate-500 hover:text-slate-950" href="#">
                    Contact
                  </a>
                  <a className="block text-sm text-slate-500 hover:text-slate-950" href="#">
                    Privacy
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-400">
              © 2026 KnowledgePulse. Built for customer-driven teams.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
