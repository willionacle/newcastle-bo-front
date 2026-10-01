import i18next from "@/i18n/i18n";
import { Card, Divider, Tabs } from "antd";
import Breadcrumb from "@/components/Breadcrumb";
import DepositMethodManagement from "./DepositMethodManagement";
import DepositMethodTransfer from "./DepositMethodTransfer";

const { TabPane } = Tabs;

const DepositMethod = () => {
  return (
    <Card className="mb-4">
      <Breadcrumb replace={i18next.t("sidemenu.depositMethodSettings")} />
      <Divider />
      <Tabs defaultActiveKey="management" type="card">
        <TabPane tab={i18next.t("depoMethod.nameSetting")} key="management">
          <DepositMethodManagement />
        </TabPane>
        <TabPane tab={i18next.t("title.moveBetweenDepositMethods")} key="transfer">
          <DepositMethodTransfer />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default DepositMethod;
