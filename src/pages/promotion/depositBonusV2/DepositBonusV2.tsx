import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space } from "antd";
import ListV2 from "./ListV2";
import WelcomeBonusToggle from "./WelcomeBonusToggle";
import { depositBonusesV2API } from "@/api/deposit-bonuses-v2/get";
import CreateBtn from "@/components/CreateBtn";

const DepositBonusV2 = () => {
  const { swr, paginationProps, onHeaderCell } = depositBonusesV2API();

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={i18next.t("sidemenu.sm016")} />
        <CreateBtn />
      </Space>
      <Divider />
      <WelcomeBonusToggle />
      <ListV2
        data={swr.data}
        loading={swr.isLoading}
        pagination={paginationProps(swr.data?.data?.pagination?.totalItems)}
        onHeaderCell={onHeaderCell}
        mutate={swr.mutate}
      />
    </Card>
  );
};

export default DepositBonusV2;
