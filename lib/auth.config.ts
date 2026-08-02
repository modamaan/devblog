import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

// Lightweight auth config for Edge middleware — no DB adapter
export const authConfig: NextAuthConfig = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
    ],
    pages: {
        signIn: "/auth/signin",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isProtected = nextUrl.pathname.startsWith("/me")
            if (isProtected) return isLoggedIn
            return true
        },
    },
}
