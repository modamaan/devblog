export default function AboutPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-16">
            <h1 className="mb-8 font-sans text-4xl font-bold text-neutral-900">About DevBlog</h1>

            <div className="prose prose-neutral max-w-none text-neutral-700 space-y-8">
                <p className="text-lg leading-relaxed">
                    Welcome to DevBlog, a personal blog dedicated to deep technical insights, coding tutorials, neuroscience explorations, finance concepts, and interdisciplinary thinking.
                </p>

                <section>
                    <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-neutral-900">
                        <span>🎯</span> Our Mission
                    </h2>
                    <p className="mb-4 leading-relaxed">
                        Our mission is to simplify complex ideas and present them in a clear, structured, and distraction-free format. We believe learning should be accessible, practical, and intellectually engaging.
                    </p>
                    <p className="leading-relaxed">
                        Whether you're a developer, student, or curious thinker, DevBlog aims to provide content that helps you grow technically and mentally.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-neutral-900">
                        <span>🧠</span> What We Write About
                    </h2>
                    <ul className="list-disc pl-6 space-y-2 marker:text-neutral-400">
                        <li>Software Development & Programming</li>
                        <li>System Design & Technical Deep-Dives</li>
                        <li>Neuroscience & Cognitive Science</li>
                        <li>Finance & Wealth Concepts</li>
                        <li>Productivity & Personal Growth</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-neutral-900">
                        <span>🛠️</span> Editorial Approach
                    </h2>
                    <p className="leading-relaxed">
                        All articles are written and reviewed carefully. Content is based on personal experience, research, and verified sources. While we strive for accuracy, readers are encouraged to cross-check critical information from official or primary sources when necessary.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-neutral-900">
                        <span>💬</span> Community
                    </h2>
                    <p className="leading-relaxed">
                        DevBlog is a personal platform, meaning guest publishing is not currently available. However, readers are encouraged to engage by sharing, liking, and commenting on articles.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-neutral-900">
                        <span>📌</span> Transparency
                    </h2>
                    <p className="leading-relaxed">
                        This website may contain advertisements or affiliate links to support operational costs. We do not sell user data or encourage unsafe transactions.
                    </p>
                </section>
            </div>
        </div>
    )
}
