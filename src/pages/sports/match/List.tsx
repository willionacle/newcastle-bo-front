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
  Tooltip,
} from "antd";
import DateRange, { DateRangeType } from "@/components/DateRange";
import { getSportsListAPI } from "@/api/sports-list/get";
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
import { QuestionCircleOutlined } from "@ant-design/icons";

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

const SportsMatchList = () => {
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

      const res = await getSportsListAPI({
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

  const columns: ColumnsType<any> = [
    {
      title: i18next.t("sportsBet.matchTime"),
      dataIndex: "start_datetime",
      key: "start_datetime",
      align: "center",
      sorter: true,
      render: (value: string) => (
        <span>{dayjs.utc(value).format("YYYY-MM-DD HH:mm:ss")}</span>
      ),
    },
    {
      title: i18next.t("title.matchStatus"),
      dataIndex: "status_kr",
      key: "status_kr",
      align: "center",
    },
    {
      title: i18next.t("col.sport"),
      dataIndex: "sports_name_kr",
      key: "sports_name_kr",
      align: "center",
    },
    {
      title: i18next.t("title.country"),
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
          }}
        >
          {record.country_image && (
            <img src={record.country_image} style={{ width: 16 }} />
          )}
          <span>{record.country_kr}</span>
        </div>
      ),
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
            gap: "2px",
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
      title: i18next.t("col.home"),
      align: "center",
      render: (_, record) => {
        const totalHomeBetAmount =
          record.home_winlose_bet_amount +
          record.home_handicap_bet_amount +
          record.home_underover_bet_amount +
          record.home_etc_bet_amount;
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "2px",
              }}
            >
              {record.home_image && (
                <img src={record.home_image} style={{ width: 16 }} />
              )}
              <span>{record.home_name}</span>
            </div>
            <span>
              {totalHomeBetAmount > 0 ? (
                <>
                  <a onClick={() => openModal(record.match_id, "1")}>
                    {commaNumber(totalHomeBetAmount)}
                  </a>
                  <Tooltip
                    title={
                      <div>
                        <div>
                          1x2: {commaNumber(record.home_winlose_bet_amount)}원
                        </div>
                        <div>
                          H: {commaNumber(record.home_handicap_bet_amount)}원
                        </div>
                        <div>
                          O/U: {commaNumber(record.home_underover_bet_amount)}원
                        </div>
                        <div>
                          ETC: {commaNumber(record.home_etc_bet_amount)}원
                        </div>
                      </div>
                    }
                  >
                    <QuestionCircleOutlined
                      style={{
                        fontSize: "14px",
                        cursor: "pointer",
                        marginLeft: "5px",
                      }}
                    />
                  </Tooltip>
                </>
              ) : (
                ""
              )}
            </span>
          </div>
        );
      },
    },
    {
      title: i18next.t("col.away"),
      render: (_, record) => {
        const totalAwayBetAmount =
          record.away_winlose_bet_amount +
          record.away_handicap_bet_amount +
          record.away_underover_bet_amount +
          record.away_etc_bet_amount;

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "2px",
              }}
            >
              {record.away_image && (
                <img src={record.away_image} style={{ width: 16 }} />
              )}
              <span>{record.away_name}</span>
            </div>

            <span>
              {totalAwayBetAmount > 0 ? (
                <>
                  <a onClick={() => openModal(record.match_id, "0")}>
                    {commaNumber(totalAwayBetAmount)}
                  </a>
                  <Tooltip
                    title={
                      <div>
                        <div>
                          1x2: {commaNumber(record.away_winlose_bet_amount)}원
                        </div>
                        <div>
                          H: {commaNumber(record.away_handicap_bet_amount)}원
                        </div>
                        <div>
                          O/U: {commaNumber(record.away_underover_bet_amount)}원
                        </div>
                        <div>
                          ETC: {commaNumber(record.away_etc_bet_amount)}원
                        </div>
                      </div>
                    }
                  >
                    <QuestionCircleOutlined
                      style={{
                        fontSize: "14px",
                        cursor: "pointer",
                        marginLeft: "5px",
                      }}
                    />
                  </Tooltip>
                </>
              ) : (
                ""
              )}
            </span>
          </div>
        );
      },
    },
    {
      title: i18next.t("title.displayStatus"),
      dataIndex: "is_delete",
      key: "is_delete",
      align: "center",
      render: (_, record) => (
        <Switch
          defaultChecked
          checked={record.is_delete ? false : true}
          onChange={(val) => updateMatchDelete(record.id, val)}
        />
      ),
    },
    {
      title: i18next.t("col.betAmount"),
      align: "center",
      dataIndex: "bet_amount",
      key: "bet_amount",
      sorter: true,
      render: (_, record) => (
        <>
          <a onClick={() => openModal(record.match_id)}>
            {commaNumber(record.bet_amount)}
          </a>

          <Tooltip
            title={
              <div>
                <div>
                  1x2:{" "}
                  {commaNumber(
                    record.home_winlose_bet_amount +
                      record.away_winlose_bet_amount +
                      record.draw_winlose_bet_amount
                  )}
                  원
                </div>
                <div>
                  H:{" "}
                  {commaNumber(
                    record.home_handicap_bet_amount +
                      record.away_handicap_bet_amount
                  )}
                  원
                </div>
                <div>
                  O/U:{" "}
                  {commaNumber(
                    record.home_underover_bet_amount +
                      record.away_underover_bet_amount
                  )}
                  원
                </div>
                <div>
                  ETC:{" "}
                  {commaNumber(
                    record.home_etc_bet_amount + record.away_etc_bet_amount
                  )}
                  원
                </div>
              </div>
            }
          >
            <QuestionCircleOutlined
              style={{
                fontSize: "14px",
                cursor: "pointer",
                marginLeft: "5px",
              }}
            />
          </Tooltip>
        </>
      ),
    },
    {
      title: i18next.t("col.winningAmount"),
      align: "center",
      dataIndex: "bet_awin_amountmount",
      key: "win_amount",
      sorter: true,
      render: (_, record) => (
        <a onClick={() => openModal(record.match_id)}>
          {commaNumber(record.win_amount)}
        </a>
      ),
    },
    {
      title: i18next.t("col.manage"),
      align: "center",
      render: (_, record) => (
        <>
          <EditBtn link={`/sports/match/${record.id}`} />
        </>
      ),
    },
  ];

  const handleSubmit = async (e: any) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;

    navigate({
      pathname: "/sports/match",
      search: stringify({
        ...q,
        ...e,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
      }),
    });
  };

  const openModal = (matchId: string, betType: string = "") => {
    setMatchId(matchId);
    setBetType(betType);
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={i18next.t("sports.matchSettings")} />
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
      />
    </Card>
  );
};

export default SportsMatchList;
