import { useEffect, useState } from "react";
import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Card,
  Divider,
  Space,
  Table,
  Form,
  Row,
  Col,
  Select,
  Input,
  Alert,
  Switch,
  notification,
} from "antd";
import DateRange, { DateRangeType } from "@/components/DateRange";
import { getSportsBetListAPI } from "@/api/sports-list/get";
import { updateMatchDeleteAPI } from "@/api/sports-list/patch";
import EditBtn from "@/components/EditBtn";
import SearchBtn from "@/components/SearchBtn";
import SportsOptions from "../SportsOptions.json";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import commaNumber from "comma-number";
import SportsBettingRecordModal from "@/components/SportsBettingRecordModal";
import { ColumnsType } from "antd/es/table";
import CreateBtn from "@/components/CreateBtn";

interface FormProps {
  dateRange: DateRangeType;
  sportsName: string;
  statusId: string;
  teamName: string;
  leagueName: string;
  country: string;
  isDelete: string;
}

interface QueryData {
  dateRange: string[] | undefined;
  sportsName: string | undefined;
  statusId: any | undefined;
  teamName: string | undefined;
  leagueName: string | undefined;
  country: string | undefined;
  isDelete: string | undefined;
}

// 스코어 파싱 함수
const parseScore = (scoreStr: string) => {
  if (!scoreStr) return { home: "-", away: "-" };
  try {
    const parsed = JSON.parse(scoreStr);
    return {
      home: parsed.home?.score ?? "-",
      away: parsed.away?.score ?? "-",
    };
  } catch {
    return { home: "-", away: "-" };
  }
};

// 상태 색상 함수
const getStatusStyle = (status: string) => {
  switch (status) {
    case "경기전":
      return { color: "#1890ff", borderColor: "#1890ff" };
    case "경기중":
      return { color: "#52c41a", borderColor: "#52c41a" };
    case "마감":
    case "경기종료":
      return { color: "#888", borderColor: "#d9d9d9" };
    default:
      return { color: "#1890ff", borderColor: "#d9d9d9" };
  }
};

