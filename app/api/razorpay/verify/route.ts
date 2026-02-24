import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/db"
import { productOrders, digitalProducts } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ error: "Missing payment details" }, { status: 400 })
        }

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body)
            .digest("hex")

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
        }

        // Find the order
        const [order] = await db
            .select()
            .from(productOrders)
            .where(eq(productOrders.razorpay_order_id, razorpay_order_id))
            .limit(1)

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }

        // Mark as paid
        await db
            .update(productOrders)
            .set({ status: "paid", razorpay_payment_id })
            .where(eq(productOrders.razorpay_order_id, razorpay_order_id))

        // Fetch product for file URL and title
        const [product] = await db
            .select()
            .from(digitalProducts)
            .where(eq(digitalProducts.id, order.product_id))
            .limit(1)

        if (product) {
            // Send download email via Resend
            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL ?? "noreply@yourdomain.com",
                to: order.buyer_email,
                subject: `Your purchase: ${product.title}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #111;">Thank you for your purchase! 🎉</h2>
                        <p>Hi ${order.buyer_name ?? "there"},</p>
                        <p>You've successfully purchased <strong>${product.title}</strong>.</p>
                        <p style="margin: 24px 0;">
                            <a href="${product.file_url}"
                               style="background: #111; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                                Download your file →
                            </a>
                        </p>
                        <p style="color: #888; font-size: 14px;">Payment ID: ${razorpay_payment_id}</p>
                        <p style="color: #888; font-size: 14px;">If you have any issues, reply to this email.</p>
                    </div>
                `,
            })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error("verify error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
