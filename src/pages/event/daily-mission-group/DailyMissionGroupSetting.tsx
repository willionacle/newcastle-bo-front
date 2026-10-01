import Breadcrumb from "@/components/Breadcrumb";
import CreateBtn from "@/components/CreateBtn";
import { Card, Divider, Space } from "antd";
import List from "./List";
import { getDailyMissionGroupListAPI } from "@/api/daily-mission/get";
import { useTranslation } from "react-i18next";

const DailyMissionGroupSetting = () => {
  const { t } = useTranslation()
  const { swr, onHeaderCell, paginationProps } = getDailyMissionGroupListAPI();

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={t("sidemenu.sm064")} />
        <CreateBtn />
      </Space>

      <Divider />

      <List
        data={swr.data ? swr.data.data : undefined}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
        mutate={swr.mutate}
      />
    </Card>
  );
};

export default DailyMissionGroupSetting;