const SportsMatchBet = () => {
  const [data, setData] = useState([]);
  const [totalSummary, setTotalSummary] = useState({
    betAmount: 0,
    winAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const { search } = useLocation();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 30,
    total: 0,
    showSizeChanger: true,
  });
  const [form] = Form.useForm<FormProps>();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [matchId, setMatchId] = useState("");
  const [betType, setBetType] = useState("");
  const [marketType, setMarketType] = useState<unknown>("");

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData;

    if (e.statusId) {
      e.statusId = e.statusId.map((item: any) => ({
        ...item,
        value: Number(item.value),
      }));
    }

    form.setFieldsValue({
      ...e,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
    });

    fetchList(pagination.current, pagination.pageSize);
  }, [search]);

  const fetchList = async (
    page = 1,
    size = pagination.pageSize,
    sort?: string,
    order?: string
  ) => {
    try {
      setLoading(true);

      const e = parse(search.replace("?", "")) as unknown as QueryData;

      let statusId;
      if (form.getFieldValue("statusId")?.length > 0) {
        statusId = form
          .getFieldValue("statusId")
          .map((item: any) => item.value)
          .join(",");
      }

      const res = await getSportsBetListAPI({
        page,
        size,
        from: e.dateRange
          ? dayjs(e.dateRange[0])?.format("YYYY-MM-DD HH:mm:ss")
          : null,
        to: e.dateRange
          ? dayjs(e.dateRange[1])?.format("YYYY-MM-DD HH:mm:ss")
          : null,
        sportsName: form.getFieldValue("sportsName")?.value,
        statusId,
        teamName: form.getFieldValue("teamName"),
        leagueName: form.getFieldValue("leagueName"),
        country: form.getFieldValue("country"),
        isDelete: form.getFieldValue("isDelete")?.value,
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

  const updateMatchDelete = async (id: number, val: boolean) => {
    try {
      setLoading(true);
      const isDelete = val ? 0 : 1;

      const res = await updateMatchDeleteAPI(id, isDelete);

      if (res.status === 200) {
        notification.success({ message: res.data.message });

        fetchList(pagination.current, pagination.pageSize);
      } else {
        notification.error({ message: res.data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const openModal = (
    matchId: string,
    betType: string = "",
    market?: string
  ) => {
    setMatchId(matchId);
    setBetType(betType);
    setMarketType(market);
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const BetDetails = ({
    winlose,
    handicap,
    underover,
    etc,
    matchId,
    betType,
  }: {
    winlose: number;
    handicap: number;
    underover: number;
    etc: number;
    matchId: string;
    betType: string;
  }) => (
    <div style={{ fontSize: "12px" }}>
      <style>{`
        .bet-span {
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .bet-span:hover {
          color: #0037ff;
        }
      `}</style>
      <div>
        <span
          className="bet-span"
          onClick={() => openModal(matchId, betType, i18next.t("sports.winLose1x2"))}
        >
          승패: {commaNumber(winlose)}원
        </span>
      </div>
      <div>
        <span
          className="bet-span"
          onClick={() => openModal(matchId, betType, i18next.t("title.handicapTitle"))}
        >
          핸디: {commaNumber(handicap)}원
        </span>
      </div>
      <div>
        <span
          className="bet-span"
          onClick={() => openModal(matchId, betType, i18next.t("sports.underOver2"))}
        >
          언옵: {commaNumber(underover)}원
        </span>
      </div>
      {etc > 0 && (
        <div>
          <span
            className="bet-span"
            onClick={() => openModal(matchId, betType, "etc")}
          >
            {i18next.t("user.etcLabel")} {commaNumber(etc)}원
          </span>
        </div>
      )}
    </div>
  );

  const columns: ColumnsType<any> = [
    {
      title: i18next.t("col.sport"),
      dataIndex: "sports_name_kr",
      key: "sports_name_kr",
      align: "center",
      width: 80,
    },
    {
      title: i18next.t("col.date"),
      dataIndex: "start_datetime",
      key: "start_datetime",
      align: "center",
      width: 140,
      sorter: true,
      render: (value: string) => dayjs.utc(value).format("YY-MM-DD HH:mm:ss"),
    },
    {
      title: i18next.t("col.league"),
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          {record.league_image && (
            <img src={record.league_image} style={{ width: 16 }} />
          )}
          <span>{record.league_name}</span>
        </div>
      ),
    },
    {
      title: i18next.t("col.status"),
      dataIndex: "status_kr",
      key: "status_kr",
      align: "center",
      width: 80,
      render: (value: string) => {
        const style = getStatusStyle(value);
        return (
          <span
            style={{
              color: style.color,
              border: `1px solid ${style.borderColor}`,
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            {value}
          </span>
        );
      },
    },
    {
      title: i18next.t("col.finalScore"),
      align: "center",
      width: 100,
      render: (_, record) => {
        const score = parseScore(record.score);
        return (
          <span>
            {score.home} : {score.away}
          </span>
        );
      },
    },

    {
      title: i18next.t("col.home"),
      align: "center",
      width: 220,
      render: (_, record) => {
        const totalHomeBetAmount =
          record.home_winlose_bet_amount +
          record.home_handicap_bet_amount +
          record.home_underover_bet_amount +
          record.home_etc_bet_amount;
        const score = parseScore(record.score);

        return (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                marginBottom: "4px",
                fontWeight: "bold",
              }}
            >
              {record.home_image && (
                <img src={record.home_image} style={{ width: 16 }} />
              )}
              <span>{record.home_name}</span>
              <span>{score.home}</span>
            </div>
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
              <a onClick={() => openModal(record.match_id, "1")}>
                {commaNumber(totalHomeBetAmount)}원
              </a>
            </div>
            <BetDetails
              winlose={record.home_winlose_bet_amount}
              handicap={record.home_handicap_bet_amount}
              underover={record.home_underover_bet_amount}
              etc={record.home_etc_bet_amount}
              matchId={record.match_id}
              betType="1"
            />
          </div>
        );
      },
    },
    {
      title: "VS",
      align: "center",
      width: 100,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ marginBottom: 4 }}>vs</div>
          {record.handicap_line && (
            <div style={{ color: "#722ed1" }}>핸디: {record.handicap_line}</div>
          )}
          {record.underover_line && (
            <div style={{ color: "#1890ff" }}>
              언옵: {record.underover_line}
            </div>
          )}
        </div>
      ),
    },
    {
      title: i18next.t("col.away"),
      align: "center",
      width: 220,
      render: (_, record) => {
        const totalAwayBetAmount =
          record.away_winlose_bet_amount +
          record.away_handicap_bet_amount +
          record.away_underover_bet_amount +
          record.away_etc_bet_amount;
        const score = parseScore(record.score);

        return (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                marginBottom: "4px",
                fontWeight: "bold",
              }}
            >
              {record.away_image && (
                <img src={record.away_image} style={{ width: 16 }} />
              )}
              <span>{score.away}</span>
              <span>{record.away_name}</span>
            </div>
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
              <a onClick={() => openModal(record.match_id, "0")}>
                {commaNumber(totalAwayBetAmount)}원
              </a>
            </div>
            <BetDetails
              winlose={record.away_winlose_bet_amount}
              handicap={record.away_handicap_bet_amount}
              underover={record.away_underover_bet_amount}
              etc={record.away_etc_bet_amount}
              matchId={record.match_id}
              betType="0"
            />
          </div>
        );
      },
    },
        {
      title: i18next.t("col.betTotal"),
      align: "center",
      width: 140,
      dataIndex: "bet_amount",
      key: "bet_amount",
      sorter: true,
      render: (_, record) => {
        const winloseAmount =
          record.home_winlose_bet_amount +
          record.away_winlose_bet_amount +
          record.draw_winlose_bet_amount;
        const handicapAmount =
          record.home_handicap_bet_amount + record.away_handicap_bet_amount;
        const underoverAmount =
          record.home_underover_bet_amount + record.away_underover_bet_amount;
        const etcAmount =
          record.home_etc_bet_amount + record.away_etc_bet_amount;

        return (
          <div>
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
              <a onClick={() => openModal(record.match_id, "", "")}>
                {commaNumber(record.bet_amount)}원
              </a>
            </div>
            <BetDetails
              winlose={winloseAmount}
              handicap={handicapAmount}
              underover={underoverAmount}
              etc={etcAmount}
              matchId={record.match_id}
              betType=""
            />
          </div>
        );
      },
    },
    {
      title: i18next.t("col.winningAmount"),
      align: "center",
      dataIndex: "win_amount",
      key: "win_amount",
      width: 100,
      sorter: true,
      render: (_, record) => (
        <div style={{display: "flex", flexDirection: "column"}}>
          <p onClick={() => openModal(record.match_id)} style={{cursor: "pointer"}}>
           {commaNumber(record.expected_win_amount)}원
          </p>
          <a onClick={() => openModal(record.match_id)}>
           {commaNumber(record.win_amount)}원
          </a>
        </div>
      ),
    },
    {
      title: i18next.t("userGameSettings.shown"),
      dataIndex: "is_delete",
      key: "is_delete",
      align: "center",
      width: 60,
      render: (_, record) => (
        <Switch
          size="small"
          checked={!record.is_delete}
          onChange={(val) => updateMatchDelete(record.id, val)}
        />
      ),
    },
    {
      title: i18next.t("col.manage"),
      align: "center",
      width: 60,
      render: (_, record) => <EditBtn link={`/sports/match/${record.id}`} />,
    },
  ];

  const handleSubmit = async (e: any) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;

    navigate({
      pathname: "/betting/matchbet",
      search: stringify({
        ...q,
        ...e,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
      }),
    });
  };

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={i18next.t("sidemenu.matchBettingRecordsDomestic")} />
        <CreateBtn />
      </Space>
      <Divider />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          sportsName: { value: "", label: i18next.t("col.all") },
          isDelete: { value: "", label: i18next.t("col.all") },
        }}
      >
        <Row gutter={16}>
          <Col>
            <DateRange showTime />
          </Col>
          <Col>
            <Form.Item label={i18next.t("sports.sportType")} name={"sportsName"}>
              <Select
                labelInValue
                options={SportsOptions.sportsNameFilterOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label={i18next.t("title.matchStatus")} name={"statusId"}>
              <Select
                mode="multiple"
                labelInValue
                options={SportsOptions.matchStatusOptions}
                placeholder={i18next.t("title.matchStatus")}
                size="small"
                style={{ minWidth: 120 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label={i18next.t("title.displayStatus")} name={"isDelete"}>
              <Select
                labelInValue
                options={SportsOptions.deleteFilterOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label={i18next.t("sports.teamName")} name={"teamName"}>
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label={i18next.t("col.leagueName")} name={"leagueName"}>
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label={i18next.t("col.countryName")} name={"country"}>
              <Input size="small" />
            </Form.Item>
          </Col>

          <Col
            style={{
              alignSelf: "center",
            }}
          >
            <SearchBtn size="small" block />
          </Col>
        </Row>
      </Form>

      <Divider />

      <Alert
        message={
          <>
            <span style={{ marginRight: 10 }}>
              베팅금액: <a>{commaNumber(totalSummary.betAmount)}원</a>
            </span>
            <span style={{ marginRight: 10 }}>
              당첨금액: <a>{commaNumber(totalSummary.winAmount)}원</a>
            </span>
            <span>
              수익:{" "}
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

      <SportsBettingRecordModal
        isOpen={isOpenModal}
        close={closeModal}
        matchId={matchId}
        betType={betType}
        marketType={marketType}
      />
    </Card>
  );
};

export default SportsMatchBet;
