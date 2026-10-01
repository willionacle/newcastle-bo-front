import React from 'react';
import { Button, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface TruncatedCopyProps {
  text: string | null | undefined;
  maxLength?: number;
  showCopyButton?: boolean;
}

const TruncatedCopy: React.FC<TruncatedCopyProps> = ({
  text,
  maxLength = 5,
  showCopyButton = true
}) => {
  const { t } = useTranslation();
  const handleCopy = () => {
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      message.success(t('toast.common.copied'));
    }).catch(() => {
      message.error(t('toast.common.copyFailed'));
    });
  };

  if (!text) return <span>-</span>;

  const displayText = text.length > maxLength 
    ? `${text.substring(0, maxLength)}...` 
    : text;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span>{displayText}</span>
      {showCopyButton && text.length > maxLength && (
        <Button 
          size="small" 
          type="text" 
          icon={<CopyOutlined />} 
          onClick={handleCopy}
          style={{ padding: '0 4px', minWidth: 'auto' }}
        />
      )}
    </div>
  );
};

export default TruncatedCopy;