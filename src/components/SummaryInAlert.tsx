import { Alert } from "antd";
import React from "react";

interface Props {
  data: {
    label: string;
    extra?: string;
    value: React.ReactNode;
  }[];
  style?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
}


export default function SummaryInAlert({ 
  data,
  style,
  itemStyle
}: Props) {

  return (
    <Alert
        message={
          data.map((item, index) => (
            <span key={index} style={{ marginRight: 30,...itemStyle  }}>
              {item.label}: <a>{item.value}</a> <span>{item.extra}</span>
            </span>
          ))
        }
        type="info"
        style={{ 
          marginBottom: 12, 
          fontSize: "14px", 
          textAlign: "right", 
          ...style 
        }}
      />
  )
}