import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-neutral-100 bg-white py-8 mt-auto">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
                <p className="text-sm text-neutral-500">
                    © {new Date().getFullYear()} DevBlog. All rights reserved.
                </p>
                <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-neutral-600">
                    <Link href="/about" className="hover:text-neutral-900 transition-colors">
                        About
                    </Link>
                    <Link href="/contact" className="hover:text-neutral-900 transition-colors">
                        Contact Us
                    </Link>
                    <Link href="/terms" className="hover:text-neutral-900 transition-colors">
                        Terms & Conditions
                    </Link>
                    <Link href="/privacy" className="hover:text-neutral-900 transition-colors">
                        Privacy Policy
                    </Link>
                </nav>
            </div>
        </footer>
    )
}
