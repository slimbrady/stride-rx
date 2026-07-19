import NextAuth from "next-auth";

const stravaProvider = {
  id: "strava",
  name: "Strava",
  type: "oauth" as const,
  authorization: {
    url: "https://www.strava.com/oauth/authorize",
    params: { scope: "read,activity:read_all", response_type: "code" },
  },
  token: "https://www.strava.com/oauth/token",
  userinfo: "https://www.strava.com/api/v3/athlete",
  clientId: process.env.STRAVA_CLIENT_ID!,
  clientSecret: process.env.STRAVA_CLIENT_SECRET!,
  profile(profile: any) {
    return {
      id: String(profile.id),
      name: `${profile.firstname} ${profile.lastname}`,
      email: null,
      image: profile.profile,
      stravaId: profile.id,
    };
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [process.env.STRAVA_CLIENT_ID ? stravaProvider : undefined].filter(Boolean) as any,
  trustHost: true,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.stravaAccessToken = account.access_token;
        token.stravaRefreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).stravaAccessToken = token.stravaAccessToken;
      return session;
    },
  },
});
