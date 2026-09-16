# Organization Integration + Chat Persistence Update

## 1. Purpose

The KnowledgePulse Next.js application has been synchronized with the FastAPI backend to support organization-based tenancy and ephemeral cross-route chat persistence.

The FastAPI backend enforces multi-tenancy via the `X-Organization-Id` request header across all tenant-scoped endpoints (sources, chat, overview, insights, reports, analytics, evaluation). This update ensures that the Next.js application reliably resolves the authenticated tenant identity server-side from MongoDB and propagates it securely on every backend request without relying on or allowing client-controlled organization overrides. Additionally, in-memory chat session persistence ensures conversational continuity across sibling workspace routes without persistent browser storage.

---

## 2. MongoDB User Changes

The MongoDB `User` model (`src/models/user.ts`) has been updated to include an `organization_id` field:

- **Field Name**: `organization_id: string`
- **Schema Attributes**: Required, trimmed, indexed (`index: true`), not unique (for forward compatibility with future multi-user organization models).
- **Safe Projection (`toSafeUser`)**: Includes `organization_id` along with `organization_name`, while strictly redacting sensitive fields (`password`, `verifyCode`, `verifyCodeExpiry`).
- **Generation**: During registration (`registerUser` in `src/actions/auth.ts`), `organization_id` is generated strictly on the server using standard UUID v4 format: `org_<UUID>` (e.g. `org_550e8400-e29b-41d4-a716-446655440000`). It is never accepted from registration form inputs.
- **Existing-User Migration**: A dedicated migration utility (`src/lib/migrations/backfill-organization-ids.ts`) scans existing user records missing `organization_id` or with empty values, assigns a unique `org_<UUID>` to each user, and saves the record.

---

## 3. FastAPI Integration

All tenant-scoped communications between Next.js and the FastAPI backend are routed server-to-server:

- **Environment Variable**: `FASTAPI_BASE_URL` (configured server-side in `src/lib/env.ts` and `.env.example`).
- **Tenancy Boundary Header**: `X-Organization-Id: <user.organization_id>`. This is the single authoritative tenant boundary for data isolation in FastAPI.
- **Contextual Debugging Headers**:
  - `X-User-Id: <user.id>`
  - `X-User-Email: <user.email>`
- **Server-Side Construction**: Headers are constructed strictly within `src/lib/fastapi/client.ts` using the authenticated user context retrieved via `getFastAPIUserContext()` in `src/lib/fastapi/context.ts`. Incoming request headers or client payloads attempting to supply `X-Organization-Id` are explicitly deleted and overridden by the authenticated user's record.
- **Health Check Exception**: `GET /api/health` remains unscoped and does not require tenant headers.

---

## 4. API Client

The centralized server-only client layer (`src/lib/fastapi/`) provides strongly typed helpers for all backend endpoints:

| Helper Function | HTTP Method & Path | Scoped Headers | Description |
| :--- | :--- | :--- | :--- |
| `checkHealth()` | `GET /api/health` | No | Verifies FastAPI connectivity |
| `listSources()` | `GET /api/sources` | Yes | Retrieves registered knowledge sources |
| `createSource(payload)` | `POST /api/sources` | Yes | Registers website or web sources |
| `uploadSource(formData)` | `POST /api/sources/upload` | Yes | Uploads documents as multipart form data |
| `reindexSource(sourceId)` | `POST /api/sources/{sourceId}/reindex` | Yes | Triggers source re-indexing pipeline |
| `deleteSource(sourceId)` | `DELETE /api/sources/{sourceId}` | Yes | Removes source from knowledge base |
| `sendChat(payload)` | `POST /api/chat` | Yes | Queries conversational RAG system |
| `getOverview()` | `GET /api/overview` | Yes | Fetches overview metrics & volume trends |
| `getInsights(period?)` | `GET /api/insights` | Yes | Lists identified customer signals & friction |
| `getInsight(insightId)` | `GET /api/insights/{insightId}` | Yes | Fetches deep-dive insight analysis |
| `getLatestReport()` | `GET /api/reports/latest` | Yes | Retrieves newest executive briefing |
| `getReports()` | `GET /api/reports` | Yes | Retrieves historical report archive |
| `runAnalytics(period?)` | `POST /api/analytics/run` | Yes | Dispatches asynchronous batch analytics |
| `getLatestEvaluation()` | `GET /api/evaluation/latest` | Yes | Retrieves RAG quality evaluation metrics |

---

## 5. Route Changes

All primary workspace views reside under the protected route group and feature persistent secondary navigation:

