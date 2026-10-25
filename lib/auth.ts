import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    access_type: "offline",
                    response_type: "code",
                    prompt: "consent",
                    scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account?.refresh_token) {
                token.refreshToken = account.refresh_token;
            }

            return token;
        },
    },
};
