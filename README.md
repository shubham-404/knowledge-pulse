# KnowledgePulse

A Next.js application foundation built with a modern, test-first workflow and a clear separation between development and production.

The project is intentionally kept small at the foundation level. The goal is to make future features easy to build, test, review, and deploy without turning the codebase into a collection of unnecessary tools.

## Stack

- **Next.js** — App Router + TypeScript
- **Tailwind CSS** — styling
- **shadcn/ui** — UI components, using the current Field-based form approach
- **Base UI** — component primitives
- **React Hook Form** — form state
- **Zod** — schema validation and inferred types
- **Vitest + Testing Library** — unit/component tests
- **Playwright** — end-to-end browser tests
- **GitHub Actions** — CI on push and pull request
- **Docker** — production container
- **pnpm** — package manager

## Project structure

```text
knowledge-pulse/
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
├── src/
│   ├── app/                    # Next.js routes and layouts
│   ├── components/
│   │   └── ui/                 # shadcn-generated UI primitives
│   └── lib/
│       ├── validations/        # Zod schemas
│       └── env.ts              # application environment access
├── tests/
│   ├── setup.ts
│   ├── unit/                   # Vitest tests
│   └── e2e/                    # Playwright tests
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── next.config.ts
├── package.json
├── playwright.config.ts
├── pnpm-lock.yaml
└── vitest.config.mts
```

## Getting started

### Prerequisites

Install:

- Node.js 24 LTS (or the version pinned by the project configuration)
- pnpm
- Docker Desktop, if you want to build/run the production container

Check your tools:

```powershell
node -v
pnpm -v
docker --version
docker compose version
```

### Install dependencies

```powershell
pnpm install
```

### Environment

Copy the example environment file into a local environment file:

```powershell
Copy-Item .env.example .env.local
```

`.env.local` is for local development and must not be committed.

At the moment the project only needs basic application configuration. More secrets can be added later as features such as authentication or a database are introduced.

### Start development

```powershell
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Useful commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Start the Next.js development server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run unit/component tests once |
| `pnpm test:watch` | Run Vitest in watch mode |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm test:e2e:ui` | Open Playwright UI mode |
| `pnpm build` | Create a production Next.js build |
| `pnpm start` | Run the production build locally |
| `pnpm docker:build` | Build the production Docker image |
| `pnpm docker:run` | Run the production Docker image |

## How the application is built

The project follows a layered approach:

```text
UI
 ↓
shadcn/ui + Base UI
 ↓
React Hook Form
 ↓
Zod schema
 ↓
server/API logic
 ↓
data/services
```

The exact lower layers will grow as features are added. Validation should remain explicit at trust boundaries.

### Forms

Use this pattern for forms:

```text
Zod schema
    ↓
React Hook Form
    ↓
Controller
    ↓
shadcn Field
    ↓
Input / Select / Checkbox / ...
```

Validation rules belong in `src/lib/validations/` rather than being duplicated across components.

Client-side validation improves UX, but it is **not** a security boundary. Untrusted data must also be validated on the server.

## Testing strategy

There are two test layers.

### Unit/component tests

Use **Vitest + Testing Library** for fast tests around:

- components
- validation logic
- utility functions
- small isolated behaviors

These live under:

```text
tests/unit/
```

### End-to-end tests

Use **Playwright** for browser-level flows that verify the application as a user would experience it.

These live under:

```text
tests/e2e/
```

Vitest is configured to include only `tests/unit/**`, so it will not try to execute Playwright tests.

## Development vs production

Development and production are intentionally different environments.

### Development

```text
pnpm dev
    ↓
Next.js development server
    ↓
.env.local
```

Use this for daily development, hot reload, debugging, and rapid iteration.

### Production

```text
pnpm build
    ↓
Next.js production build
    ↓
pnpm start
```

The production Docker image uses the same production build path.

Next.js is configured with:

```ts
output: "standalone"
```

This produces a self-contained runtime under `.next/standalone`, allowing the final Docker image to contain only what is needed to run the application.

## Environment variables

Use:

```text
.env.example          committed template
.env.local            local development, ignored
.env.production.local local production testing, ignored
```

General rule:

- `NEXT_PUBLIC_*` values are allowed in browser code and must be safe to expose.
- Secrets such as database credentials, auth secrets, API keys, and private tokens must remain server-side.
- Never commit real credentials.

The project exposes application environment values through `src/lib/env.ts` so environment access stays centralized.

## CI workflow

Every push and pull request runs GitHub Actions.

The current pipeline is:

```text
push / pull request
        ↓
pnpm install --frozen-lockfile
        ↓
lint
        ↓
unit tests
        ↓
Playwright E2E
        ↓
production build
```

The CI job uses a fixed Node/pnpm toolchain and the committed `pnpm-lock.yaml` so dependency installation is reproducible.

## Docker

The project uses a multi-stage production Docker build:

```text
base
 ↓
dependencies
 ↓
builder
 ↓
runner
```

The final runtime image:

- does not contain the full development toolchain
- uses Next.js standalone output
- runs as the unprivileged `nextjs` user
- exposes port `3000`

Build it with:

```powershell
docker build -t knowledge-pulse:local .
```

Run it with:

```powershell
docker run --rm -p 3000:3000 knowledge-pulse:local
```

Then visit `http://localhost:3000`.

## Recommended development workflow

Use this loop for feature work:

```text
1. Understand the requirement
        ↓
2. Plan the change
        ↓
3. Implement the smallest useful slice
        ↓
4. Add/update tests
        ↓
5. Run lint + unit tests
        ↓
6. Run E2E when the user flow changes
        ↓
7. Run a production build for significant changes
        ↓
8. Review the diff
        ↓
9. Commit a focused change
        ↓
10. Push and let CI verify it again
```

For larger features, prefer small checkpoints instead of one very large change.

## Points to consider

### Keep the stack small

Do not add a new library just because it is popular. First check whether Next.js, TypeScript, shadcn/ui, React Hook Form, Zod, or the existing tooling already solves the problem.

### Keep validation centralized

Create reusable Zod schemas instead of duplicating rules across components, API handlers, and services.

### Keep client and server boundaries explicit

Do not put server secrets in client components or expose them through `NEXT_PUBLIC_*` variables.

### Test behavior, not implementation details

Prefer tests such as:

```text
"submitting an invalid email shows an error"
```

over tests that depend on internal component structure.

### Avoid premature infrastructure

Add tools such as Docker Compose, databases, Redis, background workers, or extra browser projects when the application actually needs them.

### Keep CI aligned with local development

A command that passes locally should ideally be reproducible in CI using the same package manager and lockfile.

## Current status

The project currently provides the application foundation:

- Next.js + TypeScript + App Router
- Tailwind CSS
- shadcn/ui + Base UI
- React Hook Form + Zod
- Vitest + Testing Library
- Playwright
- environment configuration
- GitHub Actions CI
- production Docker image

Feature-specific business logic, authentication, databases, external services, and deployment infrastructure have **not** been added yet.

## Before adding a new feature

Read [`CONTEXT.md`](./CONTEXT.md) first. It contains the project conventions, implementation decisions, and guardrails that should be followed by developers and AI coding agents.
