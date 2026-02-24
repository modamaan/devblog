import Link from "next/link"
import { getAllDigitalProductsAdmin, deleteDigitalProduct } from "@/lib/actions"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Plus, Pencil, Trash2, ShoppingBag } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
    const session = await auth()
    if (session?.user?.role !== "admin") redirect("/")

    const products = await getAllDigitalProductsAdmin()

    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ShoppingBag className="h-6 w-6 text-neutral-700" />
                    <h1 className="font-sans text-2xl font-extrabold text-neutral-900">
                        Digital Products
                    </h1>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700"
                >
                    <Plus className="h-4 w-4" />
                    New Product
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="py-20 text-center text-neutral-400">
                    <ShoppingBag className="mx-auto mb-3 h-10 w-10 opacity-30" />
                    <p>No products yet. Create your first one!</p>
                </div>
            ) : (
                <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 bg-white shadow-sm">
                    {products.map((product) => (
                        <div key={product.id} className="flex items-center gap-4 p-4">
                            {product.banner_image ? (
                                <img
                                    src={product.banner_image}
                                    alt={product.title}
                                    className="h-14 w-20 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-neutral-100">
                                    <ShoppingBag className="h-6 w-6 text-neutral-300" />
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <p className="truncate font-sans font-semibold text-neutral-900">
                                    {product.title}
                                </p>
                                <p className="text-sm text-neutral-500">
                                    ₹{product.price / 100} ·{" "}
                                    <span
                                        className={`font-medium ${product.is_active ? "text-green-600" : "text-neutral-400"}`}
                                    >
                                        {product.is_active ? "Active" : "Inactive"}
                                    </span>
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/store/${product.slug}`}
                                    target="_blank"
                                    className="rounded px-3 py-1.5 text-xs text-neutral-500 hover:bg-neutral-100"
                                >
                                    View
                                </Link>
                                <Link
                                    href={`/admin/products/${product.id}/edit`}
                                    className="flex items-center gap-1 rounded px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-100"
                                >
                                    <Pencil className="h-3 w-3" />
                                    Edit
                                </Link>
                                <form
                                    action={async () => {
                                        "use server"
                                        await deleteDigitalProduct(product.id)
                                    }}
                                >
                                    <button
                                        type="submit"
                                        className="flex items-center gap-1 rounded px-3 py-1.5 text-xs text-red-500 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                        Delete
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
