"use server"

import { db } from "@/db"
import { posts, comments, claps, users } from "@/db/schema"
import { eq, desc, sql, and } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { slugify, stripHtml } from "@/lib/utils"
import { revalidatePath } from "next/cache"

// ─── Posts ──────────────────────────────────────────────

export async function getPublishedPosts() {
    const result = await db
        .select({
            id: posts.id,
            slug: posts.slug,
            title: posts.title,
            content_text: posts.content_text,
            author_id: posts.author_id,
            published_at: posts.published_at,
            banner_image: posts.banner_image,
            created_at: posts.created_at,
            views: posts.views,
            author_name: users.name,
            author_image: users.image,
        })
        .from(posts)
        .leftJoin(users, eq(posts.author_id, users.id))
        .where(sql`${posts.published_at} IS NOT NULL`)
        .orderBy(desc(posts.published_at))

    return result
}

export async function getTrendingPosts() {
    const result = await db
        .select({
            id: posts.id,
            slug: posts.slug,
            title: posts.title,
            published_at: posts.published_at,
            views: posts.views,
            author_name: users.name,
            totalClaps: sql<number>`COALESCE(SUM(${claps.count}), 0)`,
        })
        .from(posts)
        .leftJoin(users, eq(posts.author_id, users.id))
        .leftJoin(claps, eq(posts.id, claps.post_id))
        .where(sql`${posts.published_at} IS NOT NULL`)
        .groupBy(posts.id, users.name)
        .orderBy(sql`COALESCE(SUM(${claps.count}), 0) DESC`)
        .limit(5)

    return result
}

export async function getPostBySlug(slug: string) {
    const result = await db
        .select({
            id: posts.id,
            slug: posts.slug,
            title: posts.title,
            content_html: posts.content_html,
            content_text: posts.content_text,
            author_id: posts.author_id,
            published_at: posts.published_at,
            banner_image: posts.banner_image,
            views: posts.views,
            created_at: posts.created_at,
            updated_at: posts.updated_at,
            author_name: users.name,
            author_image: users.image,
        })
        .from(posts)
        .leftJoin(users, eq(posts.author_id, users.id))
        .where(eq(posts.slug, slug))
        .limit(1)

    return result[0] ?? null
}

export async function getPostById(postId: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const result = await db
        .select()
        .from(posts)
        .where(eq(posts.id, postId))
        .limit(1)

    const post = result[0]
    if (!post || post.author_id !== session.user.id) return null
    return post
}

export async function createPost(data: {
    title: string
    content_html: string
    content_text: string
    banner_image?: string
    publish: boolean
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const slug = slugify(data.title) + "-" + Date.now().toString(36)

    const [post] = await db
        .insert(posts)
        .values({
            slug,
            title: data.title,
            content_html: data.content_html,
            content_text: data.content_text,
            author_id: session.user.id,
            banner_image: data.banner_image ?? null,
            published_at: data.publish ? new Date() : null,
        })
        .returning()

    revalidatePath("/")
    return post
}

export async function updatePost(
    postId: string,
    data: {
        title?: string
        content_html?: string
        content_text?: string
        banner_image?: string
        publish?: boolean
    }
) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const updates: Record<string, any> = { updated_at: new Date() }
    if (data.title !== undefined) {
        updates.title = data.title
        // Slug is intentionally NOT updated here — it was set once at creation
        // and must remain stable so that shared/linked URLs continue to work.
    }
    if (data.content_html !== undefined) updates.content_html = data.content_html
    if (data.content_text !== undefined) updates.content_text = data.content_text
    if (data.banner_image !== undefined) updates.banner_image = data.banner_image
    const [existing] = await db
        .select({ published_at: posts.published_at })
        .from(posts)
        .where(eq(posts.id, postId))
        .limit(1)

    if (!existing) throw new Error("Post not found")

    if (data.publish === true && !existing.published_at) {
        updates.published_at = new Date()
    } else if (data.publish === false) {
        updates.published_at = null
    }

    await db.update(posts).set(updates).where(eq(posts.id, postId))
    revalidatePath("/")
    revalidatePath("/me/stories")
}

export async function incrementPostViews(postId: string) {
    try {
        await db
            .update(posts)
            .set({ views: sql`${posts.views} + 1` })
            .where(eq(posts.id, postId))
    } catch (error) {
        console.error("Failed to increment views:", error)
    }
}

export async function getMyPosts() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const result = await db
        .select({
            id: posts.id,
            slug: posts.slug,
            title: posts.title,
            content_text: posts.content_text,
            published_at: posts.published_at,
            created_at: posts.created_at,
            updated_at: posts.updated_at,
            views: posts.views,
        })
        .from(posts)
        .where(eq(posts.author_id, session.user.id))
        .orderBy(desc(posts.updated_at))

    return result
}

export async function deletePost(postId: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    // Verify ownership
    const [post] = await db
        .select({ author_id: posts.author_id })
        .from(posts)
        .where(eq(posts.id, postId))
        .limit(1)

    if (!post || post.author_id !== session.user.id) {
        throw new Error("Not found or not authorized")
    }

    // Delete associated data first, then the post
    await db.delete(claps).where(eq(claps.post_id, postId))
    await db.delete(comments).where(eq(comments.post_id, postId))
    await db.delete(posts).where(eq(posts.id, postId))

    revalidatePath("/")
    revalidatePath("/me/stories")
}

// ─── Comments ───────────────────────────────────────────

