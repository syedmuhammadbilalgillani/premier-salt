"use client";

import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import CodeBlock from "@tiptap/extension-code-block";
import Color from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Placeholder from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";
import { TiptapMenuBar } from "./tiptap-menu-bar";

interface TiptapProps {
  content?: string;
  onChange?: (content: string) => void;
}

export const Editor = ({ content, onChange }: TiptapProps) => {
  const [codeView, setCodeView] = React.useState(false);

  const editor = useEditor({
    immediatelyRender: false, // Changed from true to false for SSR compatibility
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      Image,
      Color,
      OrderedList,
      ListItem,
      BulletList,
      CodeBlock,
      Underline,

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Highlight.configure({ multicolor: true }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "w-full h-auto object-contain my-3",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      Blockquote,
      Placeholder.configure({
        placeholder: "Enter a description...",
      }),
      OrderedList.configure({
        itemTypeName: "listItem",
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] overflow-auto p-4",
      },
    },
  }) as never as any;

  // Add this useEffect to sync content changes
  useEffect(() => {
    if (editor && content !== undefined) {
      const currentContent = editor.getHTML();
      // Only update if content is different to avoid infinite loops
      if (currentContent !== content) {
        editor.commands.setContent(content, false);
      }
    }
  }, [content, editor]);

  return (
    <div className="w-full neditor-html">
      <TiptapMenuBar
        editor={editor}
        codeView={codeView}
        setCodeView={setCodeView}
        
      />
      <div className="border border-t-0 border-gray-200 rounded-b-lg min-h-[200px]">
        {codeView ? (
          <textarea
            className="w-full min-h-[200px] p-4 font-mono"
            value={editor?.getHTML() || ""}
            onChange={(e) => editor?.commands.setContent(e.target.value, false)}
          />
        ) : (
          <EditorContent editor={editor} className="w-full max-h-[50dvh] overflow-y-auto neditor-html" />
        )}
      </div>
    </div>
  );
};

export default Editor;
