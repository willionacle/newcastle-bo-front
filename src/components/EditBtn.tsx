import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

interface Props {
  link: string;
}

const EditBtn = ({ link }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // window.open(link, "_blank");
    navigate(link);
  };

  return (
    <Button onClick={handleClick} shape="circle" icon={<EditOutlined />} />
  );
};

export default EditBtn;
