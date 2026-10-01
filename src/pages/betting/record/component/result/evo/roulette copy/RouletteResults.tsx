import { Table, Tag } from "antd";
import i18next from "@/i18n/i18n";
import { EvoRoulGameInfoData, Outcome } from "./Roulette";
import { TableProps } from "antd/lib";

function convertLuckyNumbers(luckyNumbers: Record<string, number>) {
  return Object.entries(luckyNumbers).map(([number, multiplier]) => ({
    key: number,
    number,
    multiplier
  }));
}

const RouletteResults = ({ data }: { data: EvoRoulGameInfoData }) => {

  const luckyNumbers = convertLuckyNumbers(data.luckyNumbers)

  const outcomes = data.outcomes;
  const outcomeColumns: TableProps<Outcome>["columns"] = [
    {
      title: i18next.t("title.winningNumber"), // Winning Number
      dataIndex: 'number',
    },
    {
      title: i18next.t("col.type"), // Type
      dataIndex: 'type',
    },
    {
      title: i18next.t("title.color"), // Color
      dataIndex: 'color',
      render: (value: string) => <Tag color={`${value.toLowerCase()}`}>{value}</Tag>
    }
  ];

  const luckyNumberColumns = [
    {
      title: i18next.t("title.luckyNumber"), // Lucky Number
      dataIndex: "number",
      key: "number",
    },
    {
      title: i18next.t("title.multiplier"), //Multiplier (x)
      dataIndex: "multiplier",
      key: "multiplier",
      render: (value: number) => `${value}x`,
    },
  ];

  return (
    <>
      <Table
        dataSource={outcomes}
        columns={outcomeColumns}
        tableLayout="auto"
        pagination={false}
      />
      <Table
        dataSource={luckyNumbers}
        columns={luckyNumberColumns}
        tableLayout="auto"
        pagination={false}
      />
    </>
  );
};

export default RouletteResults;
