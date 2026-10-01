import { EyeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

interface Props {
  link?: string;
  onClick?: () => void;
}

const DetailBtn = ({ link, onClick }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (link) {
      // window.open(link, "_blank");
      navigate(link);
      return;
    }

    if (onClick) {
      onClick();
      return;
    }
  };

  return <Button onClick={handleClick} icon={<EyeOutlined />} shape="circle" />;
};

export default DetailBtn;
