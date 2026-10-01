import { useEffect, useState } from "react";
import { Table, Alert } from "antd";
import { getVrBetHistoryAPI } from "@/api/vr-game/get";
import commaNumber from "comma-number";
import dayjs from "dayjs";
import DetailBtn from "@/components/DetailBtn";
import VrBettingDetailModal from "./VrBettingDetailModal";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Props {
  status?: string | number;
  username?: string;
  betKey?: string;
  dateRange?: string[];
}

const VrBettingRecordTable = ({
  status,
  username,
  betKey,
  dateRange,
}: Props) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [totalSummary, setTotalSummary] = useState({
    betAmount: 0,
    winAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 30,
    total: 0,
    showSizeChanger: true,
  });
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [detailData, setDetailData] = useState<any>({});

  const fetchList = async (
    page = 1,
    size = pagination.pageSize,
    sort?: string,
    order?: string
  ) => {
    try {
      setLoading(true);
      const res = await getVrBetHistoryAPI({
        page,
        size,
        from: dayjs(dateRange?.[0]).format("YYYY-MM-DD HH:mm:ss"),
        to: dayjs(dateRange?.[1]).format("YYYY-MM-DD HH:mm:ss"),
        status,
        username,
        key: betKey,
        sort,
        order,
      });

      setData(res.data || []);
      setTotalSummary({
        betAmount: res.total_bet_amount,
        winAmount: res.total_win_amount,
      });
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: size,
        total: res.total || 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(pagination.current, pagination.pageSize);
  }, [status, username, betKey, dateRange]);

  const columns: ColumnsType<any> = [
    {
      title: t("sportsBet.id"),
      align: "center",
      render: (_, record) => (
        <Link to={`/user/${record.up_user.id}`}>{record.username}</Link>
      ),
    },
    {
      title: t("sportsBet.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value: number) => {
        if (value === 0) {
          return <span>{t("global.waiting")}</span>;
        } else if (value === 1) {
          return <span style={{ color: "blue" }}>{t("sportsBet.statusHit")}</span>;
        } else if (value === 2) {
          return <span style={{ color: "red" }}>{t("sportsBet.statusMiss")}</span>;
        }
      },
    },
    {
      title: t("sportsBet.folderCount"),
      align: "center",
      render: (_, record) => <>{record.vr_bet_details.length}</>,
    },
    {
      title: t("sportsBet.totalOdds"),
      dataIndex: "total_odds",
      key: "total_odds",
      sorter: true,
      align: "center",
    },
    {
      title: t("sportsBet.bonusOdds"),
      dataIndex: "bonus_odds",
      key: "bonus_odds",
      sorter: true,
      align: "center",
    },
    {
      title: t("sportsBet.betAmount"),
      dataIndex: "bet_amount",
      key: "bet_amount",
      sorter: true,
      align: "center",
      render: (value: number) => <>{commaNumber(value)}</>,
    },
    {
      title: t("sportsBet.expectedWin"),
      align: "center",
      render: (_, record) => {
        return (
          <>{commaNumber(Math.floor(record.total_odds * record.bet_amount))}</>
        );
      },
    },
    {
      title: t("sportsBet.winAmount"),
      dataIndex: "win_amount",
      key: "win_amount",
      sorter: true,
      align: "center",
      render: (value: number) => <>{commaNumber(value)}</>,
    },
    {
      title: t("sportsBet.profit"),
      align: "center",
      render: (_, record) => (
        <>{commaNumber(record.bet_amount - record.win_amount)}</>
      ),
    },
    {
      title: t("sportsBet.betTime"),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      sorter: true,
      render: (value: string) => (
        <>{dayjs.utc(value).format("YYYY-MM-DD HH:mm:ss")}</>
      ),
    },
    {
      title: t("sportsBet.manage"),
      align: "center",
      render: (_, record) => <DetailBtn onClick={() => openDetail(record)} />,
    },
  ];

  const openDetail = (item: any) => {
    console.log(item)
    setDetailData(item);
    setIsOpenDetail(true);
  };

  const closeDetail = () => {
    setIsOpenDetail(false);
  };

  return (
    <>
      <Alert
        message={
          <>
            <span style={{ marginRight: 10 }}>
              {t("sportsBet.betAmount")}: <a>{commaNumber(totalSummary.betAmount)}원</a>
            </span>
            <span style={{ marginRight: 10 }}>
              {t("sportsBet.winAmount")}: <a>{commaNumber(totalSummary.winAmount)}원</a>
            </span>
            <span>
              {t("sportsBet.profit")}:{" "}
              <a>
                {commaNumber(totalSummary.betAmount - totalSummary.winAmount)}원
              </a>
            </span>
          </>
        }
        type="info"
        style={{ marginBottom: 12, fontSize: "14px" }}
      />
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={(pagination, _filter, sorter: any) => {
          const { current = 1, pageSize = 30 } = pagination;
          const sortField = sorter.field;
          const sortOrder =
            sorter.order === "ascend"
              ? "ASC"
              : sorter.order === "descend"
              ? "DESC"
              : undefined;

          setPagination((prev) => ({
            ...prev,
            current,
            pageSize,
          }));

          fetchList(current, pageSize, sortField, sortOrder);
        }}
      />
      <VrBettingDetailModal
        isOpen={isOpenDetail}
        close={closeDetail}
        data={detailData}
        fetchList={() => fetchList(pagination.current, pagination.pageSize)}
      />
    </>
  );
};

export default VrBettingRecordTable;
