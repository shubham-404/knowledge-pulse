// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { registerUser } from "@/actions/auth";
import { backfillOrganizationIds } from "@/lib/migrations/backfill-organization-ids";
import { User } from "@/models/user";

// Mock database and session
vi.mock("@/lib/db", () => ({
  connectToDatabase: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/auth", () => ({
  createSession: vi.fn().mockResolvedValue(undefined),
  clearSession: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/password", () => ({
  hashPassword: vi.fn().mockResolvedValue("hashed_test_password"),
  verifyPassword: vi.fn().mockResolvedValue(true),
}));

describe("Registration & Organization ID Generation", () => {
  it("generates an org_<UUID> on the server during registration and ignores client inputs", async () => {
    const captured: { params: { organization_id?: string; email?: string } | null } = {
      params: null,
    };

    vi.spyOn(User, "findOne").mockResolvedValue(null);
    vi.spyOn(User, "create").mockImplementation(async (params: unknown) => {
      const doc = params as { organization_id?: string; email?: string };
      captured.params = doc;
      return {
        _id: "mock_user_id_123",
        email: doc.email,
        organization_id: doc.organization_id,
      } as unknown as Awaited<ReturnType<typeof User.create>>;
    });

    const result = await registerUser({
      name: "Tenant Admin",
      email: "tenant.admin@acme.corp",
      organization_name: "Acme Corporation",
      password: "StrongPassword123!",
      confirmPassword: "StrongPassword123!",
      terms: true,
      // Client attempting to pass custom organization_id (not in schema)
      ...({ organization_id: "org_attacker_spoofed" } as Record<string, unknown>),
    });

    expect(result.success).toBe(true);
    expect(captured.params).not.toBeNull();

    const assignedOrgId = captured.params?.organization_id;
    expect(assignedOrgId).toBeDefined();
    expect(assignedOrgId).not.toBe("org_attacker_spoofed");
    // Matches org_<UUID> pattern
    expect(assignedOrgId).toMatch(
      /^org_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it("backfillOrganizationIds updates users missing organization_id with distinct org_<UUID> values", async () => {
    const mockUser1 = {
      _id: "u_1",
      organization_id: undefined as string | undefined,
      save: vi.fn().mockResolvedValue(true),
    };
    const mockUser2 = {
      _id: "u_2",
      organization_id: "",
      save: vi.fn().mockResolvedValue(true),
    };

    vi.spyOn(User, "find").mockResolvedValue([mockUser1, mockUser2] as unknown as Awaited<ReturnType<typeof User.find>>);

    const migrationResult = await backfillOrganizationIds();

    expect(migrationResult.totalScanned).toBe(2);
    expect(migrationResult.updatedCount).toBe(2);
    expect(mockUser1.organization_id).toMatch(/^org_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    expect(mockUser2.organization_id).toMatch(/^org_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    expect(mockUser1.organization_id).not.toBe(mockUser2.organization_id);
    expect(mockUser1.save).toHaveBeenCalled();
    expect(mockUser2.save).toHaveBeenCalled();
  });
});
