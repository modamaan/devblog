import { MetadataRoute } from "next"
import { db } from "@/db"
import { posts } from "@/db/schema"
import { sql } from "drizzle-orm"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"

    const publishedPosts = await db
        .select({ slug: posts.slug, updated_at: posts.updated_at })
        .from(posts)
        .where(sql`${posts.published_at} IS NOT NULL`)

    const postEntries: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
        url: `${baseUrl}/${post.slug}`,
        lastModified: post.updated_at,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        ...postEntries,
    ]
}
