import i18next from "@/i18n/i18n";
import { BettingLogs, findBettingDetailAPI } from "@/api/betting-logs/get";
import DateText from "@/components/DateText";
import DetailBtn from "@/components/DetailBtn";
// import { isBetting } from "@/pages/betting/record/List";
import { PaginationProps, Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  data: BettingLogs[] | undefined;
  isLoading: boolean;
  pagination: PaginationProps;
}

const List = ({ data, isLoading, pagination }: Props) => {
  const { t } = useTranslation();

  const handleDetail = async (transactionKey: string) => {
    try {
      const res = await findBettingDetailAPI(transactionKey);

      if (res) {
        window.open(res.data.url, "_blank");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columnsArray: TableProps<BettingLogs>["columns"] = [
    {
      title: t("#"),
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: t("memberDetail.mis135"),
      dataIndex: "game_category",
      align: "center",
      render: (value: BettingLogs["game_category"]) =>
        value ? value.toUpperCase() : value,
    },
    // {
    //   title: t("memberDetail.mis137"),
    //   dataIndex: "vendorName",
    //   key: "vendorName",
    //   align: "center",
    // },
    // {
    //   title: t("memberDetail.mis051"),
    //   dataIndex: "gameName",
    //   key: "gameName",
    //   align: "center",
    // },
    // {
    //   title: t("memberDetail.mis052"),
    //   dataIndex: "parentTransactionKey",
    //   align: "center",
    // },
    {
      title: t("memberDetail.mis028"),
      dataIndex: "userId",
      key: "userId",
      align: "center",
    },
    {
      title: t("memberDetail.mis058"),
      align: "center",
      width: 70,
      render: (_, record) =>
        record.status === 1 && record.amount
          ? record.amount.toLocaleString()
          : "-",
    },
    {
      title: t("memberDetail.mis059"),
      width: 70,
      align: "center",
      render: (_, record) =>
        record.status === 2 && record.bet_result
          ? record.bet_result.toLocaleString()
          : "-",
    },
    {
      title: t("col.betDifference"),
      align: "center",
      width: 70,
    },
    {
      title: t("memberDetail.mis064"),
      dataIndex: "rollingPoint",
      align: "center",
      width: 70,
      render: (value: number) => (value ? value.toLocaleString() : "-"),
    },
    {
      title: t("memberDetail.mis138"),
      dataIndex: "rollingPointPercentage",
      align: "center",
      width: 100,

      render: (value: number) => (value ? (value * 100).toLocaleString() : "-"),
    },
    {
      title: t("memberDetail.mis061"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value: number) => {
        switch (value) {
          case 1:
            return i18next.t("col.bet");
          case 2:
            return i18next.t("col.win");
          case 3:
            return i18next.t("global.cancel");
          default:
            return value;
        }
      },
    },
    {
      title: t("memberDetail.mis062"),
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("global.action"),
      fixed: "right",
      key: "action",
      align: "center",
      render: (_, record) => (
        <DetailBtn onClick={() => handleDetail(record.transaction_id)} />
      ),
    },
  ];

  return (
    <Table
      sticky 
      columns={columnsArray}
      dataSource={data}
      rowKey={"id"}
      loading={isLoading}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
      // summary={(pageData) => {
      //   const totalBetting = pageData.reduce(
      //     (prev, current) =>
      //       prev + (current.status === 1 ? current.amount || 0 : 0),
      //     0
      //   );
      //   const totalCredit = pageData.reduce(
      //     (prev, current) =>
      //       prev + (current.status === 2 ? current.bet_result || 0 : 0),
      //     0
      //   );

      //   return (
      //     <Table.Summary fixed={"top"}>
      //       <Table.Summary.Row
      //         style={{
      //           background: "var(--ant-table-row-hover-bg)",
      //         }}
      //       >
      //         <Table.Summary.Cell index={1} colSpan={6} align="center">
      //           {t("global.sum")}
      //         </Table.Summary.Cell>
      //         <Table.Summary.Cell index={2} align="center">
      //           {totalBetting.toLocaleString()}
      //         </Table.Summary.Cell>
      //         <Table.Summary.Cell index={3} align="center">
      //           {totalCredit.toLocaleString()}
      //         </Table.Summary.Cell>
      //         <Table.Summary.Cell index={4} align="center">
      //           {(totalBetting - totalCredit).toLocaleString()}
      //         </Table.Summary.Cell>
      //         <Table.Summary.Cell index={5} align="center"></Table.Summary.Cell>
      //         <Table.Summary.Cell index={6} colSpan={5} />
      //       </Table.Summary.Row>
      //     </Table.Summary>
      //   );
      // }}
    />
  );
};

export default List;
