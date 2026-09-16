# Project Context

This file is the working context for developers and AI coding agents contributing to **KnowledgePulse**.

The purpose is to describe what has already been established, why it was established, and the rules to follow when extending the project.

Read this before making structural changes.

---

## 1. Current foundation

KnowledgePulse has completed:
- **Milestone 1**: Full-stack account, authentication, service selection, and resource onboarding layer.
- **Milestone 2**: Authenticated Intelligence Workspace & FastAPI Backend Integration.
- **Milestone 3**: Organization-based Tenancy Synchronization & Ephemeral Chat Persistence.

Implemented:

- Next.js 16 with App Router + TypeScript
- Tailwind CSS with Material Design 3 (Material You) tokens & styling
- `src/` application directory with `@/*` import alias
- shadcn/ui & Base UI primitives
- React Hook Form + Zod schema validation (Zod 4)
- MongoDB integration via Mongoose with cached connection pooling (`src/lib/db.ts`)
- Mongoose User model with `organization_id` tenancy identifier and safe user projections (`src/models/user.ts`)
- Server-side `org_<UUID>` generation on registration and one-time legacy backfill migration (`pnpm migrate:org`)
- Stateless JWT authentication via `jose` (`kp_session` httpOnly cookie)
- Password hashing & verification with `bcryptjs`
- Server-side auth helpers (`getCurrentUser()`, `requireUser()`, `getFastAPIUserContext()`)
- Server Actions (`src/actions/auth.ts`, `src/actions/user.ts`, `src/actions/intelligence.ts`)
- API Route Handlers (`src/app/api/auth/*`)
- Protected route layout with server-side authentication enforcement (`src/app/(protected)/layout.tsx`)
- Persistent `ChatSessionProvider` mounted in protected layout ensuring in-memory conversation persistence across sibling routes without persistent browser storage
- Nested workspace layout with secondary feature navigation (`src/app/(protected)/(workspace)/layout.tsx`)
- Secondary feature navigation (`src/components/layout/FeatureSubNav.tsx`, `src/data/feature-navigation.json`)
- **FastAPI Integration Layer** (`src/lib/fastapi/`):
  - Type-safe client matching `openapi.json` source of truth
  - Server-enforced tenancy boundary header: `X-Organization-Id: <user.organization_id>`
  - Contextual metadata headers: `X-User-Id: <user._id>`, `X-User-Email: <user.email>`
  - Explicit stripping/overwriting of any client-spoofed tenant headers
  - Controlled application error when authenticated user lacks `organization_id`
  - Server-only execution (`FASTAPI_BASE_URL` in `src/lib/env.ts`, never `NEXT_PUBLIC_*`)
  - Safe error extraction surfacing backend `detail` messages
  - Modular domain helpers: `sources`, `chat`, `overview`, `insights`, `reports`, `analytics`, `evaluation`, `health`
- **6 Core Workspace Feature Surfaces**:
  - **This period** (`/overview`): System overview metrics, activity trends, confidence distribution, analytics batch execution
  - **Insights** (`/insights`, `/insights/[insightId]`): Signal lists, severity/trend indicators, historical chart, evidence links, member queries
  - **Report** (`/report`): Executive briefings, strategic recommendations, report archive
  - **Ask** (`/ask`): Conversational assistant, ephemeral `ChatSessionProvider` connection, collapsible citations, confidence scoring
  - **Sources** (`/sources`): Website and document source registry, index status badges, reindexing, and deletion
  - **Evaluation** (`/evaluation`): Quality metrics (faithfulness, relevancy, latency, cost), failure trace logs
- Recharts visualizations styled with Material You tonal color palettes (`#6750A4`, `#7D5260`, `#49454F`)
- Resilient UI error boundaries, independent loading skeletons, and graceful offline backend status displays
- Vitest unit, component, and action test suite (12 suites, 57 tests)
- Playwright end-to-end browser user journey tests (12 tests covering auth flows, workspace route guards, and chat navigation persistence)
- Environment configuration with centralized access (`src/lib/env.ts`)
- GitHub Actions CI & Docker multi-stage container

