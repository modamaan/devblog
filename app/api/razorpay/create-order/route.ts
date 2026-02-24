import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import { db } from "@/db"
import { productOrders, digitalProducts } from "@/db/schema"
import { eq } from "drizzle-orm"

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: NextRequest) {
    try {
        const { productId, email, name } = await req.json()

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

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: product.price, // already in paise
            currency: "INR",
            receipt: `order_${Date.now()}`,
            notes: { productId, email },
        })

        // Save pending order in DB
        await db.insert(productOrders).values({
            product_id: productId,
            buyer_email: email,
            buyer_name: name ?? null,
            razorpay_order_id: order.id,
            status: "pending",
        })

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            productTitle: product.title,
        })
    } catch (err) {
        console.error("create-order error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
