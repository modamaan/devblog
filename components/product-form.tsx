"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createDigitalProduct, updateDigitalProduct } from "@/lib/actions"

interface ProductFormProps {
    product?: {
        id: string
        title: string
        description_html: string
        description_text: string
        banner_image: string | null
        price: number
        file_url: string
        is_active: boolean
    }
}

export function ProductForm({ product }: ProductFormProps) {
    const router = useRouter()
    const isEdit = !!product

    const [title, setTitle] = useState(product?.title ?? "")
    const [description, setDescription] = useState(product?.description_html ?? "")
    const [bannerImage, setBannerImage] = useState(product?.banner_image ?? "")
    const [price, setPrice] = useState(product ? String(product.price / 100) : "")
    const [fileUrl, setFileUrl] = useState(product?.file_url ?? "")
    const [isActive, setIsActive] = useState(product?.is_active ?? true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        if (!title || !price || !fileUrl) {
            setError("Title, price, and file URL are required.")
            return
        }

        const priceInPaise = Math.round(parseFloat(price) * 100)
        if (isNaN(priceInPaise) || priceInPaise <= 0) {
            setError("Enter a valid price in rupees.")
            return
        }

        setLoading(true)
        try {
            const data = {
                title,
                description_html: description,
                description_text: description.replace(/<[^>]*>/g, ""),
                banner_image: bannerImage || undefined,
                price: priceInPaise,
                file_url: fileUrl,
            }

            if (isEdit && product) {
                await updateDigitalProduct(product.id, { ...data, is_active: isActive })
            } else {
                await createDigitalProduct(data)
            }
            router.push("/admin/products")
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save product")
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
            )}

            {/* Title */}
            <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Title *
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 2000GB Ultimate Editing Pack"
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white"
                />
            </div>

            {/* Description (simple textarea — no rich editor for simplicity) */}
            <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Description (HTML supported)
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={8}
                    placeholder="Describe your product. You can use basic HTML tags like <b>, <ul>, <li>, <br>."
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white font-mono"
                />
            </div>

            {/* Banner image URL */}
            <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Banner Image URL
                </label>
                <input
                    type="url"
                    value={bannerImage}
                    onChange={(e) => setBannerImage(e.target.value)}
                    placeholder="https://… (Cloudinary, Imgur, etc.)"
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white"
                />
                {bannerImage && (
                    <img
                        src={bannerImage}
                        alt="Preview"
                        className="mt-2 h-32 w-full rounded-lg object-cover"
                    />
                )}
            </div>

            {/* Price */}
            <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Price (₹) *
                </label>
                <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50 focus-within:border-neutral-400 focus-within:bg-white">
                    <span className="pl-4 text-sm text-neutral-500">₹</span>
                    <input
                        type="number"
                        min="1"
                        step="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="99"
                        className="flex-1 bg-transparent px-2 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
                    />
                </div>
            </div>

            {/* File URL (Drive link) */}
            <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Download / File URL * (Google Drive link)
                </label>
                <input
                    type="url"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="https://drive.google.com/…"
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white"
                />
                <p className="mt-1 text-xs text-neutral-400">
                    This link is only sent to buyers after confirmed payment — never shown publicly.
                </p>
            </div>

            {/* Active toggle (edit only) */}
            {isEdit && (
                <div className="flex items-center gap-3">
                    <input
                        id="is_active"
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="h-4 w-4 rounded border-neutral-300 accent-neutral-900"
                    />
                    <label htmlFor="is_active" className="text-sm text-neutral-700">
                        Product is active (visible to buyers)
                    </label>
                </div>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-neutral-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-neutral-700 disabled:opacity-60"
                >
                    {loading ? "Saving…" : isEdit ? "Update Product" : "Create Product"}
                </button>
                <a
                    href="/admin/products"
                    className="text-sm text-neutral-500 hover:text-neutral-800"
                >
                    Cancel
                </a>
            </div>
        </form>
    )
}