Architecture Boundary & Responsibilities:
- Next.js is strictly the presentation, user management, and tenant identification layer.
- Next.js does NOT implement AI/LLM models, embeddings, RAG pipelines, or analytics computation.
- Next.js resolves authenticated tenant identity (`user.organization_id`) and injects `X-Organization-Id` server-side into all FastAPI requests.
- All intelligence operations are delegated to the existing FastAPI backend via the authenticated server-side client.
- No mocks, placeholders, or fake analytics data are used in the application.

---

## 2. Package manager and runtime

The project uses **pnpm**.

Use:

```text
pnpm install
pnpm add <package>
pnpm add -D <package>
pnpm exec <command>
```

Do not switch the project to npm or yarn without an explicit architectural decision.

The repository should keep its `pnpm-lock.yaml` committed.

CI uses a frozen dependency install:

```text
pnpm install --frozen-lockfile
```

The project should keep local and CI Node/pnpm versions aligned.

---

## 3. Application structure

Current structure:

```text
src/
├── actions/                 # Server Actions ('use server') for auth, user, and intelligence mutations
│   ├── auth.ts              # registerUser, loginUser, logoutUser
│   ├── intelligence.ts      # sendChatMessage, createWebsiteSourceAction, uploadDocumentSourceAction, reindex, delete, triggerBatch
│   └── user.ts              # saveSelectedServices, addResourceUrlAction, addDocumentMetadataAction
├── app/                     # Next.js App Router routes and layouts
│   ├── (auth)/              # Unauthenticated routes (/login, /register, /signup)
│   ├── (protected)/         # Protected routes layout enforcing authentication
│   │   ├── (workspace)/     # Nested workspace shell with secondary feature navigation
│   │   │   ├── ask/         # Conversational assistant (/ask)
│   │   │   ├── evaluation/  # System quality & failure evaluation (/evaluation)
│   │   │   ├── insights/    # High-impact signals & details (/insights, /insights/[insightId])
│   │   │   ├── overview/    # System overview & activity metrics (/overview)
│   │   │   ├── report/      # Briefing summaries & recommendations (/report)
│   │   │   ├── sources/     # Unified source registry & indexing (/sources)
│   │   │   └── layout.tsx   # FeatureSubNav navigation layout
│   │   ├── onboarding/      # Service selection & resource setup (/onboarding/resources)
│   │   ├── profile/         # User account settings & profile overview (/profile)
│   │   ├── services/        # Service discovery & multi-selection (/services)
│   │   └── layout.tsx       # Enforces authentication with requireUser()
│   ├── api/auth/            # JSON API route handlers (/login, /register, /logout, /me)
│   ├── layout.tsx           # Root layout with Roboto font & metadata
│   └── page.tsx             # Public landing page with MD3 hero & service overview
├── components/
│   ├── auth/                # Auth form components (LoginForm, RegisterForm)
│   ├── chat/                # Conversational components (ChatWindow, MessageBubble, CitationList, ConfidenceMeter)
│   ├── evaluation/          # Quality metric cards & failure inspection lists
│   ├── insights/            # Insight cards, historical Recharts, evidence links, query lists
│   ├── layout/              # Navigation (Navbar, AuthNav, FeatureSubNav)
│   ├── overview/            # Metric grids, Recharts activity & confidence charts, batch trigger
│   ├── profile/             # ProfileCard, UserAvatar
│   ├── reports/             # Executive briefing cards, recommendations, report archives
│   ├── resources/           # DocumentUploadSection, ResourceUrlSection, ResourceOnboardingView
│   ├── services/            # ServiceCard, ServiceGrid, ServiceFeatureList, ServiceSelector
│   ├── shared/              # PageHeader, EmptyState, ErrorState, BackendStatus, SkeletonPrimitives
│   └── ui/                  # shadcn & Base UI primitives (button, field, input, etc.)
├── data/
│   ├── feature-navigation.json # Canonical configuration for the 6 workspace navigation items
│   └── services.json        # Canonical catalog of the 4 core services
├── lib/
│   ├── auth.ts              # Centralized auth guards (getCurrentUser, requireUser, sessions)
│   ├── db.ts                # Mongoose connection caching utility
│   ├── env.ts               # Centralized environment access (MONGODB_URI, AUTH_SECRET, FASTAPI_BASE_URL)
│   ├── fastapi/             # Server-side FastAPI client layer
│   │   ├── analytics.ts     # Batch trigger client
│   │   ├── chat.ts          # Conversation message dispatch
│   │   ├── client.ts        # Core fetcher injecting X-User-Id & X-User-Email
│   │   ├── errors.ts        # ApiError & error detail normalizers
│   │   ├── evaluation.ts    # Evaluation quality & failure fetching
│   │   ├── health.ts        # FastAPI backend ping & status check
│   │   ├── index.ts         # Centralized export barrel
│   │   ├── insights.ts      # Insight list & detail client
│   │   ├── overview.ts      # Metrics & chart data client
│   │   ├── reports.ts       # Executive reports & recommendations client
│   │   ├── sources.ts       # Website & document source management
│   │   └── types.ts         # TypeScript contracts matching openapi.json
│   ├── formatters.ts        # Value formatting (percentages, confidence, relative time, currency)
│   ├── password.ts          # bcrypt hashing and comparison
│   ├── session.ts           # jose JWT token signing and verification
│   └── validations/         # Zod schemas (auth, services, resources, intelligence)
└── models/
    └── user.ts              # Mongoose User model with toSafeUser() projection
```

