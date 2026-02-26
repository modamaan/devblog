import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Privacy Policy – DevBlog",
    description: "Learn how DevBlog collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-16">
            <h1 className="mb-6 font-sans text-4xl font-bold text-neutral-900">Privacy Policy</h1>
            <p className="mb-8 text-neutral-500 text-sm">Last updated: February 2026</p>
            <div className="prose prose-neutral max-w-none text-neutral-700 space-y-8">
                <p className="leading-relaxed">
                    At DevBlog, your privacy is important to us. This Privacy Policy explains what information we collect,
                    how we use it, and how we protect it when you visit our website or make a purchase from our store.
                </p>

                <section>
                    <h2 className="mt-8 mb-4 text-2xl font-semibold text-neutral-900">Information We Collect</h2>
                    <p className="mb-4">We may collect the following types of information:</p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li><strong>Contact information</strong> — such as your name and email address, when you use our contact form or make a purchase.</li>
                        <li><strong>Payment information</strong> — processed securely by Cashfree. We do not store your card details on our servers.</li>
                        <li><strong>Usage data</strong> — browser type, pages visited, and referring URLs, collected via cookies or analytics tools to understand how visitors use the site.</li>
                    </ul>
                    <p>We do not allow visitors to create accounts or publish content on DevBlog. Only DevBlog publishes articles and resources.</p>
                </section>

                <section>
                    <h2 className="mt-8 mb-4 text-2xl font-semibold text-neutral-900">How We Use Information</h2>
                    <p className="mb-4">We use the information we collect to:</p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Process and fulfil your digital product purchases and send download links.</li>
                        <li>Respond to enquiries submitted through the contact form.</li>
                        <li>Improve the website and understand how it is being used.</li>
                        <li>Display relevant advertisements (via third-party ad partners).</li>
                    </ul>
                    <p>We do not sell or rent your personal information to third parties.</p>
                </section>

                <section>
                    <h2 className="mt-8 mb-4 text-2xl font-semibold text-neutral-900">Cookies</h2>
                    <p className="mb-4">
                        DevBlog uses cookies to improve your browsing experience and to support advertising functionality.
                        Third-party services such as Google AdSense may place their own cookies in accordance with their privacy policies.
                        You can control cookie behaviour through your browser settings.
                    </p>
                </section>

                <section>
                    <h2 className="mt-8 mb-4 text-2xl font-semibold text-neutral-900">Third-Party Services</h2>
                    <p className="mb-4">We use the following third-party services which may collect data independently:</p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li><strong>Cashfree</strong> — for payment processing.</li>
                        <li><strong>Resend</strong> — for sending purchase confirmation and download emails.</li>
                        <li><strong>Google AdSense / Analytics</strong> — for advertising and anonymous usage analytics.</li>
                    </ul>
                    <p>Please review each provider&apos;s privacy policy for details on how they handle your data.</p>
                </section>

                <section>
                    <h2 className="mt-8 mb-4 text-2xl font-semibold text-neutral-900">Data Security</h2>
                    <p>
                        We take reasonable precautions to protect your information. However, no method of transmission over the
                        internet is 100% secure. We cannot guarantee absolute security, but we strive to protect your personal data
                        using industry-standard practices.
                    </p>
                </section>

                <section>
                    <h2 className="mt-8 mb-4 text-2xl font-semibold text-neutral-900">Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised date.
                        Continued use of the website after any changes constitutes your acceptance of the updated policy.
                    </p>
                </section>

                <section>
                    <h2 className="mt-8 mb-4 text-2xl font-semibold text-neutral-900">Contact Us</h2>
                    <p className="mb-4">If you have any questions about this Privacy Policy, please reach out through our{" "}
                        <a href="/contact" className="text-neutral-900 underline underline-offset-2 hover:text-neutral-600 transition-colors">
                            Contact page
                        </a>.
                    </p>
                </section>
            </div>
        </div>
    )
}
