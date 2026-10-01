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
} from "antd";
import { getMiniBetTypeListAPI } from "@/api/mini-game/get";
import EditBtn from "@/components/EditBtn";
import SearchBtn from "@/components/SearchBtn";
import TrueFalseStatus from "@/components/TrueFalseStatus";
import MiniOptions from "./MiniOptions.json";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import { ColumnsType } from "antd/es/table";

interface QueryData {
  game: string | undefined;
  name: string | undefined;
  status: string | undefined;
}

const MiniBetTypeList = () => {
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

      const res = await getMiniBetTypeListAPI({
        page,
        size,
        game: form.getFieldValue("game")?.value,
        name: form.getFieldValue("name"),
        status: form.getFieldValue("status")?.value,
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

  const columns: ColumnsType<any> = [
    {
      title: i18next.t("memberDetail.mis051"),
      dataIndex: "game",
      key: "game",
      align: "center",
      render: (value: string) => {
        if (value === "coin_powerball") {
          return <>{i18next.t("miniCfg.coinPowerball")}</>;
        } else if (value === "coin_ladder") {
          return <>{i18next.t("miniCfg.coinLadder")}</>;
        } else if (value === "eos_powerball") {
          return <>{i18next.t("miniCfg.eosPowerball")}</>;
        } else {
          return "";
        }
      },
    },
    {
      title: i18next.t("title.betName"),
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: i18next.t("col.odds"),
      dataIndex: "odds",
      key: "odds",
      align: "center",
    },
    {
      title: i18next.t("col.inUse"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value: number) => (
        <TrueFalseStatus value={value ? true : false} />
      ),
    },
    {
      title: i18next.t("userGameSettings.orderPlaceholder"),
      dataIndex: "order",
      key: "order",
      align: "center",
    },
    {
      title: i18next.t("col.manage"),
      align: "center",
      render: (_, record) => (
        <>
          <EditBtn link={`/mini/bet-type/${record.id}`} />
        </>
      ),
    },
  ];

  const handleSubmit = async (e: any) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: "/mini/bet-type",
      search: stringify({
        ...q,
        ...e,
      }),
    });
  };

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={i18next.t("miniCfg.betSettings")} />
      </Space>
      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          game: { value: "", label: i18next.t("col.all") },
          status: { value: "", label: i18next.t("col.all") },
        }}
      >
        <Row gutter={16}>
          <Col>
            <Form.Item label={i18next.t("memberDetail.mis051")} name={"game"}>
              <Select
                labelInValue
                options={MiniOptions.gameFilterOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name={"status"} label={i18next.t("col.inUse")}>
              <Select
                labelInValue
                options={MiniOptions.statusFilterOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label={i18next.t("title.betName")} name={"name"}>
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

export default MiniBetTypeList;
