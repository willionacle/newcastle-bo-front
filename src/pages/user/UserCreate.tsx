import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import AgentCreateForm from "./AgentCreateForm";
import UserForm from "./UserForm";

const UserCreate = () => {
  const { t } = useTranslation();
  const [searchParam] = useSearchParams();
  const isAgent = Boolean(searchParam.get("depth"));

  return (
    <Card>
      <Breadcrumb replace={t("memberInfoEdit.mie000-1")} />
      <Divider />

      {isAgent ? <AgentCreateForm /> : <UserForm />}
    </Card>
  );
};

export default UserCreate;
