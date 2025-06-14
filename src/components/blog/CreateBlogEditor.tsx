import "./styles/BlogStyles.css"

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import React from "react";

interface CreateBlogEditorProps {
    content: string;
    onChange: (html: string) => void;
}

const extensions = [
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
    }),
    TextStyle,
    Color
];

const CreateBlogEditor: React.FC<CreateBlogEditorProps> = ({ content, onChange }) => {
    const editor = useEditor({
        extensions,
        content,
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    if (!editor) return null;

    const buttonStyle = (isActive: boolean, isDisabled = false) =>
        `px-3 py-1 text-sm rounded-lg  ${isDisabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : isActive
                ? "bg-[#036AFF] text-white"
                : "bg-white text-gray-800 hover:bg-blue-100"
        }`;

    return (
        <div className="w-full">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 mb-4">
                {[
                    { label: "Bold", action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold"), canRun: editor.can().chain().focus().toggleBold().run() },
                    { label: "Italic", action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic"), canRun: editor.can().chain().focus().toggleItalic().run() },
                    { label: "Strike", action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive("strike"), canRun: editor.can().chain().focus().toggleStrike().run() },
                    { label: "Code", action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive("code"), canRun: editor.can().chain().focus().toggleCode().run() },
                    { label: "Paragraph", action: () => editor.chain().focus().setParagraph().run(), active: editor.isActive("paragraph") },
                    { label: "H1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }) },
                    { label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
                    { label: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
                    { label: "H4", action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(), active: editor.isActive("heading", { level: 4 }) },
                    { label: "H5", action: () => editor.chain().focus().toggleHeading({ level: 5 }).run(), active: editor.isActive("heading", { level: 5 }) },
                    { label: "H6", action: () => editor.chain().focus().toggleHeading({ level: 6 }).run(), active: editor.isActive("heading", { level: 6 }) },
                    { label: "Bullet List", action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
                    { label: "Ordered List", action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
                    { label: "Code Block", action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive("codeBlock") },
                    { label: "Blockquote", action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
                    { label: "HR", action: () => editor.chain().focus().setHorizontalRule().run() },
                    { label: "Break", action: () => editor.chain().focus().setHardBreak().run() },
                    { label: "Clear Marks", action: () => editor.chain().focus().unsetAllMarks().run() },
                    { label: "Clear Nodes", action: () => editor.chain().focus().clearNodes().run() },
                    { label: "Undo", action: () => editor.chain().focus().undo().run(), canRun: editor.can().chain().focus().undo().run() },
                    { label: "Redo", action: () => editor.chain().focus().redo().run(), canRun: editor.can().chain().focus().redo().run() },
                    {
                        label: "Purple",
                        action: () => editor.chain().focus().setColor("#958DF1").run(),
                        active: editor.isActive("textStyle", { color: "#958DF1" }),
                    },
                ].map(({ label, action, active = false, canRun = true }) => (
                    <button
                        key={label}
                        onClick={action}
                        disabled={!canRun}
                        className={buttonStyle(active, !canRun)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-lg">
                <EditorContent editor={editor} className="blog-content" />
            </div>
        </div>
    );
};

export default CreateBlogEditor;
