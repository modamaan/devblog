import Link from "next/link"
import { getMyPosts } from "@/lib/actions"
import { formatDate, readingTime } from "@/lib/utils"
import { PenLine, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeletePostButton } from "@/components/delete-post-button"

export default async function MyStoriesPage() {
    const myPosts = await getMyPosts()

    const drafts = myPosts.filter((p) => !p.published_at)
    const published = myPosts.filter((p) => p.published_at)

    return (
        <div className="mx-auto max-w-3xl px-4 py-10">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="font-sans text-3xl font-bold text-neutral-900">
                    My Stories
                </h1>
                <Button asChild size="sm" className="gap-2 rounded-full bg-green-600 text-white hover:bg-green-700">
                    <Link href="/me/stories/new">
                        <Plus className="h-4 w-4" />
                        Write a story
                    </Link>
                </Button>
            </div>

            {/* Drafts Section */}
            {drafts.length > 0 && (
                <section className="mb-10">
                    <h2 className="mb-4 flex items-center gap-2 font-sans text-lg font-semibold text-neutral-900">
                        <PenLine className="h-4 w-4 text-amber-500" />
                        Drafts ({drafts.length})
                    </h2>
                    <div className="divide-y divide-neutral-100 rounded-lg border border-neutral-200">
                        {drafts.map((post) => (
                            <div
                                key={post.id}
                                className="flex items-center justify-between gap-4 px-5 py-4"
                            >
                                <div className="min-w-0 flex-1">
                                    <Link
                                        href={`/me/stories/${post.id}/edit`}
                                        className="block truncate font-sans text-base font-semibold text-neutral-900 hover:text-green-700"
                                    >
                                        {post.title || "Untitled"}
                                    </Link>
                                    <p className="mt-0.5 text-sm text-neutral-500">
                                        Last edited {formatDate(post.updated_at ?? post.created_at)}
                                        {post.content_text && (
                                            <> · {readingTime(post.content_text)}</>
                                        )}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full text-xs"
                                    >
                                        <Link href={`/me/stories/${post.id}/edit`}>
                                            Edit
                                        </Link>
                                    </Button>
                                    <DeletePostButton postId={post.id} postTitle={post.title} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Published Section */}
            {published.length > 0 && (
                <section>
                    <h2 className="mb-4 font-sans text-lg font-semibold text-neutral-900">
                        Published ({published.length})
                    </h2>
                    <div className="divide-y divide-neutral-100 rounded-lg border border-neutral-200">
                        {published.map((post) => (
                            <div
                                key={post.id}
                                className="flex items-center justify-between gap-4 px-5 py-4"
                            >
                                <div className="min-w-0 flex-1">
                                    <Link
                                        href={`/${post.slug}`}
                                        className="block truncate font-sans text-base font-semibold text-neutral-900 hover:text-green-700"
                                    >
                                        {post.title}
                                    </Link>
                                    <p className="mt-0.5 text-sm text-neutral-500">
                                        Published {post.published_at && formatDate(post.published_at)}
                                        {post.content_text && (
                                            <> · {readingTime(post.content_text)}</>
                                        )}
                                        {post.views > 0 && <> · {post.views} views</>}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full text-xs"
                                    >
                                        <Link href={`/me/stories/${post.id}/edit`}>
                                            Edit
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full text-xs"
                                    >
                                        <Link href={`/${post.slug}`}>View</Link>
                                    </Button>
                                    <DeletePostButton postId={post.id} postTitle={post.title} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {myPosts.length === 0 && (
                <div className="py-20 text-center">
                    <h2 className="mb-2 font-sans text-2xl font-semibold text-neutral-900">
                        No stories yet
                    </h2>
                    <p className="mb-6 text-neutral-500">
                        Write your first story and share it with the world.
                    </p>
                    <Button asChild className="gap-2 rounded-full bg-green-600 text-white hover:bg-green-700">
                        <Link href="/me/stories/new">
                            <PenLine className="h-4 w-4" />
                            Write a story
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
