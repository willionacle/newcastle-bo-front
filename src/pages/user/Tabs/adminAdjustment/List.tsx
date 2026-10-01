import { Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";

type DataType = any;

const List = () => {
  const { t } = useTranslation();

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "#",
    },
    {
      title: t("memberDetail.mis121"),
    },
    {
      title: t("memberDetail.mis119"),
    },
    {
      title: t("memberDetail.mis120"),
    },
    {
      title: t("memberDetail.mis122"),
    },
    {
      title: t("memberDetail.mis123"),
    },
  ];

  return <Table
      sticky columns={columns} />;
};

export default List;
