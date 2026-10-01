import i18next from "@/i18n/i18n";
import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import { Flex, Table, TableProps, Tag, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { handleStatusTagProps } from "../handlers";
import { BetDetailsProp } from "../../../List";
import { BetTopDetailsData } from "../../../types";
import ColorizeUsername from "@/components/ColorizeUsername";

interface Prop {
  data?: BetDetailsProp['bet_top_details'];
  record?: BetDetailsProp['record'];
}

const BetTopDetail = ({ data, record }: Prop) => {
  const { t } = useTranslation();
  console.log('TOP Details', data)
  const columnsArray: TableProps<BetTopDetailsData>["columns"] = [
    {
      title: t("#"),
      dataIndex: "id",
      align: "center",
    },
    {
      title: t("col.userId"),
      dataIndex: "username",
      align: "center",
      render: (value) => <ColorizeUsername username={value} />
    },
    {
      title: t("col.betId"),
      dataIndex: "reserve_id",
      align: "center",
    },
    {
      title: t("col.isLive"),
      dataIndex: "match_type",
      align: "center",
      render: (value) => <Tag color={value == 'Live' ? "success": "warning"}>{value == 'Live' ? i18next.t("title.live") : i18next.t("betting.prematch")}</Tag>
    },
    {
      title: t("col.odds"),
      dataIndex: "odds",
      align: "center",
      render: (value) => <Tag color="default">{value }</Tag>
    },
    {
      title: t("col.amount"),
      align: "center",
      render: (_, record) => (
        <>
        <Flex gap={2} justify="center">
          <Typography.Text type="danger">{i18next.t("betting.betAmountLabel")}</Typography.Text>
          <Typography.Text strong>
            <CommaNumber value={record.amount} />
          </Typography.Text>
        </Flex>
        <Flex gap={2} justify="center">
          <Typography.Text style={{color: 'var(--ant-color-info)'}}>{i18next.t("betting.expectedAmountLabel")}</Typography.Text>
          <Typography.Text strong>
            <CommaNumber value={record.expected_amount} />
          </Typography.Text>
        </Flex>
        </>
      )
    },
    {
      title: t("col.result"),
      dataIndex: "status",
      align: "center",
      render: (value) => <Tag color={handleStatusTagProps(value).color}>{handleStatusTagProps(value).str}</Tag>
    },
    {
      title: t("col.bet"),
      dataIndex: "created_at",
      align: "center",
      render: () => <DateText date={record?.created_at!} timeStamp />,
    },
    {
      title: t("col.result"),
      dataIndex: "updated_at",
      align: "center",
      render: () => <DateText date={record?.updated_at!} timeStamp />,
    },
  ];

  return (
    <>
      <Table
      sticky 
        columns={columnsArray}
        dataSource={data}
        tableLayout="auto"
        rowKey={"id"}
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        pagination={false}
        style={{marginBottom: '1rem'}}
      />
    </>
  );
};

export default BetTopDetail;
