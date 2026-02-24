import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getDigitalProductBySlug } from "@/lib/actions"
import { ProductCheckout } from "@/components/product-checkout"

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const product = await getDigitalProductBySlug(slug)
    if (!product) return { title: "Product not found" }
    return {
        title: product.title,
        description: product.description_text?.slice(0, 160) ?? "",
    }
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params
    const product = await getDigitalProductBySlug(slug)
    if (!product || !product.is_active) notFound()

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start">

                {/* ── Left: Product Details ── */}
                <div className="flex-1 min-w-0">
                    {/* Banner */}
                    {product.banner_image && (
                        <div className="mb-8 overflow-hidden rounded-xl">
                            <img
                                src={product.banner_image}
                                alt={product.title}
                                className="w-full object-cover"
                                style={{ maxHeight: "420px" }}
                            />
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="mb-6 font-sans text-3xl font-extrabold leading-tight text-neutral-900 sm:text-4xl">
                        {product.title}
                    </h1>

                    {/* About section label */}
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
                        About the Product
                    </p>

                    {/* Rich description */}
                    <div
                        className="prose-article text-neutral-800"
                        dangerouslySetInnerHTML={{ __html: product.description_html }}
                    />
                </div>

                {/* ── Right: Checkout ── */}
                <div className="w-full lg:sticky lg:top-24 lg:w-80 shrink-0">
                    <ProductCheckout
                        productId={product.id}
                        productTitle={product.title}
                        price={product.price}
                    />
                </div>
            </div>
        </div>
    )
}
