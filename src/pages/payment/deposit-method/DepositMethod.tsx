import i18next from "@/i18n/i18n";
import { Card, Divider, Tabs } from "antd";
import Breadcrumb from "@/components/Breadcrumb";
import DepositMethodManagement from "./DepositMethodManagement";
import DepositMethodTransfer from "./DepositMethodTransfer";
import DepositMethodBulkUsers from "./DepositMethodBulkUsers";

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
        <TabPane tab={i18next.t("depoMethodBulk.enable.tab")} key="enable-users">
          <DepositMethodBulkUsers mode="enable" />
        </TabPane>
        <TabPane tab={i18next.t("depoMethodBulk.disable.tab")} key="disable-users">
          <DepositMethodBulkUsers mode="disable" />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default DepositMethod;
