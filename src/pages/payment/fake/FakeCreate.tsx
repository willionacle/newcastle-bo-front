import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import FakeForm from "./FakeForm";

const FakeCreate = () => {
  return (
    <Card>
      <Breadcrumb />
      <Divider />

      <FakeForm />
    </Card>
  );
};

export default FakeCreate;
