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
  Switch,
  notification,
  Input,
  Button,
} from "antd";
import { getVrMarketListAPI } from "@/api/vr-game/get";
import { updateVrMarketAPI } from "@/api/vr-game/patch";
import SearchBtn from "@/components/SearchBtn";
import VrOptions from "../VrOptions.json";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import { ColumnsType } from "antd/es/table";

interface QueryData {
  sportsName: string | undefined;
  type: string | undefined;
  status: string | boolean;
}

interface Market {
  id: number;
  vr_sports_configs: {
    sports_name_kr: string;
  };
  type: string;
  status: number;
  order: number;
}

const VrMarketList = () => {
  const [data, setData] = useState<Market[]>([]);
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
      const res = await getVrMarketListAPI({
        page,
        size,
        sportsName: form.getFieldValue("sportsName")?.value,
        type: form.getFieldValue("type")?.value,
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

  const updateMarketStatus = async (id: number, val: boolean) => {
    try {
      setLoading(true);

      const status = val ? 1 : 0;

      const res = await updateVrMarketAPI({
        id,
        status,
      });

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

  const updateMarket = async (item: Market) => {
    try {
      setLoading(true);

      const res = await updateVrMarketAPI({
        id: item.id,
        status: item.status,
        order: item.order,
      });

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
      title: i18next.t("col.sport"),
      dataIndex: "sports_name_kr",
      key: "sports_name_kr",
      align: "center",
      render: (_, record) => <>{record.vr_sports_config.sports_name_kr}</>,
    },
    {
      title: i18next.t("title.marketType"),
      dataIndex: "type",
      key: "type",
      align: "center",
    },
    {
      title: i18next.t("col.inUse"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_, record) => (
        <Switch
          defaultChecked
          checked={record.status ? true : false}
          onChange={(val) => updateMarketStatus(record.id, val)}
        />
      ),
    },
    {
      title: i18next.t("userGameSettings.orderPlaceholder"),
      dataIndex: "order",
      key: "order",
      align: "center",
      render: (_, record, index) => (
        <Input
          type="number"
          value={record.order}
          size="small"
          style={{ width: 80 }}
          onChange={(e) => {
            const newOrder = Number(e.target.value);
            const newList = [...data];
            newList[index] = { ...newList[index], order: newOrder };
            setData(newList);
          }}
        />
      ),
    },
    {
      title: i18next.t("col.manage"),
      align: "center",
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => updateMarket(record)}>
            {i18next.t("sportsBet.edit")}
          </Button>
        </>
      ),
    },
  ];

  const handleSubmit = async (e: any) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: "/vr/market",
      search: stringify({
        ...q,
        ...e,
      }),
    });
  };

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={i18next.t("vrCfg.marketSettings")} />
      </Space>
      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          sportsName: { value: "", label: i18next.t("col.all") },
          type: { value: "", label: i18next.t("col.all") },
          status: { value: "", label: i18next.t("col.all") },
        }}
      >
        <Row gutter={16}>
          <Col>
            <Form.Item label={i18next.t("sports.sportType")} name={"sportsName"}>
              <Select
                labelInValue
                options={VrOptions.sportsNameFilterOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item name={"type"} label={i18next.t("col.market")}>
              <Select
                labelInValue
                options={VrOptions.marketFilterOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name={"status"} label={i18next.t("col.inUse")}>
              <Select
                labelInValue
                options={VrOptions.statusFilterOptions}
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

export default VrMarketList;
