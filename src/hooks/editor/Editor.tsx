import i18next from "@/i18n/i18n";
import { useCallback, useEffect, useState } from "react";
import {
  Editable,
  withReact,
  useSlate,
  Slate,
  ReactEditor,
  useSlateStatic,
} from "slate-react";
import {
  Editor,
  Transforms,
  createEditor,
  Element as SlateElement,
  Range,
} from "slate";

import { Button, Icon, Toolbar } from "./components";
import DeleteBtn from "@/components/DeleteBtn";
import ColorPickerButton from "@/components/ColorPickerButton";
import EmojiButton from "@/components/EmojiButton";
import { notification } from "antd";
import { UPLOAD_ACCEPT_IMAGE, uploadErrorMessage, uploadFileAPI } from "@/api/upload/post";

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];
const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "", type: "text" }],
  },
];

// @ts-ignore
const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align };
  const editor = useSlateStatic();

  const handleRemoveImage = () => {
    const path = ReactEditor.findPath(editor as any, element); // Find the image's path
    Transforms.removeNodes(editor, { at: path }); // Remove the image
  };

  switch (element.type) {
    case "image":
      return (
        <div
          {...attributes}
          contentEditable={false}
          style={{ position: "relative", display: "inline-block" }}
        >
          <img
            src={element.url}
            alt="Uploaded"
            style={{ maxWidth: "100%", height: "auto", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            <DeleteBtn handleDelete={handleRemoveImage} />
          </div>
          {children}
        </div>
      );
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case "link":
      return (
        <a
          href={element.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1677ff", textDecoration: "underline" }}
          {...attributes}
        >
          {children}
        </a>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};
// @ts-ignore
const Leaf = ({ attributes, children, leaf }) => {
  let style = {};

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.color) {
    children = <span style={{ color: leaf.color }}>{children}</span>;
  }

  if (leaf.fontSize) {
    children = <span style={{ fontSize: leaf.fontSize }}>{children}</span>;
  }

  if (leaf.color) {
    style = { ...style, color: leaf.color };
  }

  if (leaf.fontSize) {
    style = { ...style, fontSize: leaf.fontSize };
  }

  if (leaf.fontFamily) {
    style = { ...style, fontFamily: leaf.fontFamily };
  }

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};

// @ts-ignore
const withImages = (editor) => {
  const { isVoid } = editor;

  editor.isVoid = (element: any) => {
    return element.type === "image" ? true : isVoid(element);
  };

  return editor;
};

// @ts-ignore
const withInlines = (editor) => {
  const { isInline } = editor;

  editor.isInline = (element: any) => {
    return element.type === "link" ? true : isInline(element);
  };

  return editor;
};

// @ts-ignore
const isLinkActive = (editor) => {
  const [link] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      // @ts-ignore
      n.type === "link",
  });
  return !!link;
};

// @ts-ignore
const unwrapLink = (editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      // @ts-ignore
      n.type === "link",
  });
};

// @ts-ignore
const insertLink = (editor, url, text) => {
  if (isLinkActive(editor)) unwrapLink(editor);

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const linkText = text || url;
  const link: any = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: linkText }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

const isAllowedUrl = (url: string) => {
  return /^(https?:|mailto:|tel:|tg:)/i.test(url);
};

const useEditor = (initial?: any) => {
  // @ts-ignore
  const renderElement = useCallback((props) => <Element {...props} />, []);
  // @ts-ignore
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const [editor] = useState(() => withImages(withInlines(withReact(createEditor()))));
  const [value, setValue] = useState("");

  const handleSetContent = (content: any) => {
    const point = { path: [0, 0], offset: 0 }
    editor.selection = { anchor: point, focus: point };
    editor.history = { redos: [], undos: [] }; 
    editor.children = [{
        type: "paragraph",
        children: [{ text: "" }]
    }];
    Transforms.removeNodes(editor);
    Transforms.insertNodes(editor, content);
    setValue(content);
  }

  useEffect(() => {
    if (initial && value === "") {  // Only set the initial value if `value` is empty
      Transforms.removeNodes(editor);
      Transforms.insertNodes(editor, initial);
      setValue(initial);  // Set the editor's value to the initial content
    }
  }, [initial, editor, value]);

  const el = (
    <div
      style={{
        marginBottom: "1rem",
      }}
    >
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(value) => {
          const isAstChange = editor.operations.some(
            (op: any) => "set_selection" !== op.type
          );
          if (isAstChange) {
            // Save the value to Local Storage.
            const content = JSON.stringify(value);
            setValue(content);
          }
        }}
      >
        <Toolbar>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                marginBottom: "10px",
                marginRight: "5px",
              }}
            >
              <FontFamilyButton />
              <FontSizeButton />
              <ColorPickerButton />
              <EmojiButton />
            </div>
            <MarkButton format="bold" icon="format_bold" />
            <MarkButton format="italic" icon="format_italic" />
            <MarkButton format="underline" icon="format_underlined" />
            <MarkButton format="code" icon="code" />
            <BlockButton format="heading-one" icon="looks_one" />
            <BlockButton format="heading-two" icon="looks_two" />
            <BlockButton format="heading-three" icon="looks_3" />
            <BlockButton format="block-quote" icon="format_quote" />
            <BlockButton format="numbered-list" icon="format_list_numbered" />
            <BlockButton format="bulleted-list" icon="format_list_bulleted" />
            <BlockButton format="left" icon="format_align_left" />
            <BlockButton format="center" icon="format_align_center" />
            <BlockButton format="right" icon="format_align_right" />
            <BlockButton format="justify" icon="format_align_justify" />
            <LinkButton />
            <ImageButton />
          </div>
        </Toolbar>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some text…"
          style={{
            border: "solid 1px var(--ant-color-border)",
            borderRadius: "1rem",
            minHeight: "20rem",
            padding: "1rem",
          }}
          autoFocus
        />
      </Slate>
    </div>
  );

  return { el, value, editor,Leaf,Element,handleSetContent };
};

