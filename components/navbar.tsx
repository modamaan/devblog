"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PenLine } from "lucide-react"

export function Navbar() {
    const { data: session } = useSession()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
            <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                <Link
                    href="/"
                    className="font-sans text-xl font-bold tracking-tight text-neutral-900"
                >
                    DevBlog
                </Link>

                <div className="flex items-center gap-3">
                    {session?.user ? (
                        <>
                            {(session.user as any).role === "admin" && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        asChild
                                        className="gap-2 text-sm font-normal text-neutral-600 hover:text-neutral-900"
                                    >
                                        <Link href="/me/stories">
                                            Drafts
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        asChild
                                        className="gap-2 text-sm font-normal text-neutral-600 hover:text-neutral-900"
                                    >
                                        <Link href="/me/stories/new">
                                            <PenLine className="h-4 w-4" />
                                            Write
                                        </Link>
                                    </Button>
                                </>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-8 w-8 rounded-full"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={session.user.image ?? ""}
                                                alt={session.user.name ?? ""}
                                            />
                                            <AvatarFallback className="text-xs">
                                                {session.user.name?.charAt(0)?.toUpperCase() ?? "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-white shadow-md border border-neutral-200">
                                    <div className="flex flex-col px-2 py-1.5">
                                        <p className="text-sm font-medium">{session.user.name}</p>
                                        <p className="text-xs text-neutral-500">
                                            {session.user.email}
                                        </p>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/">Feed</Link>
                                    </DropdownMenuItem>
                                    {(session.user as any).role === "admin" && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/me/stories">My Stories</Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => signOut()}>
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <Button
                            variant="default"
                            size="sm"
                            className="rounded-full bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800"
                            onClick={() => signIn()}
                        >
                            Sign in
                        </Button>
                    )}
                </div>
            </nav>
        </header>
    )
}
