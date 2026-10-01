import Breadcrumb from "@/components/Breadcrumb";
import CreateBtn from "@/components/CreateBtn";
import { Card, Divider, Space } from "antd";
import List from "./List";
import { getDailyMissioCouponListAPI } from "@/api/daily-mission/mission-coupon/get";
import { useParams } from "react-router-dom";
import Filter from "./Filter";
import { useTranslation } from "react-i18next";

const MissionCoupon = () => {
  const { t } = useTranslation();
  const { type } = useParams();
  const { swr, onHeaderCell, paginationProps, setFilters } = getDailyMissioCouponListAPI(type);

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={type === 'mission' ? t("sidemenu.sm070") : t("sidemenu.sm071")} />
        <CreateBtn />
      </Space>
      <Divider />
      <Filter setFilter={setFilters} />
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

export default MissionCoupon;
