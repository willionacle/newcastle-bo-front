import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import LevelForm from "./LevelForm";

const LevelCreate = () => {
  return (
    <Card>
      <Breadcrumb />
      <Divider />
      <LevelForm data={undefined} />
    </Card>
  );
};

export default LevelCreate;
