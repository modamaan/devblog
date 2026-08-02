import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

// Lightweight auth proxy — uses edge-compatible config (no DB adapter)
// Next.js 16+ uses "proxy" as the middleware file convention
const { auth } = NextAuth(authConfig)

export default auth

export const config = {
  matcher: ["/me/:path*"],
}

export const runtime = "edge"
