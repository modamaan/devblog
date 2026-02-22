import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getPostBySlug, getLikeCount, hasUserLiked, incrementPostViews } from "@/lib/actions"
import { BlogPostingJsonLd } from "@/components/json-ld"
import { ClapButton } from "@/components/clap-button"
import { CommentSection } from "@/components/comment-section"
import { ShareButton } from "@/components/share-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { formatDate, readingTime } from "@/lib/utils"

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const post = await getPostBySlug(slug)
    if (!post) return { title: "Post not found" }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
    const description = post.content_text?.slice(0, 160) ?? ""

    return {
        title: post.title,
        description,
        openGraph: {
            title: post.title,
            description,
            type: "article",
            publishedTime: post.published_at?.toISOString(),
            modifiedTime: post.updated_at?.toISOString(),
            authors: [post.author_name ?? ""],
            ...(post.banner_image && { images: [post.banner_image] }),
            url: `${baseUrl}/${post.slug}`,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description,
            ...(post.banner_image && { images: [post.banner_image] }),
        },
        alternates: {
            canonical: `${baseUrl}/${post.slug}`,
        },
    }
}

export default async function PostPage({ params }: PageProps) {
    const { slug } = await params
    const post = await getPostBySlug(slug)
    if (!post) notFound()

    const [likeCount, userLiked] = await Promise.all([
        getLikeCount(post.id),
        hasUserLiked(post.id),
        incrementPostViews(post.id),
    ])
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"

    return (
        <>
            <BlogPostingJsonLd
                title={post.title}
                description={post.content_text?.slice(0, 160) ?? ""}
                authorName={post.author_name ?? "Unknown"}
                datePublished={post.published_at?.toISOString() ?? post.created_at.toISOString()}
                dateModified={post.updated_at?.toISOString()}
                image={post.banner_image ?? undefined}
                url={`${baseUrl}/${post.slug}`}
            />

            <article className="mx-auto max-w-[680px] px-4 py-10">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="mb-4 font-sans text-[2.5rem] font-extrabold leading-[1.15] tracking-tight text-neutral-900">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={post.author_image ?? ""} />
                            <AvatarFallback>
                                {post.author_name?.charAt(0)?.toUpperCase() ?? "A"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium text-neutral-900">
                                {post.author_name}
                            </p>
                            <p className="text-sm text-neutral-500">
                                {post.published_at && formatDate(post.published_at)} ·{" "}
                                {readingTime(post.content_text ?? "")} ·{" "}
                                {post.views} views
                            </p>
                        </div>
                    </div>
                </header>

                {/* Banner */}
                {post.banner_image && (
                    <div className="mb-8">
                        <img
                            src={post.banner_image}
                            alt={post.title}
                            className="w-full rounded-lg object-cover"
                        />
                    </div>
                )}

                {/* Body */}
                <div
                    className="prose-article text-neutral-900"
                    dangerouslySetInnerHTML={{ __html: post.content_html }}
                />

                <Separator className="my-8" />

                {/* Interactions */}
                <div className="flex items-center gap-6">
                    <ClapButton postId={post.id} initialCount={likeCount} initialLiked={userLiked} />
                    <CommentSection postId={post.id} postAuthorId={post.author_id} />
                    <ShareButton url={`${baseUrl}/${post.slug}`} title={post.title} />
                </div>
            </article>
        </>
    )
}
