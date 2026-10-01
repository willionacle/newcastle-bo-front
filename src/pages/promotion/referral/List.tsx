import { Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";

type DataType = any;

const List = () => {
  const { t } = useTranslation();

  const columns: TableProps<DataType>["columns"] = [
    {
      title: t("no.betting.user"),
      dataIndex: "order",
      width: "40%",
      className: "text-center",
    },
    {
      title: t("rolling commission" + " %"),
      dataIndex: "label",
      width: "40%",
      className: "text-center",
    },
    {
      title: t("referral.rl002"),
      dataIndex: "activated",
    },
    {
      title: "",
      fixed: "right",
      dataIndex: "action",
    },
  ];

  return <Table
      sticky columns={columns} />;
};

export default List;
