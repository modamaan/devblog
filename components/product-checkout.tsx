"use client"

import { useState } from "react"
import { CheckCircle, Loader2 } from "lucide-react"
import { load } from "@cashfreepayments/cashfree-js"

interface ProductCheckoutProps {
    productId: string
    productTitle: string
    price: number // in paise
}

export function ProductCheckout({ productId, productTitle, price }: ProductCheckoutProps) {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [paid, setPaid] = useState(false)

    const priceInRupees = price / 100

    async function handleCheckout() {
        setError("")
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.")
            return
        }

        setLoading(true)
        try {
            // 1. Create order on server → get payment_session_id
            const res = await fetch("/api/cashfree/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, email, name, phone }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? "Failed to create order")

            const { paymentSessionId, orderId } = data

            // 2. Load Cashfree JS SDK and open checkout
            const cashfree = await load({
                mode: (process.env.NEXT_PUBLIC_CASHFREE_ENV as "sandbox" | "production") ?? "sandbox",
            })

            cashfree.checkout({
                paymentSessionId,
                redirectTarget: "_modal",
            }).then(async (result: { error?: { message?: string }; paymentDetails?: unknown }) => {
                if (result.error) {
                    setError(result.error.message ?? "Payment failed. Please try again.")
                    setLoading(false)
                    return
                }

                // 3. Verify payment on our server
                const verifyRes = await fetch("/api/cashfree/verify-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderId }),
                })

                if (verifyRes.ok) {
                    setPaid(true)
                } else {
                    setError("Payment verification failed. Please contact support.")
                }
                setLoading(false)
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
            setLoading(false)
        }
    }

    if (paid) {
        return (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
                <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
                <h3 className="mb-1 font-sans text-xl font-bold text-neutral-900">Payment Successful!</h3>
                <p className="text-sm text-neutral-500">
                    Check <strong>{email}</strong> — we&apos;ve sent your download link.
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm text-neutral-500">
                Access to this purchase will be sent to this email
            </p>

            {/* Name */}
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white"
                />
            </div>

            {/* Phone */}
            <div className="mb-3">
                <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white"
                />
            </div>

            {/* Email */}
            <div className="mb-4">
                <input
                    type="email"
                    placeholder="Email address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white"
                />
                <p className="mt-1.5 text-xs text-neutral-400">Make sure the email is correct — your download link will be sent here.</p>
                <p className="mt-1 text-xs text-neutral-400">Any issue? Contact <a href="mailto:amaanprogramming@gmail.com" className="underline hover:text-neutral-600">amaanprogramming@gmail.com</a></p>
            </div>

            {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

            {/* Price summary */}
            <div className="mb-4 space-y-1 border-t border-neutral-100 pt-4">
                <div className="flex justify-between text-sm text-neutral-600">
                    <span>Sub Total</span>
                    <span>₹{priceInRupees}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-neutral-900">
                    <span>Total</span>
                    <span>₹{priceInRupees}</span>
                </div>
            </div>

            {/* CTA */}
            <button
                onClick={handleCheckout}
                disabled={loading}
                className="flex w-full items-center justify-between rounded-lg bg-neutral-900 px-5 py-3.5 font-sans text-sm font-bold text-white transition hover:bg-neutral-700 disabled:opacity-60"
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                    </span>
                ) : (
                    <>
                        <span>Get it now</span>
                        <span>→</span>
                    </>
                )}
            </button>

            {/* Copy link */}
            <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 py-2.5 text-sm text-neutral-500 transition hover:bg-neutral-50"
            >
                🔗 Copy link
            </button>
        </div>
    )
}
