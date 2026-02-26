import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { productOrders, digitalProducts } from "@/db/schema"
import { eq } from "drizzle-orm"

const CF_BASE_URL =
    process.env.CASHFREE_ENV === "production"
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg"

export async function POST(req: NextRequest) {
    try {
        const { productId, email, name, phone } = await req.json()

        if (!productId || !email) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        // Fetch product
        const [product] = await db
            .select()
            .from(digitalProducts)
            .where(eq(digitalProducts.id, productId))
            .limit(1)

        if (!product || !product.is_active) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }

        const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
        const amountInRupees = (product.price / 100).toFixed(2) // paise → rupees

        // Create Cashfree order
        const cfRes = await fetch(`${CF_BASE_URL}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-client-id": process.env.CASHFREE_APP_ID!,
                "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
                "x-api-version": "2023-08-01",
            },
            body: JSON.stringify({
                order_id: orderId,
                order_amount: amountInRupees,
                order_currency: "INR",
                customer_details: {
                    customer_id: email.replace(/[^a-zA-Z0-9_-]/g, "_"),
                    customer_email: email,
                    customer_name: name || "Customer",
                    customer_phone: phone || "9999999999",
                },
                order_meta: {
                    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/store/${product.slug}?order_id={order_id}`,
                },
                order_note: product.title,
            }),
        })

        const cfData = await cfRes.json()

        if (!cfRes.ok) {
            console.error("Cashfree create order error:", cfData)
            return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
        }

        // Save pending order in DB
        await db.insert(productOrders).values({
            product_id: productId,
            buyer_email: email,
            buyer_name: name ?? null,
            cf_order_id: orderId,
            status: "pending",
        })

        return NextResponse.json({
            paymentSessionId: cfData.payment_session_id,
            orderId,
        })
    } catch (err) {
        console.error("create-order error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
