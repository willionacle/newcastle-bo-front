import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import Filter from "./Filter";
import List from "./List";

const AgentCommission = () => {
  return (
    <Card>
      <Breadcrumb />
      <Divider />

      <Filter />
      <Divider />

      <List />
    </Card>
  );
};
export default AgentCommission;
