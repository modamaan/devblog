export const dynamic = "force-dynamic"

import Link from "next/link"
import { getPublishedPosts, getTrendingPosts } from "@/lib/actions"
import { formatDate, readingTime } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TrendingUp } from "lucide-react"

export default async function HomePage() {
  const [allPosts, trending] = await Promise.all([
    getPublishedPosts(),
    getTrendingPosts(),
  ])

  return (
    <div className="mx-auto flex max-w-6xl gap-12 px-4 py-10">
      {/* ── Main Feed ── */}
      <section className="flex-1">
        {allPosts.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="mb-2 font-sans text-2xl font-semibold text-neutral-900">
              No stories yet
            </h2>
            <p className="text-neutral-500">
              Check back soon — great things are coming.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {allPosts.map((post) => (
              <article key={post.id} className="py-8 first:pt-0">
                <Link href={`/${post.slug}`} className="group block">
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-sm text-neutral-600">
                          DevBlog
                        </span>
                      </div>
                      <h2 className="mb-1 font-sans text-xl font-bold leading-tight text-neutral-900 group-hover:text-neutral-600">
                        {post.title}
                      </h2>
                      <p className="mb-3 line-clamp-2 font-serif text-base leading-relaxed text-neutral-700">
                        {post.content_text?.slice(0, 200)}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-neutral-400">
                        {post.published_at && (
                          <span>{formatDate(post.published_at)}</span>
                        )}
                        <span>·</span>
                        <span>{readingTime(post.content_text ?? "")}</span>
                        {post.views > 0 && (
                          <>
                            <span>·</span>
                            <span>{post.views} views</span>
                          </>
                        )}
                      </div>
                    </div>
                    {post.banner_image && (
                      <div className="shrink-0 mt-2 sm:mt-0">
                        <img
                          src={post.banner_image}
                          alt={post.title}
                          className="h-24 w-24 sm:h-28 sm:w-40 rounded object-cover"
                        />
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ── Sidebar ── */}
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-20">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-900">
            <TrendingUp className="h-4 w-4" />
            Trending
          </div>
          <div className="space-y-5">
            {trending.map((post, index) => (
              <Link
                key={post.id}
                href={`/${post.slug}`}
                className="group flex gap-3"
              >
                <span className="font-sans text-2xl font-bold text-neutral-200">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-xs text-neutral-500">
                    DevBlog
                  </p>
                  <h3 className="font-sans text-sm font-bold leading-snug text-neutral-900 group-hover:text-neutral-600">
                    {post.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    {post.published_at && formatDate(post.published_at)}
                    {post.views > 0 && <> · {post.views} views</>}
                  </p>
                </div>
              </Link>
            ))}
            {trending.length === 0 && (
              <p className="text-sm text-neutral-400">No trending posts yet.</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}
