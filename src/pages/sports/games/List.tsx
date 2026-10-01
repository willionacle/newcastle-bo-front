import {
  SportGame,
  SportGameMarket,
  SportGameMarketType,
} from "@/api/sport-games/get";
import DateText from "@/components/DateText";
import { Space, Table, TableProps, Tag } from "antd";
import { PaginationProps } from "antd/lib";
import type { SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  data: SportGame[];
  loading: boolean;
  pagination: PaginationProps;
}

const hideBrokenImage = (e: SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.display = "none";
};

const renderImageWithLabel = (image: string | undefined, label: string) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    }}
  >
    {image && (
      <img src={image} onError={hideBrokenImage} style={{ width: 16 }} />
    )}
    <span>{label || "-"}</span>
  </div>
);

const findMarket = (markets: SportGameMarket[], type: SportGameMarketType) =>
  markets?.find((market) => market.marketType === type);

const formatRate = (rate: number | null | undefined) =>
  rate === null || rate === undefined ? "-" : rate.toFixed(2);

const formatStandard = (standard: number | null | undefined) =>
  standard === null || standard === undefined
    ? "-"
    : standard > 0
    ? `+${standard}`
    : `${standard}`;

const render1x2 = (markets: SportGameMarket[]) => {
  const market = findMarket(markets, "1x2");
  if (!market) return "-";

  return (
    <Space size={4} style={{ whiteSpace: "nowrap" }}>
      <Tag color="blue">H {formatRate(market.homeRate)}</Tag>
      <Tag>D {formatRate(market.drawRate)}</Tag>
      <Tag color="red">A {formatRate(market.awayRate)}</Tag>
    </Space>
  );
};

const renderHandicap = (markets: SportGameMarket[]) => {
  const market = findMarket(markets, "handicap");
  if (!market) return "-";

  return (
    <Space size={4} style={{ whiteSpace: "nowrap" }}>
      <Tag color="blue">
        H {formatStandard(market.homeStandard)} @{formatRate(market.homeRate)}
      </Tag>
      <Tag color="red">
        A {formatStandard(market.awayStandard)} @{formatRate(market.awayRate)}
      </Tag>
    </Space>
  );
};

const renderUnderOver = (markets: SportGameMarket[]) => {
  const market = findMarket(markets, "underover");
  if (!market) return "-";

  return (
    <Space size={4} style={{ whiteSpace: "nowrap" }}>
      <Tag>{market.standard ?? "-"}</Tag>
      <Tag color="green">O @{formatRate(market.overRate)}</Tag>
      <Tag color="volcano">U @{formatRate(market.underRate)}</Tag>
    </Space>
  );
};

const List = ({ data, loading, pagination }: Props) => {
  const { t } = useTranslation();

  const columns: TableProps<SportGame>["columns"] = [
    {
      title: "No",
      align: "center",
      width: 60,
      render: (_value, _record, index) =>
        (pagination.total ?? 0) -
        ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 30) -
        index,
    },
    {
      title: t("col.sport"),
      dataIndex: "sport",
      key: "sport",
      align: "center",
      width: 100,
    },
    {
      title: t("col.country"),
      dataIndex: "countryKor",
      key: "countryKor",
      align: "center",
      width: 120,
      render: (value: string, record) =>
        renderImageWithLabel(record.countryImage, value),
    },
    {
      title: t("col.league"),
      key: "league",
      align: "center",
      width: 160,
      render: (_value, record) =>
        renderImageWithLabel(
          record.leagueImage,
          record.leagueKor || record.league
        ),
    },
    {
      title: t("col.homeTeam"),
      key: "homeTeam",
      align: "center",
      render: (_value, record) => record.homeTeamKor || record.homeTeam,
    },
    {
      title: t("col.awayTeam"),
      key: "awayTeam",
      align: "center",
      render: (_value, record) => record.awayTeamKor || record.awayTeam,
    },
    {
      title: t("col.kickoffTime"),
      dataIndex: "gameDatetime",
      key: "gameDatetime",
      align: "center",
      width: 150,
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: "1X2",
      key: "market1x2",
      align: "center",
      render: (_value, record) => render1x2(record.markets),
    },
    {
      title: t("col.handicap"),
      key: "handicap",
      align: "center",
      render: (_value, record) => renderHandicap(record.markets),
    },
    {
      title: t("col.underOver"),
      key: "underOver",
      align: "center",
      render: (_value, record) => renderUnderOver(record.markets),
    },
    {
      title: t("col.fetchedAt"),
      dataIndex: "fetchedAt",
      key: "fetchedAt",
      align: "center",
      width: 150,
      render: (value: string) => <DateText date={value} timeStamp />,
    },
  ];

  return (
    <Table
      sticky
      dataSource={data}
      loading={loading}
      columns={columns}
      tableLayout="auto"
      rowKey="gameId"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      style={{ marginTop: "1rem" }}
      pagination={pagination}
    />
  );
};

export default List;
