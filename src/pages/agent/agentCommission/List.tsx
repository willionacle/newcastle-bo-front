import { Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";

type DataType = {
  key: number;
  agent: {
    id: number;
    username?: string;
    commission_rate?: number;
  };
  deposit: number;
  withdraw: number;
  dpWd: number;
  betAmount: number;
  payout: number;
  winloss: number;
  coupon: number;
  profit: number;
  commissionRate: number | string;
  commission: number;
};

const List = () => {
  const { t } = useTranslation();

  const columns: TableProps<DataType>["columns"] = [
    {
      title: t("commission.ac000"),
      dataIndex: "agent",
    },
    {
      title: t("commission.ac001"),
      dataIndex: "deposit",
    },
    {
      title: t("commission.ac002"),
      dataIndex: "withdraw",
    },
    {
      title: t("commission.ac003"),
      dataIndex: "dpWd",
    },
    {
      title: t("commission.ac004"),
      dataIndex: "betAmount",
    },
    {
      title: t("commission.ac005"),
      dataIndex: "payout",
    },
    {
      title: t("commission.ac006"),
      dataIndex: "winloss",
    },
    {
      title: t("commission.ac007"),
      dataIndex: "coupon",
    },
    {
      title: t("commission.ac008"),
      dataIndex: "profit",
    },
    {
      title: t("commission.ac009"),
      dataIndex: "commissionRate",
      render: (commissionRate: number | string) =>
        typeof commissionRate === "string"
          ? commissionRate
          : `${commissionRate * 100}%`,
    },
    {
      title: t("commission.ac010"),
      dataIndex: "commission",
    },
  ];

  return (
    <Table
      sticky
      columns={columns}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
    />
  );
};

export default List;
