import { backfillOrganizationIds } from "../src/lib/migrations/backfill-organization-ids";
import mongoose from "mongoose";

async function run() {
  console.log("Starting organization_id backfill migration for existing users...");
  try {
    const result = await backfillOrganizationIds();
    console.log(`Migration complete!`);
    console.log(`- Total users scanned missing organization_id: ${result.totalScanned}`);
    console.log(`- Successfully updated: ${result.updatedCount}`);
    if (result.errors.length > 0) {
      console.error(`- Encountered ${result.errors.length} errors:`, result.errors);
    }
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
