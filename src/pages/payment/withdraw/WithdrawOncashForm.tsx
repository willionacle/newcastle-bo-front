import i18next from "@/i18n/i18n";
import { Button, Input } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";


interface Props {
  submit: (pin: string) => void;
  loading?: boolean;
}

export default function WithdrawOncashInput({ submit, loading }: Props) {
  const { t } = useTranslation();
  const [pin, setPin] = useState("");

  return (
    <>
    <div className="">{i18next.t("payment.pinNumber")}</div>
    <Input
      value={pin}
      onChange={(e) => setPin(e.currentTarget.value ?? "")}
      style={{ width: "100%" }}
    />
    <Button 
      onClick={() => submit(pin)} 
      style={{width: "100%", marginTop: "1rem"}} 
      loading={loading} 
      disabled={loading || pin.trim().length === 0}
    >
      {t("global.create")}
    </Button>
    </>
  )
}