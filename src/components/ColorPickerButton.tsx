import { useState, useEffect, useRef } from "react";
import { ChromePicker } from "react-color";
import { useSlate } from "slate-react";
import { Editor } from "slate";

const ColorPickerButton = () => {
  const editor = useSlate();
  const [showPicker, setShowPicker] = useState(false);
  const [color, setColor] = useState("#000000");

  // Refs to track picker and button
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // @ts-ignore
  const isMarkActive = (editor: any, format: any) => {
    const marks = Editor.marks(editor);
    // @ts-ignore
    return marks ? marks[format] === true : false;
  };

  const toggleColor = (color: string) => {
    const isActive = isMarkActive(editor, "color");

    if (isActive) {
      Editor.removeMark(editor, "color");
    } else {
      Editor.addMark(editor, "color", color);
    }
  };

  // ✅ Update color but don't close the picker while dragging
  const handleChange = (color: any) => {
    setColor(color.hex);
    toggleColor(color.hex);
  };

  // ✅ Only close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false); // Close only if clicking outside both the button & picker
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: "relative", display: "flex" }}>
      <button
        ref={buttonRef}
        onClick={() => setShowPicker(!showPicker)}
        type="button"
        style={{
          border: "1px solid #ccc",
          padding: "5px",
          borderRadius: "5px",
          width: "30px",
          height: "30px",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: color, fontWeight: "bolder", fontSize: "20px" }}>
          A
        </span>
      </button>
      {showPicker && (
        <div
          ref={pickerRef}
          style={{
            position: "absolute",
            zIndex: "2",
            top: "30px",
            left: "0px",
            backgroundColor: "#fff",
            boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)",
          }}
        >
          <ChromePicker
            color={color}
            onChange={handleChange} // ✅ Keep the picker open while dragging
          />
        </div>
      )}
    </div>
  );
};

export default ColorPickerButton;
