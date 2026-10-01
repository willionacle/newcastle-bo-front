import { findPhoneNumberAPI } from "@/api/custom/findPhoneNumber";
import { PhoneOutlined } from "@ant-design/icons";
import { Button, Tooltip, message } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  username: string;
}

// Card-deposit withdrawals are processed through the card payment agent's
// external solution, keyed by the user's phone number. This button fetches the
// phone number on click and copies it to the clipboard WITHOUT displaying it.
const PhoneCopyBtn = ({ username }: Props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    setLoading(true);
    try {
      const res = await findPhoneNumberAPI({ username });
      const phone = res.data?.phonenumber;

      if (!phone) {
        message.error(t("copyBtn.phoneNotFound"));
        return;
      }

      await navigator.clipboard.writeText(phone);
      message.success(t("copyBtn.phoneCopied"));
    } catch {
      message.error(t("copyBtn.phoneCopyFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title={t("copyBtn.copyPhone")}>
      <Button
        shape="circle"
        icon={<PhoneOutlined />}
        loading={loading}
        onClick={handleCopy}
        style={{
          backgroundColor: "#16a34a",
          borderColor: "#16a34a",
          color: "#ffffff",
        }}
      />
    </Tooltip>
  );
};

export default PhoneCopyBtn;
