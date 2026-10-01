import { Card, Divider } from "antd";
import Breadcrumb from "@/components/Breadcrumb";
import TopInfo from "@/pages/user/Tabs/topinfo/TopInfo";
import { useTranslation } from "react-i18next";

const TotalRecord = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <Breadcrumb replace={t("sidemenu.sm059")} />
      <Divider />
      <TopInfo />
    </Card>
  );
};

export default TotalRecord;
