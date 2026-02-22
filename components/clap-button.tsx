"use client"

import { useState, useTransition } from "react"
import { toggleLike } from "@/lib/actions"
import { useSession } from "next-auth/react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface ClapButtonProps {
    postId: string
    initialCount: number
    initialLiked: boolean
}

export function ClapButton({ postId, initialCount, initialLiked }: ClapButtonProps) {
    const { data: session } = useSession()
    const [count, setCount] = useState(Number(initialCount))
    const [liked, setLiked] = useState(initialLiked)
    const [animate, setAnimate] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleToggle = () => {
        if (!session?.user) {
            window.location.href = "/auth/signin"
            return
        }

        setAnimate(true)
        setTimeout(() => setAnimate(false), 400)

        const newLiked = !liked
        setLiked(newLiked)
        setCount((prev) => (newLiked ? prev + 1 : Math.max(0, prev - 1)))

        startTransition(async () => {
            try {
                await toggleLike(postId)
            } catch (err) {
                // Revert on error
                setLiked(!newLiked)
                setCount((prev) => (newLiked ? prev - 1 : prev + 1))
                console.error("Failed to toggle like:", err)
            }
        })
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className="group flex items-center gap-2 text-neutral-500 transition-colors hover:text-red-500"
        >
            <span
                className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border transition-all",
                    liked
                        ? "border-red-200 bg-red-50"
                        : "border-neutral-200 group-hover:border-red-300",
                    animate && "scale-125"
                )}
                style={{ transition: "transform 0.2s ease" }}
            >
                <Heart
                    className={cn(
                        "h-5 w-5 transition-colors",
                        liked
                            ? "fill-red-500 text-red-500"
                            : "fill-none text-neutral-400 group-hover:text-red-400"
                    )}
                />
            </span>
            <span className={cn("text-sm font-medium", liked ? "text-red-500" : "text-neutral-500")}>
                {count}
            </span>
        </button>
    )
}
