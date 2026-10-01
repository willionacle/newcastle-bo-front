import { Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";

type DataType = any;

const List = () => {
  const { t } = useTranslation();

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "#",
      dataIndex: "id",
    },
    {
      title: t("couponsLog.cl002"),
      dataIndex: "id",
    },
    {
      title: t("couponsLog.cl003"),
      dataIndex: "id",
    },
    {
      title: t("couponsLog.cl006"),
      dataIndex: "id",
    },
    {
      title: t("couponsLog.cl004"),
      dataIndex: "id",
    },
    {
      title: t("couponsLog.cl005"),
      dataIndex: "id",
    },
    {
      title: t("couponsLog.cl007"),
      dataIndex: "id",
    },
    {
      title: t("couponsLog.cl008"),
      dataIndex: "id",
    },
    {
      title: t("couponsLog.cl009"),
      dataIndex: "id",
    },
    {
      title: t("couponsLog.cl010"),
      fixed: "right",
      align: "center",
      key: "action",
    },
  ];
  return <Table
      sticky columns={columns} />;
};

export default List;
