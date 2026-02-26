import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/db"
import { productOrders, digitalProducts } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

const CF_BASE_URL =
    process.env.CASHFREE_ENV === "production"
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg"

export async function POST(req: NextRequest) {
    try {
        const { orderId } = await req.json()

        if (!orderId) {
            return NextResponse.json({ error: "Missing orderId" }, { status: 400 })
        }

        // Fetch order status from Cashfree
        const cfRes = await fetch(`${CF_BASE_URL}/orders/${orderId}/payments`, {
            headers: {
                "x-client-id": process.env.CASHFREE_APP_ID!,
                "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
                "x-api-version": "2023-08-01",
            },
        })

        const payments = await cfRes.json()

        if (!cfRes.ok) {
            console.error("Cashfree fetch payments error:", payments)
            return NextResponse.json({ error: "Could not fetch payment status" }, { status: 500 })
        }

        // Check if any payment succeeded
        const successPayment = Array.isArray(payments)
            ? payments.find((p: { payment_status: string }) => p.payment_status === "SUCCESS")
            : null

        if (!successPayment) {
            return NextResponse.json({ error: "Payment not successful" }, { status: 400 })
        }

        const cfPaymentId = successPayment.cf_payment_id?.toString() ?? ""

        // Find the order in DB
        const [order] = await db
            .select()
            .from(productOrders)
            .where(eq(productOrders.cf_order_id, orderId))
            .limit(1)

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }

        if (order.status === "paid") {
            // Already processed — idempotent
            return NextResponse.json({ success: true })
        }

        // Mark as paid
        await db
            .update(productOrders)
            .set({ status: "paid", cf_payment_id: cfPaymentId })
            .where(eq(productOrders.cf_order_id, orderId))

        // Fetch product for download link
        const [product] = await db
            .select()
            .from(digitalProducts)
            .where(eq(digitalProducts.id, order.product_id))
            .limit(1)

        if (product) {
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
                        <p style="color: #888; font-size: 14px;">Payment ID: ${cfPaymentId}</p>
                        <p style="color: #888; font-size: 14px;">If you have any issues, reply to this email.</p>
                    </div>
                `,
            })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error("verify-order error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// Cashfree webhook (optional — provides server-to-server confirmation)
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get("order_id")
    if (!orderId) return NextResponse.json({ error: "No order_id" }, { status: 400 })

    // Re-use verify logic by forwarding internally
    const body = JSON.stringify({ orderId })
    const internalRes = await POST(
        new NextRequest(req.url, { method: "POST", body, headers: { "Content-Type": "application/json" } })
    )
    return internalRes
}
