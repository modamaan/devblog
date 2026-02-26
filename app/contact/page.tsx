export default function ContactPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-16">
            <h1 className="mb-6 font-sans text-4xl font-bold text-neutral-900">Contact Us</h1>
            <div className="prose prose-neutral max-w-none text-neutral-700">
                <p className="mb-4">
                    Have questions, feedback, or just want to say hi? We'd love to hear from you.
                </p>
                <p className="mb-4">
                    You can reach us directly at:
                </p>
                <p className="font-medium text-neutral-900">
                    <a href="mailto:amaanprogramming@gmail.com" className="hover:underline">
                        amaanprogramming@gmail.com
                    </a>
                </p>
            </div>
        </div>
    )
}
