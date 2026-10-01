import React, { useState, useEffect } from "react";
import { Button, Tooltip, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";

interface AccountCopyBtnProps {
  rowKey: string;
  textToCopy: string;
}

const CopyBtn: React.FC<AccountCopyBtnProps> = ({
  rowKey,
  textToCopy
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const STORAGE_KEY = "withdrawal_copied_ids";

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const copiedIds: string[] = JSON.parse(saved);
      if (copiedIds.includes(rowKey)) {
        setIsCopied(true);
      }
    }
  }, [rowKey]);

  const handleCopy = () => {

    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);

      const saved = localStorage.getItem(STORAGE_KEY);
      const copiedIds: string[] = saved ? JSON.parse(saved) : [];
      
      if (!copiedIds.includes(rowKey)) {
        const updatedIds = [...copiedIds, rowKey];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIds));
      }

      message.success("Copied to clipboard!");
    }).catch(() => {
      message.error("Failed to copy.");
    });
  };

  return (
    <Tooltip title={isCopied ? "Already Copied" : "Copy"}>
      <Button
        type="text"
        size="small"
        icon={
          <CopyOutlined 
            style={{ 
              color: isCopied ? "#bfbfbf" : "#1677ff",
              fontSize: '16px' 
            }} 
          />
        }
        disabled={isCopied}
        onClick={handleCopy}
      />
    </Tooltip>
  );
};

export default CopyBtn;