// @ts-ignore
const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      // @ts-ignore
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      // @ts-ignore
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      // @ts-ignore
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};
// @ts-ignore
const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

// @ts-ignore
const isBlockActive = (editor, format, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        // @ts-ignore
        n[blockType] === format,
    })
  );

  return !!match;
};
// @ts-ignore
const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  // @ts-ignore
  return marks ? marks[format] === true : false;
};

// @ts-ignore
const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
      )}
      // @ts-ignore
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

// @ts-ignore
const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      // @ts-ignore
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

// @ts-ignore
const insertImage = (editor, url) => {
  const imageNode = {
    type: "image",
    url, // Server URL
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, imageNode);
};

const LinkButton = () => {
  const editor = useSlate();

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    const { selection } = editor;

    let selectedText = "";
    if (selection && !Range.isCollapsed(selection)) {
      selectedText = Editor.string(editor, selection);
    }

    let defaultUrl = "https://";
    const telegramMatch = selectedText.match(/^@([A-Za-z0-9_]{5,32})$/);
    if (telegramMatch) {
      defaultUrl = `https://t.me/${telegramMatch[1]}`;
    }

    const url = window.prompt(i18next.t("text.enterUrl"), defaultUrl);
    if (!url) return;

    if (!isAllowedUrl(url)) {
      window.alert(i18next.t("text.invalidUrlFormat"));
      return;
    }

    if (selection && !Range.isCollapsed(selection)) {
      ReactEditor.focus(editor as any);
      Transforms.select(editor, selection);
    }

    insertLink(editor, url, selectedText);
  };

  return (
    <Button active={isLinkActive(editor)} onMouseDown={handleClick}>
      <Icon>link</Icon>
    </Button>
  );
};

// @ts-ignore
const ImageButton = () => {
  const editor = useSlate();

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("files", file);

    try {
      const { data } = await uploadFileAPI(formData);
      if (data.filenames) {
        const url = `${import.meta.env.VITE_MEDIA_URL}${
          JSON.parse(data.filenames)[0]
        }`;
        insertImage(editor, url); // Use the uploaded image URL
      }
    } catch (error) {
      notification.error({ message: uploadErrorMessage(error) });
    } finally {
      event.target.value = ""; // allow re-picking the same file after a refusal
    }
  };

  return (
    <label
      style={{
        cursor: "pointer",
        padding: "5px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        position: "relative",
        bottom: "5px",
      }}
    >
      🖼️
      <input
        type="file"
        accept={UPLOAD_ACCEPT_IMAGE}
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
    </label>
  );
};

// @ts-ignore
const FontFamilyButton = () => {
  const editor = useSlate();
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const font = event.target.value;
    const isActive = isMarkActive(editor, "fontFamily");

    if (isActive) {
      Editor.removeMark(editor, "fontFamily");
    } else {
      Editor.addMark(editor, "fontFamily", font);
    }
  };

  return (
    <select
      onChange={handleChange}
      style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
    >
      <option value="monospace">고정폭 글꼴</option>
      <option value="serif">세리프 글꼴</option>
      <option value="sans-serif">산세리프 글꼴</option>
    </select>
  );
};

//@ts-ignore
const FillButton = () => {
  const editor = useSlate();
  const handleFill = () => {
    const isActive = isMarkActive(editor, "backgroundColor");

    // Toggle the background color (fill effect)
    if (isActive) {
      Editor.removeMark(editor, "backgroundColor");
    } else {
      Editor.addMark(editor, "backgroundColor", "yellow"); // Apply fill (yellow as an example)
    }
  };

  return (
    <Button
      active={isMarkActive(editor, "backgroundColor")}
      onMouseDown={(event:any) => {
        event.preventDefault();
        handleFill();
      }}
    >
      <Icon>🎨</Icon> {/* Icon for the fill button */}
    </Button>
  );
};

// Add to the Toolbar:
<Toolbar>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0",
    }}
  >
    {/* Add other buttons here */}
    <FillButton />
  </div>
</Toolbar>


// @ts-ignore
const FontSizeButton = () => {
  const editor = useSlate();
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const size = event.target.value;
    const isActive = isMarkActive(editor, "fontSize");

    if (isActive) {
      Editor.removeMark(editor, "fontSize");
    } else {
      Editor.addMark(editor, "fontSize", size);
    }
  };

  return (
    <select
      onChange={handleChange}
      style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
    >
      <option value="8px">Extra Tiny</option>
      <option value="10px">Tiny</option>
      <option value="12px">Small</option>
      <option value="14px">Medium</option>
      <option value="16px">Normal</option>
      <option value="18px">Large</option>
      <option value="32px">Huge</option>
      <option value="55px">Massive</option>
    </select>
  );
};

// @ts-ignore
const ColorButton = ({ format, icon }) => {
  const editor = useSlate();

  const toggleColor = (editor: any, color: any) => {
    const isActive = isMarkActive(editor, "color");

    if (isActive) {
      Editor.removeMark(editor, "color");
    } else {
      Editor.addMark(editor, "color", color);
    }
  };

  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event: any) => {
        event.preventDefault();
        toggleColor(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

export default useEditor;
