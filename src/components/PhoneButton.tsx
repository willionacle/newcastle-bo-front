import {
  PostFindPhoneNumber,
  ResPostFindPhoneNumber,
  findPhoneNumberAPI,
} from "@/api/custom/findPhoneNumber";
import { Button } from "antd";
import { CSSProperties, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  data: PostFindPhoneNumber;
  className?: string;
  style?: CSSProperties;
}

const PhoneButton = ({ data, className = "", style = undefined }: Props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [phoneData, setPhoneData] = useState<
    ResPostFindPhoneNumber['data']
  >();

  const handleClick = async (data: PostFindPhoneNumber) => {
    setLoading(true);
    const res = await findPhoneNumberAPI(data);

    if(res.code == 0) {
      setPhoneData(res.data);
    }

  };

  return phoneData ? (
    <>{phoneData.phonenumber}</>
  ) : (
    <Button
      className={className}
      loading={loading}
      onClick={() => handleClick(data)}
      size="small"
      style={style}
    >
      {t("memberInfo.mi028")}
    </Button>
  );
};

export default PhoneButton;
