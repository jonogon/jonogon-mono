import {EditorContent, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import EditorToolbar from './toolbar/EditorToolbar';
import {useEffect} from 'react';

interface EditorProps {
    content: string;
    placeholder?: string;
    onChange: (value: string) => void;
}

const Editor = ({content, placeholder, onChange}: EditorProps) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        onUpdate: ({editor}) => {
            onChange(editor.getHTML());
        },
    });
    let fetched = false;

    useEffect(() => {
        if (!fetched) {
            editor?.commands.setContent(content);
            fetched = true;
        }
    }, [content]);

    if (!editor) return <></>;

    return (
        <div className="prose max-w-none w-full border border-input bg-card text-card-foreground dark:prose-invert rounded-md">
            <EditorToolbar editor={editor} />
            <div className="editor">
                <EditorContent editor={editor} placeholder={placeholder} />
            </div>
        </div>
    );
};

export default Editor;
