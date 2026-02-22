"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter, useParams } from "next/navigation"
import { TiptapEditor } from "@/components/tiptap-editor"
import { getPostById, updatePost } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function EditStoryPage() {
    const router = useRouter()
    const params = useParams<{ id: string }>()
    const [title, setTitle] = useState("")
    const [bannerImage, setBannerImage] = useState("")
    const [contentHtml, setContentHtml] = useState("")
    const [contentText, setContentText] = useState("")
    const [isPending, startTransition] = useTransition()
    const [loading, setLoading] = useState(true)
    const [isPublished, setIsPublished] = useState(false)

    useEffect(() => {
        getPostById(params.id).then((post) => {
            if (!post) {
                router.push("/me/stories")
                return
            }
            setTitle(post.title)
            setBannerImage(post.banner_image ?? "")
            setContentHtml(post.content_html)
            setContentText(post.content_text ?? "")
            setIsPublished(!!post.published_at)
            setLoading(false)
        })
    }, [params.id, router])

    const handleSave = (publish: boolean) => {
        if (!title.trim()) return alert("Please add a title")
        if (publish && !contentHtml.trim()) return alert("Please write some content")

        startTransition(async () => {
            await updatePost(params.id, {
                title,
                content_html: contentHtml,
                content_text: contentText,
                banner_image: bannerImage || undefined,
                publish,
            })
            if (publish) {
                router.push("/")
            } else {
                router.push("/me/stories")
            }
        })
    }

    if (loading) {
        return (
            <div className="mx-auto max-w-[680px] px-4 py-20 text-center text-neutral-500">
                Loading...
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-[680px] px-4 py-10">
            {/* Toolbar */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-neutral-500">
                    {contentText.split(/\s+/).filter(Boolean).length} words
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => handleSave(false)}
                        disabled={isPending}
                    >
                        {isPending ? "Saving..." : isPublished ? "Revert to draft" : "Save draft"}
                    </Button>
                    <Button
                        size="sm"
                        className="rounded-full bg-green-600 text-white hover:bg-green-700"
                        onClick={() => handleSave(true)}
                        disabled={isPending}
                    >
                        {isPending ? (isPublished ? "Saving..." : "Publishing...") : (isPublished ? "Save changes" : "Publish")}
                    </Button>
                </div>
            </div>

            {/* Banner Image URL */}
            <Input
                type="url"
                placeholder="Banner image URL (optional)"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                className="mb-6 border-0 border-b border-neutral-200 px-0 text-sm focus-visible:ring-0"
            />

            {/* Title */}
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-6 w-full border-0 bg-transparent font-sans text-[2.5rem] font-extrabold leading-tight tracking-tight text-black placeholder:text-neutral-300 focus:outline-none"
            />

            {/* Editor */}
            <TiptapEditor
                content={contentHtml}
                onChange={(html, text) => {
                    setContentHtml(html)
                    setContentText(text)
                }}
            />
        </div>
    )
}