Tests:

```text
tests/
├── setup.ts                 # Testing environment setup and WebCrypto polyfills
├── unit/                    # Vitest unit/validation/component tests
└── e2e/                     # Playwright end-to-end browser user journeys
```

Configuration:

```text
vitest.config.mts
playwright.config.ts
next.config.ts
.github/workflows/ci.yml
Dockerfile
.dockerignore
```

Prefer keeping feature code close to the domain it belongs to. Do not turn `lib/`, `components/`, or a generic `utils` file into a dumping ground.

As the application grows, introduce clear feature/domain boundaries rather than placing everything directly under generic folders.

---

## 4. UI conventions

Use shadcn/ui components instead of hand-building common UI patterns.

Current shadcn form usage is based on:

```text
React Hook Form
    ↓
Controller
    ↓
Field
    ↓
FieldLabel / FieldDescription / FieldError
    ↓
Input / Select / Checkbox / etc.
```

The older `Form`, `FormField`, `FormItem`, `FormControl`, and `FormMessage` pattern should not be reintroduced for new forms unless there is a specific compatibility reason.

Use the existing `src/components/ui/*` components generated by shadcn.

When a suitable shadcn component exists, prefer it over adding another UI library.

Keep visual decisions consistent with the existing design system instead of creating one-off styling primitives.

---

## 5. Forms and validation

Form state:

```text
React Hook Form
```

Validation:

```text
Zod
```

Schemas:

```text
src/lib/validations/
```

A typical pattern is:

```text
schema
  ↓
z.infer<typeof schema>
  ↓
useForm<T>({ resolver: zodResolver(schema) })
  ↓
Controller
  ↓
Field
```

Rules:

1. Define validation rules in Zod schemas.
2. Infer TypeScript types from schemas instead of duplicating types manually.
3. Show validation feedback through the shadcn Field components.
4. Keep client validation focused on UX.
5. Validate untrusted input again on the server.
6. Do not assume a browser-side validation rule provides security.

The validation schema is a source of truth for the shape and constraints of submitted data, but server-side authorization and business rules are separate concerns.

---

## 6. Environment configuration

Current environment model:

```text
.env.example
.env.local
.env.production.local
```

