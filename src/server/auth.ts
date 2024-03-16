import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

import { env } from "~/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
    };
    accessToken: string;
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, account, user }) {
        // initial sign in
        if (account && user) return {
            ...token,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            username: account.providerAccountId,
        }

        // sign in
        if (token) return token

        // sign out
        return {}
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.id = token.username as string;
      return session
    }
  },
  providers: [
    SpotifyProvider({
        clientId: env.SPOTIFY_CLIENT_ID,
        clientSecret: env.SPOTIFY_CLIENT_SECRET,
        authorization: {
          url: "https://accounts.spotify.com/authorize",
          params: { scope: "user-read-email user-read-private user-top-read user-read-playback-state user-modify-playback-state" },
        },
    })
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
