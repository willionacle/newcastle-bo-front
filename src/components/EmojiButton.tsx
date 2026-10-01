import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useSlate } from "slate-react";
import { Transforms } from "slate";
import { Button } from "antd";
import { SmileOutlined } from "@ant-design/icons";

// @ts-ignore
const insertEmoji = (editor, emoji) => {
  const emojiNode = {
    text: emoji,
  };
  Transforms.insertNodes(editor, emojiNode);
};

// Emoji Button Component
// @ts-ignore
const EmojiButton = () => {
  const editor = useSlate();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <Button
        type="default"
        icon={<SmileOutlined />}
        onClick={(event) => {
          event.preventDefault();
          setShowPicker(!showPicker);
        }}
      />

      {showPicker && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: 0,
            zIndex: 1000,
            background: "#fff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            borderRadius: "8px",
          }}
        >
          <EmojiPicker
            onEmojiClick={(emojiObject) => {
              insertEmoji(editor, emojiObject.emoji);
              setShowPicker(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiButton;
