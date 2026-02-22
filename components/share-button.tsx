"use client"

import { useState } from "react"
import { Share, Link2, Facebook, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ShareButtonProps {
    url: string
    title: string
}

export function ShareButton({ url, title }: ShareButtonProps) {
    const [copied, setCopied] = useState(false)

    const fullUrl = typeof window !== "undefined" ? window.location.href : url

    const handleCopy = () => {
        navigator.clipboard.writeText(fullUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
        twitter: `https://x.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
        reddit: `https://reddit.com/submit?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}`,
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900">
                    <Share className="h-5 w-5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-white shadow-md border border-neutral-200">
                <DropdownMenuItem onClick={handleCopy} className="gap-3 cursor-pointer py-3">
                    <Link2 className="h-4 w-4 text-neutral-500" />
                    <span>{copied ? "Copied!" : "Copy link"}</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <a
                        href={shareLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-3 cursor-pointer py-3"
                    >
                        <Facebook className="h-4 w-4 text-neutral-500" />
                        <span>Share on Facebook</span>
                    </a>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <a
                        href={shareLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-3 cursor-pointer py-3"
                    >
                        <Linkedin className="h-4 w-4 text-neutral-500" />
                        <span>Share on LinkedIn</span>
                    </a>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <a
                        href={shareLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-3 cursor-pointer py-3"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-neutral-500">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                        </svg>
                        <span>Share on X</span>
                    </a>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <a
                        href={shareLinks.reddit}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-3 cursor-pointer py-3"
                    >
                        {/* Generic icon for Reddit since Lucide may not have it */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 text-neutral-500"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="2" />
                            <path d="M12 2v2" />
                            <path d="M12 20v2" />
                            <path d="m4.93 4.93 1.41 1.41" />
                            <path d="m17.66 17.66 1.41 1.41" />
                            <path d="M2 12h2" />
                            <path d="M20 12h2" />
                            <path d="m4.93 19.07 1.41-1.41" />
                            <path d="m17.66 6.34 1.41-1.41" />
                        </svg>
                        <span>Share on Reddit</span>
                    </a>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
