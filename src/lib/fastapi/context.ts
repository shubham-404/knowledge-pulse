import { getCurrentUser, requireUser } from "@/lib/auth";
import { FastApiClientError } from "./errors";

export interface FastAPIUserContext {
  organizationId: string;
  userId: string;
  email: string;
}

/**
 * Resolves the authenticated user context for tenant-scoped FastAPI requests.
 * Derives organizationId strictly from the authenticated MongoDB user record.
 * Throws a controlled error if organization_id is missing.
 */
export async function getFastAPIUserContext(
  requireAuth: boolean = true
): Promise<FastAPIUserContext> {
  const user = requireAuth ? await requireUser() : await getCurrentUser();

  if (!user) {
    throw new FastApiClientError("Unauthorized. Please log in.", 401);
  }

  if (!user.organization_id || user.organization_id.trim() === "") {
    throw new FastApiClientError(
      "Your account is missing an organization identifier. Please contact support.",
      400
    );
  }

  return {
    organizationId: user.organization_id.trim(),
    userId: user.id,
    email: user.email,
  };
}
