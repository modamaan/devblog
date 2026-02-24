import Link from "next/link"
import { getAllDigitalProducts } from "@/lib/actions"
import { ShoppingBag } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function StorePage() {
    const products = await getAllDigitalProducts()

    return (
        <div className="mx-auto max-w-5xl px-4 py-12">
            <div className="mb-10 flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-neutral-700" />
                <h1 className="font-sans text-3xl font-extrabold text-neutral-900">Store</h1>
            </div>

            {products.length === 0 ? (
                <div className="py-24 text-center text-neutral-400">
                    <p className="text-lg">No products available yet.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/store/${product.slug}`}
                            className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
                        >
                            {product.banner_image ? (
                                <img
                                    src={product.banner_image}
                                    alt={product.title}
                                    className="h-44 w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-44 items-center justify-center bg-neutral-100">
                                    <ShoppingBag className="h-12 w-12 text-neutral-300" />
                                </div>
                            )}
                            <div className="flex flex-1 flex-col p-5">
                                <h2 className="mb-1 font-sans text-base font-bold leading-snug text-neutral-900 group-hover:text-neutral-600">
                                    {product.title}
                                </h2>
                                <p className="mb-3 line-clamp-2 text-sm text-neutral-500">
                                    {product.description_text?.slice(0, 100)}
                                </p>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="font-sans text-lg font-extrabold text-neutral-900">
                                        ₹{product.price / 100}
                                    </span>
                                    <span className="rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-bold text-white">
                                        Get it now
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
