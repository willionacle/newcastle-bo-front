import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import List from "./List";
import GlobalConfig from "./GlobalConfig";
import { getGradePolicies } from "@/api/grade-policies/get";

const GradeSettings = () => {
  const { data, isLoading, mutate } = getGradePolicies();

  return (
    <Card>
      <Breadcrumb />
      <Divider />
      <GlobalConfig />
      <List
        data={data ?? []}
        loading={isLoading}
        mutate={mutate}
      />
    </Card>
  );
};

export default GradeSettings;
