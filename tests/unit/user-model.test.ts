import { describe, expect, it } from "vitest";
import { toSafeUser } from "@/models/user";

describe("User Model Safe Projection & Organization Tenancy", () => {
  it("preserves organization_id while never exposing password or verification code in safe user output", () => {
    const rawUser = {
      _id: "650000000000000000000001",
      name: "Alice Johnson",
      email: "alice@acme.com",
      organization_name: "Acme Analytics",
      organization_id: "org_550e8400-e29b-41d4-a716-446655440000",
      password: "$2a$10$verysecretpasswordhash",
      verifyCode: "829104",
      verifyCodeExpiry: new Date(Date.now() + 3600000),
      isVerified: true,
      subscription: "active" as const,
      services: ["docs-mismatch", "chatbot"],
      documents: [
        {
          id: "doc-1",
          name: "Guide.pdf",
          addedAt: new Date(),
        },
      ],
      resources: [
        {
          id: "res-1",
          title: "Docs site",
          url: "https://docs.acme.com",
          addedAt: new Date(),
        },
      ],
    };

    const safe = toSafeUser(rawUser);

    expect(safe.id).toBe("650000000000000000000001");
    expect(safe.name).toBe("Alice Johnson");
    expect(safe.email).toBe("alice@acme.com");
    expect(safe.organization_name).toBe("Acme Analytics");
    expect(safe.organization_id).toBe("org_550e8400-e29b-41d4-a716-446655440000");
    expect(safe.isVerified).toBe(true);
    expect(safe.subscription).toBe("active");
    expect(safe.services).toEqual(["docs-mismatch", "chatbot"]);
    expect(safe.documents).toHaveLength(1);
    expect(safe.resources).toHaveLength(1);

    // Verify secret fields are stripped
    expect("password" in safe).toBe(false);
    expect("verifyCode" in safe).toBe(false);
    expect("verifyCodeExpiry" in safe).toBe(false);
  });

  it("safely defaults organization_id to empty string when missing on legacy unmigrated record", () => {
    const rawUser = {
      _id: "650000000000000000000002",
      name: "Bob Legacy",
      email: "bob@legacy.com",
      organization_name: "Legacy Org",
      password: "hash",
    };

    const safe = toSafeUser(rawUser);
    expect(safe.organization_id).toBe("");
  });
});
