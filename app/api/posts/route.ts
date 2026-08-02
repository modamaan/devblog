import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { posts, users } from "@/db/schema"
import { eq, desc, sql } from "drizzle-orm"
import { slugify, stripHtml } from "@/lib/utils"
import { revalidatePath } from "next/cache"

// ─── Auth helper ─────────────────────────────────────────────────────────────

/**
 * Validates the Bearer token in the Authorization header against the
 * API_SECRET_KEY environment variable.  Returns the admin user from the DB so
 * posts are attributed to the correct author.
 */
async function authenticate(request: NextRequest) {
    const apiKey = process.env.API_SECRET_KEY
    if (!apiKey) {
        return { error: "API_SECRET_KEY is not configured on the server", status: 500 }
    }

    const authHeader = request.headers.get("authorization") ?? ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null

    if (!token || token !== apiKey) {
        return { error: "Unauthorized — provide a valid Bearer token", status: 401 }
    }

    // Look up the admin user to use as author_id
    const [admin] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.role, "admin"))
        .limit(1)

    if (!admin) {
        return { error: "No admin user found in the database", status: 500 }
    }

    return { userId: admin.id }
}

// ─── GET /api/posts ───────────────────────────────────────────────────────────
// Public — returns all published posts (id, slug, title, published_at, views).

export async function GET() {
    const result = await db
        .select({
            id: posts.id,
            slug: posts.slug,
            title: posts.title,
            published_at: posts.published_at,
            views: posts.views,
            created_at: posts.created_at,
            updated_at: posts.updated_at,
        })
        .from(posts)
        .where(sql`${posts.published_at} IS NOT NULL`)
        .orderBy(desc(posts.published_at))

    return NextResponse.json({ posts: result })
}

// ─── POST /api/posts ──────────────────────────────────────────────────────────
// Protected — requires Authorization: Bearer <API_SECRET_KEY>
//
// Request body (JSON):
// {
//   "title":        string  (required)
//   "content_html": string  (required)
//   "content_text": string  (optional — stripped from content_html if omitted)
//   "banner_image": string  (optional URL)
//   "publish":      boolean (default: true)
// }

export async function POST(request: NextRequest) {
    // 1. Authenticate
    const auth = await authenticate(request)
    if ("error" in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    // 2. Parse + validate body
    let body: Record<string, unknown>
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const { title, content_html, content_text, banner_image, publish = true } = body

    if (!title || typeof title !== "string" || !title.trim()) {
        return NextResponse.json({ error: "title is required" }, { status: 422 })
    }
    if (!content_html || typeof content_html !== "string" || !content_html.trim()) {
        return NextResponse.json({ error: "content_html is required" }, { status: 422 })
    }

    // Derive plain text from HTML if caller omitted it
    const resolvedText =
        typeof content_text === "string" && content_text.trim()
            ? content_text
            : stripHtml(content_html)

    // 3. Build slug  (title-slug + base-36 timestamp for uniqueness)
    const slug = slugify(title.trim()) + "-" + Date.now().toString(36)

    // 4. Insert post
    const [post] = await db
        .insert(posts)
        .values({
            slug,
            title: title.trim(),
            content_html,
            content_text: resolvedText,
            author_id: auth.userId,
            banner_image: typeof banner_image === "string" ? banner_image : null,
            published_at: publish ? new Date() : null,
        })
        .returning()

    revalidatePath("/")

    return NextResponse.json({ post }, { status: 201 })
}
