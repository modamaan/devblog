import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

export const { auth: middleware } = NextAuth(authConfig)

export const runtime = "experimental-edge"

export const config = {
    matcher: ["/me/:path*"],
}
