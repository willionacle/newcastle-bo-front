import { PlusSquareOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  buttonLabel?: string;
  url?: string;
}

const CreateBtn = ({ buttonLabel, url }: Props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(url ? url : location.pathname + "/create");

    // window.open(location.pathname + "/create", "_blank");
  };

  return (
    <Button shape="round" icon={<PlusSquareOutlined />} onClick={handleClick}>
      {buttonLabel ? buttonLabel : t("global.create")}
    </Button>
  );
};

export default CreateBtn;
