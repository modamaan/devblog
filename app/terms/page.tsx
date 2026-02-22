export default function TermsPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-16">
            <h1 className="mb-4 font-sans text-4xl font-bold text-neutral-900">Terms & Conditions</h1>
            <p className="mb-8 text-sm text-neutral-500">Last Updated: February 2026</p>

            <div className="prose prose-neutral max-w-none text-neutral-700 space-y-8">
                <p className="leading-relaxed">
                    Welcome to DevBlog. By accessing and using this website, you agree to comply with and be bound by the following Terms and Conditions. If you do not agree with any part of these terms, please discontinue use of the website.
                </p>

                <section>
                    <h2 className="mb-3 text-xl font-bold text-neutral-900">1. Use of Website</h2>
                    <p className="mb-2">DevBlog is a personal blog that publishes content related to:</p>
                    <ul className="list-disc pl-6 mb-4 space-y-1">
                        <li>Software Development</li>
                        <li>Coding Tutorials</li>
                        <li>Technical Deep-Dives</li>
                        <li>Neuroscience</li>
                        <li>Finance</li>
                        <li>Productivity and related topics</li>
                    </ul>
                    <p className="mb-4">All content is provided for informational and educational purposes only.</p>
                    <p className="mb-2">By using this website, you agree that you will:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Not use the website for unlawful purposes</li>
                        <li>Not attempt to disrupt, damage, or hack the website</li>
                        <li>Not misuse or copy content without permission</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-bold text-neutral-900">2. Intellectual Property Rights</h2>
                    <p className="mb-4">Unless otherwise stated, all content on DevBlog — including articles, text, graphics, and design — is the intellectual property of DevBlog.</p>
                    <p className="mb-2">You may:</p>
                    <ul className="list-disc pl-6 mb-4 space-y-1">
                        <li>Read and share links to articles</li>
                        <li>Use content for personal, non-commercial purposes</li>
                    </ul>
                    <p className="mb-2">You may not:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Republish content without permission</li>
                        <li>Sell, rent, or distribute content</li>
                        <li>Reproduce articles in full without written consent</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-bold text-neutral-900">3. User Comments</h2>
                    <p className="mb-4">DevBlog may allow users to comment on posts.</p>
                    <p className="mb-2">By posting comments, you confirm that:</p>
                    <ul className="list-disc pl-6 mb-4 space-y-1">
                        <li>You have the right to post the content</li>
                        <li>Your comment does not violate any intellectual property rights</li>
                        <li>Your comment is not defamatory, offensive, or unlawful</li>
                    </ul>
                    <p className="mb-4">We reserve the right to remove comments that violate these terms.</p>
                    <p>By posting comments, you grant DevBlog a non-exclusive right to display and reproduce your comment on the website.</p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-bold text-neutral-900">4. No Professional Advice</h2>
                    <p className="mb-4">The content published on DevBlog, including finance or technical topics, is for informational purposes only.</p>
                    <p>It should not be considered professional, financial, legal, medical, or investment advice. Readers are encouraged to consult qualified professionals before making decisions based on the information provided.</p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-bold text-neutral-900">5. External Links</h2>
                    <p className="mb-4">DevBlog may include links to external websites for reference or additional information.</p>
                    <p className="mb-2">We are not responsible for:</p>
                    <ul className="list-disc pl-6 mb-4 space-y-1">
                        <li>The content of external websites</li>
                        <li>Their privacy practices</li>
                        <li>Any losses arising from their use</li>
                    </ul>
                    <p>Users should review the terms and privacy policies of third-party websites separately.</p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-bold text-neutral-900">6. Cookies and Advertising</h2>
                    <p className="mb-4">DevBlog may use cookies to improve user experience.</p>
                    <p>We may also display advertisements or affiliate links to support operational costs. Third-party advertising partners may use cookies in accordance with their own privacy policies.</p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-bold text-neutral-900">7. Limitation of Liability</h2>
                    <p className="mb-2">While we strive to ensure accuracy, we do not guarantee that:</p>
                    <ul className="list-disc pl-6 mb-4 space-y-1">
                        <li>All information is complete or up-to-date</li>
                        <li>The website will always be available</li>
                        <li>The content is free from errors</li>
                    </ul>
                    <p>DevBlog shall not be liable for any loss, damage, or inconvenience resulting from the use of this website.</p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-bold text-neutral-900">8. Changes to Terms</h2>
                    <p className="mb-4">We reserve the right to modify these Terms and Conditions at any time. Updates will be reflected on this page with a revised date.</p>
                    <p>Continued use of the website after changes constitutes acceptance of the updated terms.</p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-bold text-neutral-900">9. Governing Law</h2>
                    <p>These Terms shall be governed in accordance with the applicable laws of your jurisdiction.</p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-bold text-neutral-900">10. Contact Information</h2>
                    <p className="mb-4">If you have any questions regarding these Terms and Conditions, you may contact us at:</p>
                    <p>
                        <a href="mailto:quorlonline@gmail.com" className="font-semibold text-neutral-900 hover:text-blue-600 transition-colors">
                            📧 quorlonline@gmail.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    )
}
