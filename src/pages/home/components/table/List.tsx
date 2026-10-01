import { ChartTableData } from "@/api/dashboard/get";
import i18next from "@/i18n/i18n";
import { ResPostList } from "@/api/types";
import CommaNumber from "@/components/CommaNumber";
import Percentage from "@/components/Percentage";
import { Table, TableProps } from "antd";

interface Props {
  data: ResPostList['data'];
  loading: boolean;
}

const List = ({ data, loading}: Props) => {

  const columnsArray: TableProps<ChartTableData>["columns"] = [
    {
      title: `${new Date().getFullYear()}년`,
      dataIndex: "month",
      key: "month",
      align: "center",
    },
    {
      title: i18next.t("col.depositAmount"),
      dataIndex: "total_deposit",
      key: "total_deposit",
      align: "center",
      render: (value) => <CommaNumber value={value} />
    },
    {
      title: i18next.t("title.depositBonusWeight"),
      align: 'center',
      children: [
        {
          title: i18next.t("col.depositBonus"),
          dataIndex: "total_bonus",
          key: "total_bonus",
          align: "center",
          render: (value) => <CommaNumber value={value} />
        },
        {
          title: i18next.t("title.weight"),
          dataIndex: "bonus_percent",
          key: "bonus_percent",
          align: "center",
          render: (value) => <Percentage value={value} />
        },
      ]
    },
    {
      title: i18next.t("title.compRollingWeight"),
      align: 'center',
      children: [
        {
          title: i18next.t("title.compRolling"),
          dataIndex: "total_rolling_point",
          key: "total_rolling_point",
          align: "center",
          render: (value) => <CommaNumber value={value} />
        },
        {
          title: i18next.t("title.weight"),
          dataIndex: "rolling_percent",
          key: "rolling_percent",
          align: "center",
          render: (value) => <Percentage value={value} />
        },
      ]
    },
    {
      title: i18next.t("title.couponWeight"),
      align: 'center',
      children: [
        {
          title: i18next.t("sidemenu.sm068"),
          dataIndex: "total_coupon",
          key: "total_coupon",
          align: "center",
          render: (value) => <CommaNumber value={value} />
        },
        {
          title: i18next.t("title.weight"),
          dataIndex: "coupon_percent",
          key: "coupon_percent",
          align: "center",
          render: (value) => <Percentage value={value} />
        },
      ]
    },
    {
      title: i18next.t("title.sumTotal"),
      dataIndex: "percentage",
      key: "percentage",
      align: "center",
      render: (_, record) => <Percentage value={record.bonus_percent + record.rolling_percent + record.coupon_percent} />
    },
  ];

  return (
    <Table
      // bordered
      className="table-border-thick"
      sticky 
      columns={columnsArray}
      dataSource={data}
      tableLayout="auto"
      rowKey={"id"}
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      loading={loading}
      pagination={false}
    />
  );
};

export default List;
