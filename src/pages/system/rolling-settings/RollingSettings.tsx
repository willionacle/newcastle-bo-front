import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import RollingSettingsForm from "./RollingSettingsForm";
// import List from "./List";

const RollingSettings = () => {
  return (
    <Card>
      <Breadcrumb />
      <Divider />
      {/* <List /> */}
      <RollingSettingsForm />
    </Card>
  );
};

export default RollingSettings;
