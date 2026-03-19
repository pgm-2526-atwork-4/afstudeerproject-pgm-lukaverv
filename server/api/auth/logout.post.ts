import { getToken } from "#auth";

export default defineEventHandler(async (event) => {
  // Check if user is authenticated via OAuth
  const oauthToken = await getToken({ event });

  if (oauthToken) {
    // OAuth user - NextAuth will handle session clearing client-side
    return { message: "Logged out", authType: "oauth" };
  }

  // JWT user - Clear the JWT cookie used for manual login
  deleteCookie(event, "auth_token", {
    path: "/",
  });

  return { message: "Logged out", authType: "jwt" };
});
