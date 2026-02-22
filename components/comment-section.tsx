"use client"

import { useState, useTransition, useEffect } from "react"
import { useSession } from "next-auth/react"
import { getCommentsByPostId, addComment, deleteComment } from "@/lib/actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, MoreHorizontal } from "lucide-react"
import { formatDate } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

interface Comment {
    id: string
    content: string
    created_at: Date
    user_id: string
    parent_id: string | null
    user_name: string | null
    user_image: string | null
}

interface CommentSectionProps {
    postId: string
    postAuthorId: string
}

export function CommentSection({ postId, postAuthorId }: CommentSectionProps) {
    const { data: session } = useSession()
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState("")

    const fetchComments = async () => {
        const c = await getCommentsByPostId(postId)
        setComments(c as Comment[])
    }

    useEffect(() => {
        if (isOpen) {
            fetchComments()
        }
    }, [isOpen, postId])

    const handleSubmit = (parentId?: string) => {
        const content = parentId ? replyContent : newComment
        if (!content.trim()) return
        if (!session?.user) {
            window.location.href = "/auth/signin"
            return
        }

        startTransition(async () => {
            await addComment(postId, content.trim(), parentId)
            if (parentId) {
                setReplyingTo(null)
                setReplyContent("")
            } else {
                setNewComment("")
            }
            await fetchComments()
        })
    }

    const handleDelete = (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return
        startTransition(async () => {
            await deleteComment(commentId)
            await fetchComments()
        })
    }

    const isAdmin = (session?.user as any)?.role === "admin"

    // Group comments
    const topLevelComments = comments.filter((c) => !c.parent_id)
    const getReplies = (parentId: string) => comments.filter((c) => c.parent_id === parentId)

    const renderComment = (comment: Comment, isReply = false) => {
        const replies = getReplies(comment.id)
        const isAuthor = comment.user_id === postAuthorId

        return (
            <div key={comment.id} className={`flex gap-3 ${isReply ? "mt-4" : ""}`}>
                <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user_image ?? ""} />
                    <AvatarFallback className="text-xs">
                        {comment.user_name?.charAt(0)?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-neutral-900">
                                {comment.user_name}
                            </span>
                            {isAuthor && (
                                <span className="rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                    Author
                                </span>
                            )}
                            <span className="text-xs text-neutral-400">
                                {formatDate(comment.created_at)}
                            </span>
                        </div>
                        {isAdmin && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-neutral-900">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        className="text-red-600 focus:bg-red-50 focus:text-red-700"
                                        onClick={() => handleDelete(comment.id)}
                                    >
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                    <p className="mt-1 font-serif text-[15px] leading-relaxed text-neutral-700">
                        {comment.content}
                    </p>

                    {!isReply && (
                        <div className="mt-2">
                            <button
                                onClick={() => {
                                    setReplyingTo(replyingTo === comment.id ? null : comment.id)
                                    setReplyContent("")
                                }}
                                className="text-xs font-medium text-neutral-500 hover:text-neutral-900"
                            >
                                Reply
                            </button>
                        </div>
                    )}

                    {/* Reply Input */}
                    {replyingTo === comment.id && !isReply && (
                        <div className="mt-4 rounded-lg border border-neutral-200 p-4">
                            <div className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={session?.user?.image ?? ""} />
                                    <AvatarFallback className="text-xs">
                                        {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <Textarea
                                        placeholder="Write a reply..."
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        className="mb-2 min-h-[60px] resize-none border-0 bg-transparent p-0 font-serif text-base focus-visible:ring-0"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setReplyingTo(null)}
                                            className="rounded-full text-neutral-500 hover:text-neutral-900"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => handleSubmit(comment.id)}
                                            disabled={isPending || !replyContent.trim()}
                                            className="rounded-full bg-green-600 px-4 text-white hover:bg-green-700"
                                        >
                                            {isPending ? "Replying..." : "Reply"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Replies */}
                    {replies.length > 0 && (
                        <div className="mt-4 border-l-2 border-neutral-100 pl-4">
                            {replies.map((reply) => renderComment(reply, true))}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button
                    className="flex items-center gap-2 text-neutral-500 transition-colors hover:text-neutral-900"
                >
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">{comments.length || ""}</span>
                </button>
            </SheetTrigger>
            <SheetContent
                className="w-full sm:w-[400px] sm:max-w-[400px] overflow-y-auto px-6 sm:px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                side="right"
            >
                <SheetHeader className="mb-8 mt-4">
                    <SheetTitle className="font-sans text-xl font-bold tracking-tight text-neutral-900">
                        Responses ({comments.length})
                    </SheetTitle>
                </SheetHeader>

                {/* Comment input */}
                {session?.user ? (
                    <div className="mb-10 rounded-xl border border-neutral-100 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                        <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={session.user.image ?? ""} />
                                <AvatarFallback className="text-xs">
                                    {session.user.name?.charAt(0)?.toUpperCase() ?? "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <Textarea
                                    placeholder="What are your thoughts?"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="mb-3 min-h-[60px] resize-none border-0 bg-transparent p-1 font-serif text-[15px] leading-relaxed focus-visible:ring-0 placeholder:text-neutral-400"
                                />
                                <div className="flex pl-1 justify-end">
                                    <Button
                                        size="sm"
                                        onClick={() => handleSubmit()}
                                        disabled={isPending || !newComment.trim()}
                                        className="rounded-full bg-green-600 px-4 text-white hover:bg-green-700"
                                    >
                                        {isPending ? "Posting..." : "Respond"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-8 rounded-lg border border-neutral-200 bg-neutral-50 p-6 text-center shadow-sm">
                        <h4 className="mb-2 font-sans font-semibold text-neutral-900">
                            Join the conversation
                        </h4>
                        <p className="mb-4 text-sm text-neutral-500">
                            Sign in to reply to the author and other readers.
                        </p>
                        <Button
                            size="sm"
                            className="rounded-full bg-neutral-900 text-white hover:bg-neutral-800"
                            onClick={() => (window.location.href = "/auth/signin")}
                        >
                            Sign in to respond
                        </Button>
                    </div>
                )}

                <Separator className="my-8 opacity-50" />

                {/* Comment list */}
                <div className="space-y-8 pb-10">
                    {topLevelComments.map((comment) => renderComment(comment))}
                    {comments.length === 0 && (
                        <p className="py-8 text-center text-sm text-neutral-500">
                            There are currently no responses for this story.
                            <br />
                            Be the first to respond.
                        </p>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
