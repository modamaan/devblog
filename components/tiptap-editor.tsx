"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import { useRef, useEffect, useCallback, useState } from "react"
import StarterKit from "@tiptap/starter-kit"
import ImageExt from "@tiptap/extension-image"
import LinkExt from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import {
    Bold,
    Italic,
    LinkIcon,
    Heading2,
    Code,
    List,
    Quote,
    ImagePlus,
    Minus,
    CodeXml,
    Plus,
} from "lucide-react"

interface TiptapEditorProps {
    content: string
    onChange: (html: string, text: string) => void
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
    const bubbleRef = useRef<HTMLDivElement>(null)
    const floatingRef = useRef<HTMLDivElement>(null)
    const [showBubble, setShowBubble] = useState(false)
    const [showFloating, setShowFloating] = useState(false)
    const [bubblePos, setBubblePos] = useState({ x: 0, y: 0 })
    const [floatingPos, setFloatingPos] = useState({ x: 0, y: 0 })

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            ImageExt.configure({
                HTMLAttributes: { class: "rounded-lg max-w-full" },
            }),
            LinkExt.configure({
                openOnClick: false,
                HTMLAttributes: { class: "underline underline-offset-2" },
            }),
            Placeholder.configure({
                placeholder: "Tell your story...",
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: "prose-article min-h-[400px] focus:outline-none text-black",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML(), editor.getText())
        },
    })

    // Update bubble/floating menu visibility on selection change
    useEffect(() => {
        if (!editor) return

        const handleSelectionUpdate = () => {
            const { from, to, empty } = editor.state.selection
            const text = editor.state.doc.textBetween(from, to, " ")

            // Bubble menu: show when there's a text selection
            if (!empty && text.length > 0) {
                const { view } = editor
                const coords = view.coordsAtPos(from)
                const endCoords = view.coordsAtPos(to)
                const editorEl = view.dom.closest(".relative")
                const editorRect = editorEl?.getBoundingClientRect() ?? { left: 0, top: 0 }

                setBubblePos({
                    x: (coords.left + endCoords.left) / 2 - editorRect.left,
                    y: coords.top - editorRect.top - 48,
                })
                setShowBubble(true)
                setShowFloating(false)
            } else {
                setShowBubble(false)

                // Floating menu: show when cursor is on an empty line
                const { $from } = editor.state.selection
                const isEmptyLine =
                    $from.parent.type.name === "paragraph" &&
                    $from.parent.textContent === ""

                if (isEmptyLine && empty) {
                    const { view } = editor
                    const coords = view.coordsAtPos(from)
                    const editorEl = view.dom.closest(".relative")
                    const editorRect = editorEl?.getBoundingClientRect() ?? { left: 0, top: 0 }

                    setFloatingPos({
                        x: -40,
                        y: coords.top - editorRect.top - 4,
                    })
                    setShowFloating(true)
                } else {
                    setShowFloating(false)
                }
            }
        }

        editor.on("selectionUpdate", handleSelectionUpdate)
        editor.on("transaction", handleSelectionUpdate)

        return () => {
            editor.off("selectionUpdate", handleSelectionUpdate)
            editor.off("transaction", handleSelectionUpdate)
        }
    }, [editor])

    const addImage = useCallback(() => {
        if (!editor) return
        const url = window.prompt("Image URL:")
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    const setLink = useCallback(() => {
        if (!editor) return
        const previousUrl = editor.getAttributes("link").href
        const url = window.prompt("Link URL:", previousUrl)
        if (url === null) return
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }, [editor])

    if (!editor) return null

    return (
        <div className="relative">
            {/* Bubble Menu — appears on text selection */}
            {showBubble && (
                <div
                    ref={bubbleRef}
                    className="absolute z-50 flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg"
                    style={{ left: bubblePos.x, top: bubblePos.y, transform: "translateX(-50%)" }}
                >
                    <BubbleBtn
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        active={editor.isActive("bold")}
                    >
                        <Bold className="h-4 w-4" />
                    </BubbleBtn>
                    <BubbleBtn
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        active={editor.isActive("italic")}
                    >
                        <Italic className="h-4 w-4" />
                    </BubbleBtn>
                    <BubbleBtn onClick={setLink} active={editor.isActive("link")}>
                        <LinkIcon className="h-4 w-4" />
                    </BubbleBtn>
                    <BubbleBtn
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        active={editor.isActive("heading", { level: 2 })}
                    >
                        <Heading2 className="h-4 w-4" />
                    </BubbleBtn>
                    <BubbleBtn
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        active={editor.isActive("code")}
                    >
                        <Code className="h-4 w-4" />
                    </BubbleBtn>
                </div>
            )}

            {/* Floating Menu — "+" on empty lines */}
            {showFloating && (
                <div
                    ref={floatingRef}
                    className="absolute z-50 flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg"
                    style={{ left: floatingPos.x, top: floatingPos.y }}
                >
                    <BubbleBtn onClick={addImage} active={false}>
                        <ImagePlus className="h-4 w-4" />
                    </BubbleBtn>
                    <BubbleBtn
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        active={false}
                    >
                        <Minus className="h-4 w-4" />
                    </BubbleBtn>
                    <BubbleBtn
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        active={editor.isActive("codeBlock")}
                    >
                        <CodeXml className="h-4 w-4" />
                    </BubbleBtn>
                    <BubbleBtn
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        active={editor.isActive("bulletList")}
                    >
                        <List className="h-4 w-4" />
                    </BubbleBtn>
                    <BubbleBtn
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        active={editor.isActive("blockquote")}
                    >
                        <Quote className="h-4 w-4" />
                    </BubbleBtn>
                </div>
            )}

            <EditorContent editor={editor} />
        </div>
    )
}

function BubbleBtn({
    onClick,
    active,
    children,
}: {
    onClick: () => void
    active: boolean
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            onMouseDown={(e) => {
                e.preventDefault() // prevent losing editor focus
                onClick()
            }}
            className={`rounded p-1.5 transition-colors ${active
                ? "bg-neutral-200 text-neutral-900"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
        >
            {children}
        </button>
    )
}