export async function getCommentsByPostId(postId: string) {
    const result = await db
        .select({
            id: comments.id,
            content: comments.content,
            created_at: comments.created_at,
            user_id: comments.user_id,
            parent_id: comments.parent_id,
            user_name: users.name,
            user_image: users.image,
        })
        .from(comments)
        .leftJoin(users, eq(comments.user_id, users.id))
        .where(eq(comments.post_id, postId))
        .orderBy(comments.created_at)

    return result
}

export async function addComment(postId: string, content: string, parentId?: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Sign in to comment")

    const [comment] = await db
        .insert(comments)
        .values({
            post_id: postId,
            user_id: session.user.id,
            parent_id: parentId ?? null,
            content,
        })
        .returning()

    revalidatePath("/")
    return comment
}

export async function deleteComment(commentId: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    // Only admin can delete comments
    const user = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1)

    if (!user[0] || user[0].role !== "admin") {
        throw new Error("Only admins can delete comments")
    }

    // Delete child replies first, then the comment
    await db.delete(comments).where(eq(comments.parent_id, commentId))
    await db.delete(comments).where(eq(comments.id, commentId))

    revalidatePath("/")
}

// ─── Likes ──────────────────────────────────────────────

export async function getLikeCount(postId: string): Promise<number> {
    const result = await db
        .select({ total: sql<string>`CAST(COUNT(*) AS TEXT)` })
        .from(claps)
        .where(eq(claps.post_id, postId))

    return parseInt(result[0]?.total ?? "0", 10)
}

export async function hasUserLiked(postId: string): Promise<boolean> {
    const session = await auth()
    if (!session?.user?.id) return false

    const result = await db
        .select({ id: claps.id })
        .from(claps)
        .where(and(eq(claps.post_id, postId), eq(claps.user_id, session.user.id)))
        .limit(1)

    return result.length > 0
}

export async function toggleLike(postId: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Sign in to like")

    const existing = await db
        .select()
        .from(claps)
        .where(and(eq(claps.post_id, postId), eq(claps.user_id, session.user.id)))
        .limit(1)

    if (existing.length > 0) {
        // Unlike
        await db.delete(claps).where(eq(claps.id, existing[0].id))
    } else {
        // Like
        await db.insert(claps).values({
            post_id: postId,
            user_id: session.user.id,
            count: 1,
        })
    }

    revalidatePath("/")
}

// ─── Digital Products ────────────────────────────────────

import { digitalProducts, productOrders } from "@/db/schema"
import { slugify as _slugify } from "@/lib/utils"

export async function getAllDigitalProducts() {
    return db
        .select()
        .from(digitalProducts)
        .where(sql`${digitalProducts.is_active} = true`)
        .orderBy(desc(digitalProducts.created_at))
}

export async function getDigitalProductBySlug(slug: string) {
    const result = await db
        .select()
        .from(digitalProducts)
        .where(eq(digitalProducts.slug, slug))
        .limit(1)
    return result[0] ?? null
}

export async function getAllDigitalProductsAdmin() {
    const session = await auth()
    if (session?.user?.role !== "admin") throw new Error("Unauthorized")
    return db.select().from(digitalProducts).orderBy(desc(digitalProducts.created_at))
}

export async function createDigitalProduct(data: {
    title: string
    description_html: string
    description_text: string
    banner_image?: string
    price: number
    file_url: string
}) {
    const session = await auth()
    if (session?.user?.role !== "admin") throw new Error("Unauthorized")

    const slug = _slugify(data.title) + "-" + Date.now().toString(36)
    const [product] = await db
        .insert(digitalProducts)
        .values({
            slug,
            title: data.title,
            description_html: data.description_html,
            description_text: data.description_text,
            banner_image: data.banner_image ?? null,
            price: data.price,
            file_url: data.file_url,
            created_by: session.user.id!,
        })
        .returning()

    revalidatePath("/store")
    return product
}

export async function updateDigitalProduct(
    id: string,
    data: {
        title?: string
        description_html?: string
        description_text?: string
        banner_image?: string
        price?: number
        file_url?: string
        is_active?: boolean
    }
) {
    const session = await auth()
    if (session?.user?.role !== "admin") throw new Error("Unauthorized")

    const updates: Record<string, unknown> = { updated_at: new Date() }
    if (data.title !== undefined) {
        updates.title = data.title
        updates.slug = _slugify(data.title) + "-" + Date.now().toString(36)
    }
    if (data.description_html !== undefined) updates.description_html = data.description_html
    if (data.description_text !== undefined) updates.description_text = data.description_text
    if (data.banner_image !== undefined) updates.banner_image = data.banner_image
    if (data.price !== undefined) updates.price = data.price
    if (data.file_url !== undefined) updates.file_url = data.file_url
    if (data.is_active !== undefined) updates.is_active = data.is_active

    await db.update(digitalProducts).set(updates).where(eq(digitalProducts.id, id))
    revalidatePath("/store")
    revalidatePath("/admin/products")
}

export async function deleteDigitalProduct(id: string) {
    const session = await auth()
    if (session?.user?.role !== "admin") throw new Error("Unauthorized")

    await db.delete(productOrders).where(eq(productOrders.product_id, id))
    await db.delete(digitalProducts).where(eq(digitalProducts.id, id))
    revalidatePath("/store")
    revalidatePath("/admin/products")
}

export async function getProductOrders(productId: string) {
    const session = await auth()
    if (session?.user?.role !== "admin") throw new Error("Unauthorized")

    return db
        .select()
        .from(productOrders)
        .where(eq(productOrders.product_id, productId))
        .orderBy(desc(productOrders.created_at))
}
