// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchFastApi } from "@/lib/fastapi/client";
import { FastApiClientError, normalizeApiError } from "@/lib/fastapi/errors";

describe("FastAPI Client Layer & Tenant Isolation", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("attaches X-Organization-Id, X-User-Id, and X-User-Email headers when user context is supplied", async () => {
    let capturedHeaders: Headers | undefined;

    global.fetch = vi.fn().mockImplementation(async (_url, options) => {
      capturedHeaders = options.headers as Headers;
      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });

    await fetchFastApi("/api/overview", {
      user: {
        id: "user_alpha_123",
        email: "alpha@example.com",
        organization_id: "org_alpha_uuid_456",
      },
    });

    expect(capturedHeaders?.get("X-Organization-Id")).toBe("org_alpha_uuid_456");
    expect(capturedHeaders?.get("X-User-Id")).toBe("user_alpha_123");
    expect(capturedHeaders?.get("X-User-Email")).toBe("alpha@example.com");
  });

  it("prevents tenant override: client-supplied X-Organization-Id is strictly overwritten by authentic user context", async () => {
    let capturedHeaders: Headers | undefined;

    global.fetch = vi.fn().mockImplementation(async (_url, options) => {
      capturedHeaders = options.headers as Headers;
      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });

    // An attacker attempts to inject X-Organization-Id: org_other in custom headers
    await fetchFastApi("/api/sources", {
      headers: {
        "X-Organization-Id": "org_attacker_impostor",
      },
      user: {
        id: "user_789",
        email: "legit@example.com",
        organization_id: "org_legit_tenant_111",
      },
    });

    expect(capturedHeaders?.get("X-Organization-Id")).toBe("org_legit_tenant_111");
    expect(capturedHeaders?.get("X-Organization-Id")).not.toBe("org_attacker_impostor");
  });

  it("rejects without calling FastAPI when an authenticated user is missing organization_id", async () => {
    const fetchSpy = vi.fn();
    global.fetch = fetchSpy;

    await expect(
      fetchFastApi("/api/insights", {
        user: {
          id: "user_missing_org",
          email: "noorg@example.com",
          organization_id: "", // missing/empty
        },
      })
    ).rejects.toThrow("Your account is missing an organization identifier. Please contact support.");

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("allows unscoped GET /api/health without requiring organization_id", async () => {
    let capturedHeaders: Headers | undefined;

    global.fetch = vi.fn().mockImplementation(async (_url, options) => {
      capturedHeaders = options.headers as Headers;
      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });

    const health = await fetchFastApi<{ status: string }>("/api/health");

    expect(health.status).toBe("ok");
    expect(capturedHeaders?.has("X-Organization-Id")).toBe(false);
  });

  it("appends query parameters correctly", async () => {
    let capturedUrl = "";

    global.fetch = vi.fn().mockImplementation(async (url) => {
      capturedUrl = String(url);
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });

    await fetchFastApi("/api/insights", {
      user: { id: "u1", email: "u1@test.com", organization_id: "org_1" },
      params: { period: "2026-W37" },
    });

    expect(capturedUrl).toContain("/api/insights?period=2026-W37");
  });

  it("handles POST with multipart/FormData without overriding Content-Type", async () => {
    let capturedBody: unknown;
    let capturedHeaders: Headers | undefined;

    global.fetch = vi.fn().mockImplementation(async (_url, options) => {
      capturedBody = options.body;
      capturedHeaders = options.headers as Headers;
      return new Response(JSON.stringify({ id: "src_1", status: "pending" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });

    const formData = new FormData();
    formData.append("file", new Blob(["sample text"], { type: "text/plain" }), "test.txt");

    await fetchFastApi("/api/sources/upload", {
      method: "POST",
      body: formData,
      user: { id: "u1", email: "u1@test.com", organization_id: "org_1" },
    });

    expect(capturedBody).toBe(formData);
    expect(capturedHeaders?.get("X-Organization-Id")).toBe("org_1");
    // Ensure manual application/json Content-Type was not added for multipart
    expect(capturedHeaders?.get("Content-Type")).toBeNull();
  });

  it("handles 204 No Content response gracefully", async () => {
    global.fetch = vi.fn().mockImplementation(async () => {
      return new Response(null, { status: 204 });
    });

    const result = await fetchFastApi("/api/sources/123", {
      method: "DELETE",
      user: { id: "u1", email: "u1@test.com", organization_id: "org_1" },
    });

    expect(result).toBeUndefined();
  });

  it("extracts FastAPI detail string on non-2xx response", async () => {
    global.fetch = vi.fn().mockImplementation(async () => {
      return new Response(JSON.stringify({ detail: "No report yet. Run analytics first." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    });

    await expect(
      fetchFastApi("/api/reports/latest", {
        user: { id: "u1", email: "u1@test.com", organization_id: "org_1" },
      })
    ).rejects.toThrow("No report yet. Run analytics first.");
  });

  it("normalizes errors to human-readable ApiError format", () => {
    const error = new FastApiClientError("Resource not found", 404);
    const normalized = normalizeApiError(error);

    expect(normalized.message).toBe("Resource not found");
    expect(normalized.status).toBe(404);
  });
});
