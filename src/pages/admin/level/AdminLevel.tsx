import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import FormList from "./FormList";

const AdminLevel = () => {
  return (
    <Card>
      <Breadcrumb />
      <Divider />
      <FormList />
    </Card>
  );
};

export default AdminLevel;
