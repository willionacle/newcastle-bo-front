import {
  ResPostFindPhoneNumber,
  findPhoneNumberAPI,
} from "@/api/custom/findPhoneNumber";
import { Button } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  phone: string;
  username: string;
  setPhone: Dispatch<SetStateAction<string>>;
}

const PhoneButtonOne = ({ phone, setPhone, username }: Props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [phoneData, setPhoneData] = useState<
    ResPostFindPhoneNumber['data']
  >();

  const handleClick = async (username: Props["username"]) => {
    setPhone(username);
  };

  useEffect(() => {
    (async function () {
      if (phone === username) {
        setLoading(true);
        const res = await findPhoneNumberAPI({ username: username });

        setPhoneData(res.data);
      } else {
        setLoading(false);
        setPhoneData(undefined);
      }
    })();
  }, [phone]);

  return phoneData ? (
    <>{phoneData.phonenumber}</>
  ) : (
    <Button
      loading={loading}
      onClick={() => handleClick(username)}
      size="small"
      type="primary"
    >
      {t("memberInfo.mi028")}
    </Button>
  );
};

export default PhoneButtonOne;
