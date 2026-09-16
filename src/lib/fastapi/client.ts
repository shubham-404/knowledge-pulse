import { getCurrentUser } from "@/lib/auth";
import { env } from "@/lib/env";
import { getFastAPIUserContext } from "./context";
import { FastApiClientError } from "./errors";

export interface FastApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | null | undefined>;
  user?: {
    id: string;
    email: string;
    organization_id?: string;
  } | null;
  requireTenant?: boolean;
}

/**
 * Server-only fetcher communicating with FastAPI backend.
 * Automatically resolves current user identity and attaches:
 * - X-Organization-Id: <user.organization_id> (primary tenant boundary)
 * - X-User-Id: <MongoDB user ID>
 * - X-User-Email: <User email>
 */
export async function fetchFastApi<T>(
  endpoint: string,
  options: FastApiRequestOptions = {}
): Promise<T> {
  const { body, params, user: explicitUser, headers: customHeaders, requireTenant: explicitRequireTenant, ...restOptions } = options;

  const isHealthCheck = endpoint === "/api/health" || endpoint === "api/health";
  const requireTenant = explicitRequireTenant ?? !isHealthCheck;

  let orgId = explicitUser?.organization_id;
  let userId = explicitUser?.id;
  let userEmail = explicitUser?.email;

  if (requireTenant) {
    if (explicitUser) {
      if (!orgId || orgId.trim() === "") {
        throw new FastApiClientError(
          "Your account is missing an organization identifier. Please contact support.",
          400
        );
      }
    } else {
      const context = await getFastAPIUserContext(false);
      orgId = context.organizationId;
      userId = context.userId;
      userEmail = context.email;
    }
  } else {
    // If tenant context is not strictly required (e.g. /api/health), check if user context is available
    if (!userId || !userEmail) {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          userId = currentUser.id;
          userEmail = currentUser.email;
          if (currentUser.organization_id) {
            orgId = currentUser.organization_id;
          }
        }
      } catch {
        // Allow unauthenticated fallback for health checks
      }
    }
  }

  // Build URL with query params
  const baseUrl = env.fastapiBaseUrl.replace(/\/$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${baseUrl}${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const headers = new Headers(customHeaders);

  // Security: client input/headers must never override server-derived tenant identity
  headers.delete("X-Organization-Id");
  headers.delete("X-User-Id");
  headers.delete("X-User-Email");

  if (orgId) {
    headers.set("X-Organization-Id", orgId.trim());
  }
  if (userId) {
    headers.set("X-User-Id", userId);
  }
  if (userEmail) {
    headers.set("X-User-Email", userEmail);
  }

  let requestBody: BodyInit | undefined;

  if (body !== undefined) {
    if (body instanceof FormData) {
      requestBody = body;
      // Note: do not set Content-Type for FormData so fetch adds multipart boundary
    } else if (typeof body === "string") {
      requestBody = body;
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
    } else {
      requestBody = JSON.stringify(body);
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
    }
  }

  try {
    const response = await fetch(url.toString(), {
      ...restOptions,
      headers,
      body: requestBody,
      cache: "no-store",
    });

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      let errorDetails: unknown;

      try {
        const errorJson = await response.json();
        errorDetails = errorJson;

        if (typeof errorJson?.detail === "string") {
          errorMessage = errorJson.detail;
        } else if (Array.isArray(errorJson?.detail) && errorJson.detail.length > 0) {
          const firstDetail = errorJson.detail[0];
          errorMessage = firstDetail?.msg || JSON.stringify(firstDetail);
        } else if (typeof errorJson?.message === "string") {
          errorMessage = errorJson.message;
        }
      } catch {
        const text = await response.text().catch(() => "");
        if (text) {
          errorMessage = text;
        }
      }

      throw new FastApiClientError(errorMessage, response.status, errorDetails);
    }

    // 204 No Content
    if (response.status === 204) {
      return undefined as unknown as T;
    }

    const data = (await response.json()) as T;
    return data;
  } catch (error) {
    if (error instanceof FastApiClientError) {
      throw error;
    }

    const message =
      error instanceof Error && error.message.includes("fetch failed")
        ? "KnowledgePulse intelligence services are currently unavailable."
        : error instanceof Error
        ? error.message
        : "Failed to connect to KnowledgePulse intelligence services.";

    throw new FastApiClientError(message, 503, error);
  }
}