- `/overview` — Analytics overview, volume charts, batch trigger controls.
- `/insights` — Ranked customer friction topics, query counts, severity indicators.
- `/insights/[id]` — Deep-dive drill-down with history, member queries, and weakest chunks.
- `/report` — Executive summary, key metrics, actionable recommendations, and archived reports.
- `/ask` — Conversational assistant connected to `ChatSessionProvider`.
- `/sources` — Canonical knowledge source management (upload, website registration, reindexing, deletion).
- `/evaluation` — Evaluation scorecard (faithfulness, answer relevance, context relevance, failures).

The persistent `FeatureSubNav` component is rendered inside `src/app/(protected)/(workspace)/layout.tsx` driven by `src/data/feature-navigation.json`.

---

## 6. Chat Persistence

Chat conversation state is managed using an in-memory React Context provider:

- **Provider**: `ChatSessionProvider` (`src/components/chat/ChatSessionProvider.tsx`) is mounted in `src/app/(protected)/layout.tsx`.
- **Protected-Layout Placement**: Because `ChatSessionProvider` wraps the entire protected workspace tree, it remains mounted when navigating between sibling routes (e.g. `/ask` → `/insights` → `/report` → `/ask`).
- **Session ID Behavior**: `sessionId` is generated once upon provider mount using `crypto.randomUUID()` and stays constant across route transitions.
- **Manual Reload Behavior**: A browser reload re-mounts the React tree, resetting `messages` to `[]` and generating a new `sessionId`.
- **No Storage Persistence**: Strictly does **NOT** use `localStorage`, `sessionStorage`, `IndexedDB`, or cookies.
- **Clear Action**: A subtle "New chat" action resets the in-memory message list and assigns a fresh UUID session identifier.

---

## 7. Security

- **Server-Side Identity Truth**: Tenant identity is resolved solely from the authenticated MongoDB user record via `getCurrentUser()` and `getFastAPIUserContext()`.
- **Tamper Resistance**: Client forms, query parameters, and custom request headers cannot spoof or override `organization_id`. Any client-supplied tenant headers are stripped before outgoing dispatch.
- **Missing Organization Handling**: If an authenticated user record lacks `organization_id`, the client returns an immediate application-level error (`"Your account is missing an organization identifier. Please contact support."`) without calling FastAPI.
- **Credential Protection**: Database connection strings, JWT signing keys, and backend URLs are restricted to server execution (`server-only`).

---

## 8. Tests

Comprehensive unit, component, and end-to-end tests validate the implementation:

- **Unit & Component Tests** (`vitest`):
  - `tests/unit/fastapi-client.test.ts`: Verifies outgoing `X-Organization-Id`, `X-User-Id`, and `X-User-Email` headers, rejects client header overrides, verifies missing organization rejection, validates multipart and 204 handling, and tests unscoped `/api/health`.
  - `tests/unit/user-model.test.ts`: Confirms `organization_id` inclusion in safe projections and redaction of password/verification codes.
  - `tests/unit/registration-org.test.ts`: Confirms `org_<UUID>` generation on registration, rejection of spoofed client inputs, and one-time migration backfill logic.
  - `tests/unit/chat-provider.test.tsx`: Verifies `ChatSessionProvider` state retention across consumer unmount/remount, constant `sessionId`, "New chat" reset behavior, and zero access to browser storage APIs.
  - `tests/unit/feature-nav.test.tsx`: Validates 6 workspace navigation items and active route styling.
- **End-to-End Tests** (`playwright`):
  - `tests/e2e/chat-persistence.spec.ts`: Verifies sending chat messages on `/ask`, navigating to `/insights` and back to `/ask` with messages retained, and browser reload resetting the conversation.
  - `tests/e2e/auth-flow.spec.ts`: Tests complete user registration, login, onboarding, and profile display with organization details.
  - `tests/e2e/protected-routes.spec.ts`: Confirms unauthenticated redirection to `/login` across all workspace routes.

---

## 9. Environment

The `.env.example` file and centralized environment parser (`src/lib/env.ts`) specify:

```env
# Backend FastAPI Service (Server-Side Only - never expose via NEXT_PUBLIC_)
FASTAPI_BASE_URL=http://localhost:8000
```

---

## 10. Migration

To assign `organization_id` to existing MongoDB users created prior to tenant isolation:

Execute the migration script:
```bash
pnpm migrate:org
```

The script connects to the database specified in `MONGODB_URI`, identifies any user documents where `organization_id` is missing or empty, generates an individual `org_<UUID>` for each, and saves the updated documents without modifying existing passwords, accounts, or services.

---

## 11. Current Limitation

- **One User Per Organization**: Current tenancy maps one user to one organization (`1 user = 1 organization_id`). Multi-user organizations and invitation mechanisms are intentionally deferred to future milestones.
- **FastAPI Tenancy Scope**: All FastAPI vector retrieval, ingestion, conversations, and analytics are isolated strictly by `X-Organization-Id`.
- **Ephemeral Client Chat**: Chat conversations are maintained in React state during active client navigation but intentionally clear upon full browser page refresh.
