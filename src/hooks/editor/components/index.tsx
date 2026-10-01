import React, { ReactNode, Ref, PropsWithChildren } from "react";
import ReactDOM from "react-dom";

interface BaseProps {
  className: string;
  [key: string]: unknown;
}

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean;
        reversed: boolean;
      } & BaseProps
    >,
    ref: Ref<HTMLSpanElement>
  ) => (
    <span
      {...props}
      ref={ref}
      style={{
        display: "inline-block",
        fontFamily: "Material Icons",
        verticalAlign: "text-bottom",
        fontSize: "24px",
        color: reversed
          ? active
            ? "white"
            : "#aaa"
          : active
          ? "black"
          : "#ccc",
        cursor: "pointer",
        marginRight: "1rem",
      }}
    />
  )
);

export const EditorValue = React.forwardRef(
  (
    {
      className,
      value,
      ...props
    }: PropsWithChildren<
      {
        value: any;
      } & BaseProps
    >,
    ref: Ref<HTMLDivElement>
  ) => {
    const textLines = value.document.nodes
      // @ts-ignore
      .map((node) => node.text)
      .toArray()
      .join("\n");
    return (
      <div
        ref={ref}
        {...props}
        style={{
          margin: "30px -20px 0",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            padding: "5px 20px",
            color: "#404040",
            borderTop: "2px solid #eeeeee",
            background: "#f8f8f8",
          }}
        >
          Slate's value as text
        </div>
        <div
          style={{
            color: "#404040",
            fontFamily: "monospace",
            fontSize: "12px",
            whiteSpace: "pre-wrap",
            padding: "10px 20px",
          }}
        >
          {textLines}
        </div>
      </div>
    );
  }
);

export const Icon = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLSpanElement>
  ) => (
    <span
      {...props}
      ref={ref}
      style={{
        fontFamily: "Material Icons",
        fontSize: "1.5rem",
        verticalAlign: "text-bottom",
      }}
    />
  )
);

export const Instruction = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLDivElement>
  ) => (
    <div
      {...props}
      ref={ref}
      style={{
        whiteSpace: "pre-wrap",
        margin: "0 -20px 10px",
        padding: "10px 20px",
        fontSize: "14px",
        background: "#f8f8e8",
      }}
    />
  )
);

export const Menu = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLDivElement>
  ) => (
    <div
      {...props}
      data-test-id="menu"
      ref={ref}
      style={{
        display: "inline-block",
      }}
    />
  )
);

export const Portal = ({ children }: { children?: ReactNode }) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

export const Toolbar = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLDivElement>
  ) => (
    <Menu
      {...props}
      ref={ref}
      style={{
        position: "relative",
        padding: "1px 18px 17px",
        margin: "0 -20px",
        borderBottom: "2px solid #eee",
        marginBottom: "20px",
      }}
    />
  )
);
