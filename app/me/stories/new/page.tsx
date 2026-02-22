"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { TiptapEditor } from "@/components/tiptap-editor"
import { createPost } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewStoryPage() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [bannerImage, setBannerImage] = useState("")
    const [contentHtml, setContentHtml] = useState("")
    const [contentText, setContentText] = useState("")
    const [isPending, startTransition] = useTransition()

    const handlePublish = (asDraft: boolean) => {
        if (!title.trim()) return alert("Please add a title")
        if (!asDraft && !contentHtml.trim()) return alert("Please write some content")

        startTransition(async () => {
            const post = await createPost({
                title,
                content_html: contentHtml,
                content_text: contentText,
                banner_image: bannerImage || undefined,
                publish: !asDraft,
            })
            if (asDraft) {
                router.push("/me/stories")
            } else {
                router.push(`/${post.slug}`)
            }
        })
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
                        onClick={() => handlePublish(true)}
                        disabled={isPending}
                    >
                        Save draft
                    </Button>
                    <Button
                        size="sm"
                        className="rounded-full bg-green-600 text-white hover:bg-green-700"
                        onClick={() => handlePublish(false)}
                        disabled={isPending}
                    >
                        {isPending ? "Publishing..." : "Publish"}
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
