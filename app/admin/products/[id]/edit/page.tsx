import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { db } from "@/db"
import { digitalProducts } from "@/db/schema"
import { eq } from "drizzle-orm"
import { ProductForm } from "@/components/product-form"
import Link from "next/link"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
    const session = await auth()
    if (session?.user?.role !== "admin") redirect("/")

    const { id } = await params
    const [product] = await db
        .select()
        .from(digitalProducts)
        .where(eq(digitalProducts.id, id))
        .limit(1)

    if (!product) notFound()

    return (
        <div className="mx-auto max-w-2xl px-4 py-10">
            <div className="mb-8 flex items-center gap-3">
                <Link href="/admin/products" className="text-sm text-neutral-500 hover:text-neutral-800">
                    ← Products
                </Link>
                <span className="text-neutral-300">/</span>
                <span className="text-sm font-semibold text-neutral-900">Edit Product</span>
            </div>

            <h1 className="mb-8 font-sans text-2xl font-extrabold text-neutral-900">
                Edit: {product.title}
            </h1>

            <ProductForm product={product} />
        </div>
    )
}
