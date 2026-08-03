export const revalidate = 60 // ISR: rebuild page every 60 seconds in the background

import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getPublishedPosts, getTrendingPosts } from "@/lib/actions"
import { formatDate } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

export default async function HomePage() {
  const [allPosts, trending] = await Promise.all([
    getPublishedPosts(),
    getTrendingPosts(),
  ])

  return (
    <div className="mx-auto flex flex-col lg:flex-row max-w-6xl gap-12 px-4 py-10">
      <h1 className="sr-only">DevBlog — Where Ideas Come Alive</h1>
      {/* ── Main Feed ── */}
      <section className="flex-1" aria-labelledby="latest-stories-heading">
        <h2 id="latest-stories-heading" className="sr-only">Latest Stories</h2>
        {allPosts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-2 font-sans text-2xl font-semibold text-neutral-900">
              No stories yet
            </p>
            <p className="text-neutral-500">
              Check back soon — great things are coming.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {allPosts.map((post, index) => (
              <React.Fragment key={post.id}>
                <article className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:shadow-md">
                  <Link href={`/${post.slug}`} className="group block p-5 md:p-6">
                    <div className="flex flex-col-reverse md:flex-row gap-5 md:gap-8">
                      <div className="flex-1 min-w-0">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            DevBlog
                          </span>
                        </div>
                        <h3 className="mb-2 font-sans text-xl font-bold leading-tight text-neutral-900 group-hover:text-blue-600">
                          {post.title}
                        </h3>
                        <p className="mb-4 line-clamp-2 text-base leading-relaxed text-neutral-600">
                          {post.content_text?.slice(0, 200)}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          {post.published_at && (
                            <span>{formatDate(post.published_at)}</span>
                          )}
                          <span aria-hidden="true">·</span>
                          <span>{post.reading_time_minutes} min read</span>
                          {post.views > 0 && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{post.views} views</span>
                            </>
                          )}
                        </div>
                      </div>
                      {post.banner_image && (
                        <div className="relative shrink-0 w-full aspect-video md:h-36 md:w-56 overflow-hidden rounded-lg">
                          <Image
                            src={post.banner_image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 224px"
                            priority={index <= 2}
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                </article>
              </React.Fragment>
            ))}
          </div>
        )}
      </section>

      {/* ── Sidebar ── */}
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-20">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-900">
            <TrendingUp className="h-4 w-4" />
            Trending Stories
          </h2>
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
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {post.published_at && formatDate(post.published_at)}
                    {post.views > 0 && <> · {post.views} views</>}
                  </p>
                </div>
              </Link>
            ))}
            {trending.length === 0 && (
              <p className="text-sm text-neutral-500">No trending posts yet.</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}
