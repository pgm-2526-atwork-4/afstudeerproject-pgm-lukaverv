import { NuxtAuthHandler } from "#auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  providers: [
    // @ts-expect-error Use .default here for it to work during SSR.
    GithubProvider.default({
      clientId: process.env.GITHUB_CLIENT_ID || "your-client-id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "your-client-secret",
    }),
    // @ts-expect-error Use .default here for it to work during SSR.
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID || "your-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "your-client-secret",
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      try {
        if (!user.email) return false;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Create new OAuth user
          await prisma.user.create({
            data: {
              email: user.email,
              provider: account.provider,
              providerId: account.providerAccountId,
              isVerified: true, // OAuth users are auto-verified
            },
          });
        }

        return true;
      } catch (error) {
        console.error("OAuth sign-in error:", error);
        return false;
      }
    },
    async session({ session }: any) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          include: { profile: true },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.hasProfile = !!dbUser.profile;
        }
      }
      return session;
    },
  },
});
