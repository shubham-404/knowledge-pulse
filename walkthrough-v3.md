# Walkthrough: Organization-Based Tenancy & Ephemeral Chat Persistence

We have updated the KnowledgePulse Next.js application to synchronize with the FastAPI backend's organization-based tenancy model and implemented ephemeral client-side chat persistence.

## Summary of Changes

### 1. MongoDB Schema & Safe Projection
- Added `organization_id: string` to `src/models/user.ts` (required, trimmed, indexed, not unique).
- Updated `toSafeUser()` to expose `organization_id` while redacting passwords and verification codes.
- Updated `registerUser` in `src/actions/auth.ts` to generate `org_<UUID>` on the server using `crypto.randomUUID()`. Registration form inputs cannot provide or spoof `organization_id`.

### 2. Migration Utility
- Created `src/lib/migrations/backfill-organization-ids.ts` and `scripts/migrate-organization-id.ts`.
- Added `pnpm migrate:org` command to `package.json` to assign unique `org_<UUID>` identifiers to existing legacy users.

### 3. FastAPI Client & Tenancy Headers
- Created `getFastAPIUserContext()` in `src/lib/fastapi/context.ts` to resolve `organizationId`, `userId`, and `email` from the authenticated user.
- Updated `src/lib/fastapi/client.ts` to automatically inject `X-Organization-Id`, `X-User-Id`, and `X-User-Email` into all tenant-scoped outgoing requests.
- Explicitly stripped and overrode any client-spoofed `X-Organization-Id` headers.
- Returned a controlled error (`"Your account is missing an organization identifier. Please contact support."`) if an authenticated user lacks `organization_id`.
- Kept `/api/health` unscoped.

### 4. Ephemeral Chat Persistence
- Created `ChatSessionProvider` (`src/components/chat/ChatSessionProvider.tsx`) as a lightweight client-side context.
- Mounted `ChatSessionProvider` in `src/app/(protected)/layout.tsx` so conversation state persists across route navigation between `/ask`, `/insights`, `/report`, `/overview`, `/sources`, and `/evaluation`.
- Initialized `sessionId` once via `crypto.randomUUID()`.
- Added a "New chat" button to `ChatWindow.tsx` for explicit resets.
- Confirmed full page refresh recreates the React tree and clears messages without using `localStorage`, `sessionStorage`, `IndexedDB`, or cookies.

### 5. Profile & UI Updates
- Updated `src/components/profile/ProfileCard.tsx` to display organization details.
- Updated `src/components/overview/AnalyticsRunControl.tsx` with clear status feedback.

---

## Verification Results

### Automated Tests
1. **ESLint (`pnpm lint`)**: 0 errors, 0 warnings.
2. **Vitest Unit & Component Tests (`pnpm test`)**: 12 test suites, 57 tests passed.
3. **Playwright E2E Tests (`pnpm test:e2e`)**: 12 tests passed, including `tests/e2e/chat-persistence.spec.ts`.
4. **Production Build (`pnpm build`)**: Turbopack production build succeeded.

### Live FastAPI Integration
- Verified running FastAPI backend on `http://127.0.0.1:8000`:
  - `GET /api/overview` with `X-Organization-Id`: HTTP 200.
  - `GET /api/overview` without `X-Organization-Id`: HTTP 400 (`X-Organization-Id header is required.`).
  - `POST /api/chat` with `X-Organization-Id`: HTTP 200.
  - `POST /api/chat` without `X-Organization-Id`: HTTP 400.
  - `GET /api/sources`: HTTP 200.
