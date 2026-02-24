import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProductForm } from "@/components/product-form"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"

export default async function NewProductPage() {
    const session = await auth()
    if (session?.user?.role !== "admin") redirect("/")

    return (
        <div className="mx-auto max-w-2xl px-4 py-10">
            <div className="mb-8 flex items-center gap-3">
                <Link href="/admin/products" className="text-sm text-neutral-500 hover:text-neutral-800">
                    ← Products
                </Link>
                <span className="text-neutral-300">/</span>
                <span className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                    <ShoppingBag className="h-4 w-4" />
                    New Product
                </span>
            </div>

            <h1 className="mb-8 font-sans text-2xl font-extrabold text-neutral-900">
                Create Digital Product
            </h1>

            <ProductForm />
        </div>
    )
}
