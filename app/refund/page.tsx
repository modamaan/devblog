import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Refund Policy – DevBlog",
    description: "Learn about DevBlog's refund policy for purchases made on the store.",
}

export default function RefundPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-16">
            <h1 className="mb-6 font-sans text-4xl font-bold text-neutral-900">Refund Policy</h1>
            <p className="mb-8 text-neutral-500 text-sm">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
            <div className="prose prose-neutral max-w-none text-neutral-700">
                <p className="mb-4">
                    At DevBlog, we want you to be completely satisfied with your purchase. We sell digital products
                    (downloadable files, templates, and resources) directly — DevBlog is the sole seller and all purchases
                    are made directly from us. Please read this policy carefully before making a purchase.
                </p>

                <h2 className="mt-8 mb-4 text-2xl font-semibold text-neutral-900">Digital Products</h2>
                <p className="mb-4">
                    All sales of digital products on DevBlog are <strong>final by default</strong>, as digital goods are delivered
                    immediately upon successful payment and cannot be "returned" in the traditional sense. However, we do offer
                    refunds in the following specific circumstances:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>The product file is corrupted or fails to download.</li>
                    <li>The product is materially different from its description on the store page.</li>
                    <li>You were charged multiple times for the same order due to a technical error.</li>
                </ul>

                <h2 className="mt-8 mb-4 text-2xl font-semibold text-neutral-900">How to Request a Refund</h2>
                <p className="mb-4">
                    To request a refund, please contact us within <strong>7 days</strong> of your purchase by visiting our{" "}
                    <a href="/contact" className="text-neutral-900 underline underline-offset-2 hover:text-neutral-600 transition-colors">
                        Contact page
                    </a>{" "}
                    and providing the following information:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Your order ID or the email address used at checkout.</li>
                    <li>The name of the product you purchased.</li>
                    <li>A clear description of the issue you experienced.</li>
                </ul>
                <p className="mb-4">
                    We will review your request and respond within <strong>2–3 business days</strong>. If approved, refunds are
                    processed to your original payment method. Please allow 5–10 business days for the amount to reflect in your account,
                    depending on your bank or card issuer.
                </p>

                <h2 className="mt-8 mb-4 text-2xl font-semibold text-neutral-900">Non-Refundable Situations</h2>
                <p className="mb-4">We are unable to offer refunds in the following cases:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>You changed your mind after purchase.</li>
                    <li>You purchased the wrong product by mistake.</li>
                    <li>The refund request is made more than 7 days after the purchase date.</li>
                    <li>The product has already been downloaded and used.</li>
                    <li>Your request does not meet the eligibility criteria listed above.</li>
                </ul>

                <h2 className="mt-8 mb-4 text-2xl font-semibold text-neutral-900">Payment Disputes</h2>
                <p className="mb-4">
                    We encourage you to reach out to us directly before initiating a chargeback with your bank or payment provider.
                    Chargebacks filed without prior contact may result in your account being suspended. We are committed to resolving
                    all legitimate issues fairly and promptly.
                </p>

                <h2 className="mt-8 mb-4 text-2xl font-semibold text-neutral-900">Changes to This Policy</h2>
                <p className="mb-4">
                    We reserve the right to update this Refund Policy at any time. Changes will be reflected on this page with an
                    updated date. Continued use of our store after changes are posted constitutes your acceptance of the revised policy.
                </p>

                <h2 className="mt-8 mb-4 text-2xl font-semibold text-neutral-900">Contact Us</h2>
                <p className="mb-4">
                    If you have any questions about this Refund Policy, please reach out through our{" "}
                    <a href="/contact" className="text-neutral-900 underline underline-offset-2 hover:text-neutral-600 transition-colors">
                        Contact page
                    </a>.
                </p>
            </div>
        </div>
    )
}
