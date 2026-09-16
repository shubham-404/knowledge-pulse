import crypto from "crypto";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user";

export interface MigrationResult {
  totalScanned: number;
  updatedCount: number;
  errors: Array<{ userId: string; error: string }>;
}

/**
 * One-time server-side migration utility to backfill missing organization_id for existing users.
 * Does NOT run automatically on every request.
 */
export async function backfillOrganizationIds(): Promise<MigrationResult> {
  await connectToDatabase();

  const usersMissingOrg = await User.find({
    $or: [
      { organization_id: { $exists: false } },
      { organization_id: null },
      { organization_id: "" },
    ],
  });

  const result: MigrationResult = {
    totalScanned: usersMissingOrg.length,
    updatedCount: 0,
    errors: [],
  };

  for (const user of usersMissingOrg) {
    try {
      const newOrgId = `org_${crypto.randomUUID()}`;
      user.organization_id = newOrgId;
      await user.save();
      result.updatedCount++;
    } catch (err) {
      result.errors.push({
        userId: user._id.toString(),
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return result;
}
