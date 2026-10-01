import { createEditor, Descendant, Editor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import useEditor from "@/hooks/editor/Editor";
import { useCallback, useMemo, useState } from "react";

export function parseSlateValue(data: any): Descendant[] | null {
  try {
    const parsed = typeof data === "string" ? JSON.parse(data) : data;

    if (!Array.isArray(parsed)) return null;

    const editor = withReact(createEditor());
    
    editor.children = parsed as Descendant[];
    Editor.normalize(editor, { force: true });

    return editor.children;
  } catch (e) {
    return null;
  }
}

const EditorViewer = ({ data }: any) => {
  const { Leaf, Element } = useEditor();
  const [editor] = useState(() => withReact(createEditor()));
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  const value = useMemo(() => parseSlateValue(data), [data]);

  if (!value) {
    return <span>{String(data)}</span>;
  }

  return (
    <div>
      <Slate editor={editor} initialValue={value}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          readOnly
          className="slate-editor"
        />
      </Slate>
    </div>
  );
};

export default EditorViewer;
