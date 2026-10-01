import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import List from "./List";
import Filter from "./Filter";

interface Props {
  small?: boolean;
}

const CouponLog = ({ small = false }: Props) => {
  if (small) {
    return (
      <>
        <Filter />
        <Divider />
        <List />
      </>
    );
  }

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

export default CouponLog;