`*.local` files are ignored by Git.

`.env.example` contains variable names and safe example values only.

Never commit real credentials.

### Public variables

Only values that are safe for browser exposure may use:

```text
NEXT_PUBLIC_*
```

### Server-only variables

Secrets must not use `NEXT_PUBLIC_`.

Examples:

```text
MONGODB_URI
AUTH_SECRET
FASTAPI_BASE_URL
```

- `MONGODB_URI`: Connection URI for the MongoDB cluster or local instance (e.g., `mongodb://127.0.0.1:27017/knowledge-pulse`).
- `AUTH_SECRET`: Symmetric secret (minimum 32 characters) used to sign and verify stateless session JWTs via `jose` (`HS256`).
- `FASTAPI_BASE_URL`: Base URL for the backend FastAPI intelligence service (e.g., `http://localhost:8000`). Never exposed via `NEXT_PUBLIC_*`.

Do not access secrets or backend service URLs from client components. Always route through Next.js Server Components, Route Handlers, or Server Actions where identity headers (`X-User-Id`, `X-User-Email`) can be securely attached.

Environment access is centralized through:

```text
src/lib/env.ts
```

---

## 7. Testing architecture

There are two independent test runners.

### Vitest

Purpose:

- unit tests
- component tests
- validation tests
- utility tests

Location:

```text
tests/unit/
```

Vitest includes only:

```text
tests/unit/**/*.{test,spec}.{js,ts,jsx,tsx}
```

Do not put Playwright files in the Vitest include path.

### Playwright

Purpose:

- user journeys
- browser integration
- critical end-to-end flows

Location:

```text
tests/e2e/
```

Current browser target:

```text
Chromium
```

Do not add multiple browser projects unless there is a real compatibility requirement. More browsers increase CI time and maintenance cost.

### Test philosophy

Prefer behavior-focused assertions.

Good:

```text
invalid email → validation message appears
```

Less useful:

```text
component contains a specific internal wrapper element
```

Keep tests deterministic. Avoid arbitrary timeouts and sleeps when a semantic assertion can express the expected state.

---

## 8. CI

The workflow is:

```text
push / pull request
        ↓
pnpm install --frozen-lockfile
        ↓
pnpm lint
        ↓
pnpm test
        ↓
Playwright browser installation
        ↓
pnpm test:e2e
        ↓
pnpm build
```

The CI file is:

```text
.github/workflows/ci.yml
```

CI currently exercises Playwright against the development server.

### Planned improvement

Once the Docker/production path is stabilized, CI should preferably run E2E tests against the built production application:

```text
pnpm build
    ↓
pnpm start
    ↓
Playwright
```

That makes CI validate the same application mode that the Docker image runs.

Do not remove existing checks merely to make a workflow faster. Optimize CI only when there is a demonstrated bottleneck.

---

## 9. Docker

Next.js uses:

```ts
output: "standalone"
```

The Dockerfile is a multi-stage build:

```text
base
 ↓
deps
 ↓
builder
 ↓
runner
```

The final runner:

- contains the standalone Next.js runtime
- contains static assets
- exposes port `3000`
- runs as the unprivileged `nextjs` user
- does not include local environment files

Expected local commands:

```text
docker build -t knowledge-pulse:local .
docker run --rm -p 3000:3000 knowledge-pulse:local
```

Do not copy `.env.local` into images.

Do not run the production application as root unless a concrete requirement makes it unavoidable.

Do not add Docker Compose until the project has supporting services that actually need orchestration.

---

## 10. Development vs production

Development:

```text
pnpm dev
```

Production build:

```text
pnpm build
```

Production server:

```text
pnpm start
```

Docker:

```text
docker build ...
docker run ...
```

Do not treat `next dev` as equivalent to production.

When debugging deployment-only issues, reproduce the issue against a production build where possible.

---

## 11. Git workflow

Prefer small, focused commits.

Recommended loop:

