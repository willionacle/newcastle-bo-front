import { Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";

type DataType = any;

const List = () => {
  const { t } = useTranslation();

  const columns: TableProps<DataType>["columns"] = [
    {
      key: "id",
      title: t("paybackList.pl004"),
      dataIndex: "id",
    },
    {
      key: "deposit",
      title: t("paybackList.pl005"),
      dataIndex: "deposit",
    },
    {
      key: "withdrawal",
      title: t("paybackList.pl006"),
      dataIndex: "withdrawal",
    },
    {
      key: "balance",
      title: t("paybackList.pl007"),
      dataIndex: "balance",
    },
    {
      key: "type",
      title: t("paybackList.pl008"),
      dataIndex: "type",
    },
    {
      key: "lossing",
      title: t("paybackList.pl009"),
      dataIndex: "lossing",
    },
    {
      key: "payback",
      title: t("paybackList.pl010"),
      dataIndex: "payback",
    },
    {
      key: "paybackAmount",
      title: t("paybackList.pl012"),
      dataIndex: "paybackAmount",
    },
    {
      key: "category",
      title: t("paybackList.pl013"),
      dataIndex: "category",
    },
    {
      key: "status",
      title: t("paybackList.pl014"),
      dataIndex: "status",
    },
    {
      key: "processedDate",
      title: t("paybackList.pl015"),
      dataIndex: "processedDate",
    },
  ];

  return <Table
      sticky  columns={columns} />;
};

export default List;
