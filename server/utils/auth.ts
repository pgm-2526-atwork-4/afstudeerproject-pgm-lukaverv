import jwt from "jsonwebtoken";
import { getToken } from "#auth";
import type { H3Event } from "h3";

/**
 * Get the authenticated user ID from either OAuth session or JWT token.
 * Returns null if no valid authentication found.
 *
 * @param event - H3 event object
 * @returns User ID or null
 */
export async function getAuthUserId(event: H3Event): Promise<string | null> {
  // Try OAuth session first (GitHub/Google login)
  const token = await getToken({ event });
  if (token?.email) {
    const oauthUser = await prisma.user.findUnique({
      where: { email: token.email as string },
      select: { id: true },
    });
    if (oauthUser) return oauthUser.id;
  }

  // Fallback to JWT token (manual email/password login)
  const authToken = getCookie(event, "auth_token");
  if (authToken) {
    try {
      const decoded = jwt.verify(
        authToken,
        process.env.JWT_SECRET || "your-secret-key",
      ) as { id: string };
      return decoded.id;
    } catch {
      // Invalid token
    }
  }

  return null;
}

/**
 * Get the authenticated user ID or throw 401 error.
 *
 * @param event - H3 event object
 * @returns User ID
 * @throws 401 if not authenticated
 */
export async function requireAuthUserId(event: H3Event): Promise<string> {
  const userId = await getAuthUserId(event);
  if (!userId) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  return userId;
}

/**
 * Get profile ID from user ID.
 *
 * @param userId - User ID
 * @returns Profile ID
 * @throws 404 if profile not found
 */
export async function getProfileIdFromUserId(userId: string): Promise<string> {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    throw createError({ statusCode: 404, message: "Profile not found" });
  }

  return profile.id;
}

/**
 * Convenience function to get profile ID from authenticated user.
 * Combines requireAuthUserId + getProfileIdFromUserId.
 *
 * @param event - H3 event object
 * @returns Profile ID
 * @throws 401 if not authenticated, 404 if profile not found
 */
export async function requireAuthProfileId(event: H3Event): Promise<string> {
  const userId = await requireAuthUserId(event);
  return getProfileIdFromUserId(userId);
}