```text
change
 ↓
run relevant tests
 ↓
run lint
 ↓
run build when appropriate
 ↓
review git diff
 ↓
commit
 ↓
push
 ↓
CI
```

Do not mix unrelated refactors into a feature commit unless necessary.

Before committing structural changes, verify that no local secrets, build output, or generated artifacts have been added.

---

## 12. Rules for AI coding agents

### Do

- Read `README.md` and this file before making architectural changes.
- Inspect existing code before creating new abstractions.
- Reuse installed dependencies and existing shadcn components.
- Follow the current shadcn Field-based form pattern.
- Put Zod schemas in `src/lib/validations/`.
- Add or update tests for behavior that changes.
- Keep client/server boundaries explicit.
- Preserve the existing package manager and lockfile.
- Keep changes focused and reversible.
- Run the relevant validation commands after changes.
- Explain when an architectural change is necessary rather than silently introducing it.

### Do not

- Do not switch package managers casually.
- Do not reintroduce the older shadcn form API for new work.
- Do not put secrets in source code or `NEXT_PUBLIC_*` variables.
- Do not commit `.env.local` or production credentials.
- Do not add a library when the existing stack already solves the problem.
- Do not create a second validation system without a reason.
- Do not mix Vitest and Playwright test files.
- Do not disable CI checks just to make the pipeline pass.
- Do not rewrite unrelated files during a focused feature change.
- Do not assume browser validation is sufficient for security.
- Do not add infrastructure merely because it may be useful later.

---

## 13. How to introduce a new feature

For a normal feature, use this sequence:

```text
1. Understand the requirement
2. Identify affected route/component/domain
3. Define data and validation rules
4. Implement UI with existing shadcn primitives
5. Implement server-side behavior
6. Validate untrusted input on the server
7. Add unit/component tests
8. Add E2E coverage for important user flows
9. Run lint
10. Run tests
11. Run build when appropriate
12. Review diff
13. Commit
```

For larger features, split the work into smaller checkpoints.

Avoid designing the entire future architecture before the current requirement justifies it.

---

## 14. Known cleanup / next architectural work

Milestone 1 (Application/Account/Onboarding layer) and Milestone 2 (FastAPI Intelligence Workspace Integration) are complete.

Completed in Milestone 2:
- Fully integrated server-side FastAPI client layer (`src/lib/fastapi/`) matching `openapi.json`.
- Automatic session-to-identity header injection (`X-User-Id`, `X-User-Email`).
- Secondary feature navigation (`FeatureSubNav`) linking all 6 workspace areas: This period (`/overview`), Insights (`/insights`), Report (`/report`), Ask (`/ask`), Sources (`/sources`), Evaluation (`/evaluation`).
- Interactive data visualizations with Recharts styled in Material You tonal aesthetics.
- Server Actions for conversational chat, source creation/upload/reindexing/deletion, and analytics batch triggering.
- Graceful offline backend handling and transparent error reporting without crashing.

Future Architectural Phases:
### Milestone 3: Real-Time Streaming & WebSocket Support
- Upgrade chat interaction from request-response to SSE (Server-Sent Events) or WebSocket streaming as backend capabilities expand.
- Real-time indexing status progress bars via background task polling or webhooks.

### Milestone 4: Advanced Visualizations & Exports
- PDF and CSV export pipelines for executive reports and analytics summaries.
- Enhanced drill-downs for evaluation failures and metric historical comparisons.

### Operational Improvements
- Expand Playwright test suite with mocked FastAPI responses for hermetic end-to-end integration tests.
- Transition Playwright CI runs to pre-built Next.js standalone container execution.

---

## 15. Golden rules

```text
Keep the stack small.

Prefer existing project patterns over new abstractions.

Validate at trust boundaries.

Test behavior, not implementation details.

Keep development and production distinct.

Never commit secrets.

Make CI enforce the same quality bar you expect locally.

Add infrastructure because the product needs it, not because the architecture can contain it.
```
