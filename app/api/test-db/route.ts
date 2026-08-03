import { NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { sql } from "drizzle-orm"

export async function GET() {
    try {
        // Test database connection
        const dbResult = await db.select({ count: sql`count(*)` }).from(users)
        
        return NextResponse.json({
            status: "success",
            database: "connected",
            userCount: dbResult[0]?.count,
            env: {
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                hasAuthSecret: !!process.env.AUTH_SECRET,
                hasAuthTrustHost: !!process.env.AUTH_TRUST_HOST,
                hasGoogleId: !!process.env.AUTH_GOOGLE_ID,
            }
        })
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: error.message,
            stack: error.stack,
            env: {
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                hasAuthSecret: !!process.env.AUTH_SECRET,
                hasAuthTrustHost: !!process.env.AUTH_TRUST_HOST,
                hasGoogleId: !!process.env.AUTH_GOOGLE_ID,
            }
        }, { status: 500 })
    }
}
