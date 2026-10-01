import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import HeroManagementForm from "./HeroManagementForm";

const HeroManagementCreate = () => {
  return (
    <Card>
      <Breadcrumb />
      <Divider />

      <HeroManagementForm />
    </Card>
  );
};

export default HeroManagementCreate;
