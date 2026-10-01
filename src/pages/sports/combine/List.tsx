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
  notification,
} from "antd";
import { getSportsCombineListAPI } from "@/api/sports-list/get";
import { deleteCombineAPI } from "@/api/sports-list/delete";
import DeleteBtn from "@/components/DeleteBtn";
import EditBtn from "@/components/EditBtn";
import CreateBtn from "@/components/CreateBtn";
import SearchBtn from "@/components/SearchBtn";
import TrueFalseStatus from "@/components/TrueFalseStatus";
import SportsOptions from "../SportsOptions.json";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import { ColumnsType } from "antd/es/table";

interface QueryData {
  gameType: string | undefined;
  sportsName: string | undefined;
  status: string | undefined;
  market: string | undefined;
  period: string | undefined;
  betType: string | undefined;
}

const SportsCombineList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 30,
    total: 0,
    showSizeChanger: true,
  });
  const { search } = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm<QueryData>();

  const fetchList = async (page = 1, size = pagination.pageSize) => {
    try {
      setLoading(true);
      const res = await getSportsCombineListAPI({
        page,
        size,
        gameType: form.getFieldValue("gameType")?.value,
        sportsName: form.getFieldValue("sportsName")?.value,
        status: form.getFieldValue("status")?.value,
        market: form.getFieldValue("market")?.value,
        period: form.getFieldValue("period")?.value,
        betType: form.getFieldValue("betType")?.value,
      });

      setData(res.data || []);
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
    const e = parse(search.replace("?", "")) as unknown as QueryData;

    form.setFieldsValue({
      ...e,
    });

    fetchList(pagination.current, pagination.pageSize);
  }, [search]);

  const deleteCombine = async (id: number) => {
    try {
      setLoading(true);
      const res = await deleteCombineAPI(id);

      if (res.status === 200) {
        notification.success({ message: res.data.message });
        fetchList();
      } else {
        notification.error({ message: res.data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: i18next.t("col.gameType"),
      dataIndex: "game_type",
      key: "game_type",
      align: "center",
    },
    {
      title: i18next.t("col.sport"),
      align: "center",
      render: (_, record) => (
        <>
          <span>{record.sports_name_kr} </span>
          <span>{record.league_type} </span>
          <span>{record.match_type}</span>
        </>
      ),
    },
    {
      title: i18next.t("title.comboDisabledSetting"),
      align: "center",
      render: (_, record) => {
        const getBetTypeText = (betType: any) => {
          if (betType == 1) return i18next.t("sportsBet.win");
          if (betType == 2) return i18next.t("sportsBet.draw");
          if (betType == 0) return i18next.t("sportsBet.lose");
          return betType;
        };

        return (
          <>
            <span>{record.market_type_1}</span>
            <span>
              ({record.period_type_1}, {getBetTypeText(record.bet_type_1)}){" "}
            </span>
            + <span>{record.market_type_2}</span>
            <span>
              ({record.period_type_2}, {getBetTypeText(record.bet_type_2)})
            </span>
          </>
        );
      },
    },
    {
      title: i18next.t("title.errorMessage"),
      dataIndex: "error_message",
      key: "error_message",
      align: "center",
    },
    {
      title: i18next.t("col.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value: number) => (
        <TrueFalseStatus value={value ? true : false} />
      ),
    },
    {
      title: i18next.t("col.manage"),
      align: "center",
      render: (_, record) => (
        <>
          <EditBtn link={`/sports/combine/${record.id}`} />
          <DeleteBtn handleDelete={() => deleteCombine(record.id)} />
        </>
      ),
    },
  ];

  const handleSubmit = async (e: any) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: "/sports/combine",
      search: stringify({
        ...q,
        ...e,
      }),
    });
  };

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={i18next.t("sports.combineSettings")} />
        <CreateBtn />
      </Space>
      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          gameType: { value: "", label: i18next.t("col.all") },
          sportsName: { value: "", label: i18next.t("col.all") },
          status: { value: "", label: i18next.t("col.all") },
          market: { value: "", label: i18next.t("col.all") },
          period: { value: "", label: i18next.t("col.all") },
          betType: { value: "", label: i18next.t("col.all") },
        }}
      >
        <Row gutter={16}>
          <Col>
            <Form.Item name={"gameType"} label={i18next.t("col.gameType")}>
              <Select
                labelInValue
                options={SportsOptions.gameTypeOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item label={i18next.t("sports.sportType")} name={"sportsName"}>
              <Select
                labelInValue
                options={SportsOptions.sportsNameMarketOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item name={"status"} label={i18next.t("col.status")}>
              <Select
                labelInValue
                options={SportsOptions.statusFilterOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item name={"market"} label={i18next.t("col.market")}>
              <Select
                labelInValue
                options={SportsOptions.marketTypeOptions}
                size="small"
                style={{ width: 150 }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item name={"period"} label={i18next.t("title.periodTitle")}>
              <Select
                labelInValue
                options={SportsOptions.periodTypeOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item name={"betType"} label={i18next.t("betting.betType")}>
              <Select
                labelInValue
                options={SportsOptions.betTypeOptions}
                size="small"
                style={{ width: 120 }}
              />
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

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={(pagination) => {
          const { current = 1, pageSize = 30 } = pagination;

          setPagination((prev) => ({
            ...prev,
            current,
            pageSize,
          }));

          fetchList(current, pageSize);
        }}
      />
    </Card>
  );
};

export default SportsCombineList;
