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
  Checkbox,
} from "antd";
import { getSportsMarketListAPI } from "@/api/sports-list/get";
import {
  updateSportsMarketAPI,
  updateSportsMarketStatusAPI,
} from "@/api/sports-list/patch";
// import EditBtn from "@/components/EditBtn";
import SearchBtn from "@/components/SearchBtn";
import SportsOptions from "../SportsOptions.json";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import { ColumnsType } from "antd/es/table";

interface QueryData {
  sportsName: string | undefined;
  type: string | undefined;
  period: string | undefined;
  isCross: string | undefined;
  isWinlose: string | undefined;
  isHandicap: string | undefined;
  isSpecial: string | undefined;
  isInplay: string | undefined;
  unUsed: string | boolean;
}

interface Market {
  id: number;
  sports_name_kr: string;
  type: string;
  period: string;
  name: string;
  is_cross: boolean;
  is_winlose: boolean;
  is_handicap: boolean;
  is_special: boolean;
  is_inpaly: boolean;
  order: number;
}

const SportsMarketList = () => {
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
      const res = await getSportsMarketListAPI({
        page,
        size,
        sportsName: form.getFieldValue("sportsName")?.value,
        type: form.getFieldValue("type")?.value,
        period: form.getFieldValue("period")?.value,
        isCross: form.getFieldValue("isCross")?.value,
        isWinlose: form.getFieldValue("isWinlose")?.value,
        isHandicap: form.getFieldValue("isHandicap")?.value,
        isSpecial: form.getFieldValue("isSpecial")?.value,
        isInplay: form.getFieldValue("isInplay")?.value,
        unUsed: form.getFieldValue("unUsed") === true ? 1 : 0,
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
      unUsed: e.unUsed === "true" ? true : false,
    });

    fetchList(pagination.current, pagination.pageSize);
  }, [search]);

  const updateMarketStatus = async (id: number, type: string, val: boolean) => {
    try {
      setLoading(true);

      const status = val ? 1 : 0;

      const res = await updateSportsMarketStatusAPI({
        id,
        type,
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

      const res = await updateSportsMarketAPI({
        id: item.id,
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
    },
    {
      title: i18next.t("title.marketType"),
      dataIndex: "type",
      key: "type",
      align: "center",
    },
    {
      title: i18next.t("title.periodTitle"),
      dataIndex: "period",
      key: "period",
      align: "center",
    },
    {
      title: i18next.t("title.marketName"),
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: i18next.t("title.cross"),
      dataIndex: "is_cross",
      key: "is_cross",
      align: "center",
      render: (_, record) => (
        <Switch
          defaultChecked
          checked={record.is_cross ? true : false}
          onChange={(val) => updateMarketStatus(record.id, "is_cross", val)}
        />
      ),
    },
    {
      title: i18next.t("title.wdl"),
      dataIndex: "is_winlose",
      key: "is_winlose",
      align: "center",
      render: (_, record) => (
        <Switch
          defaultChecked
          checked={record.is_winlose ? true : false}
          onChange={(val) => updateMarketStatus(record.id, "is_winlose", val)}
        />
      ),
    },
    {
      title: i18next.t("title.handicapTitle"),
      dataIndex: "is_handicap",
      key: "is_handicap",
      align: "center",
      render: (_, record) => (
        <Switch
          defaultChecked
          checked={record.is_handicap ? true : false}
          onChange={(val) => updateMarketStatus(record.id, "is_handicap", val)}
        />
      ),
    },
    {
      title: i18next.t("title.special"),
      dataIndex: "is_special",
      key: "is_special",
      align: "center",
      render: (_, record) => (
        <Switch
          defaultChecked
          checked={record.is_special ? true : false}
          onChange={(val) => updateMarketStatus(record.id, "is_special", val)}
        />
      ),
    },
    {
      title: i18next.t("title.live"),
      dataIndex: "is_inpaly",
      key: "is_inplay",
      align: "center",
      render: (_, record) => (
        <Switch
          defaultChecked
          checked={record.is_inpaly ? true : false}
          onChange={(val) => updateMarketStatus(record.id, "is_inpaly", val)}
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
          {/* <EditBtn link={`/sports/market/${record.id}`} /> */}
        </>
      ),
    },
  ];

  const handleSubmit = async (e: any) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: "/sports/market",
      search: stringify({
        ...q,
        ...e,
      }),
    });
  };

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={i18next.t("sports.marketSettings")} />
      </Space>
      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          sportsName: { value: "", label: i18next.t("col.all") },
          type: { value: "", label: i18next.t("col.all") },
          period: { value: "", label: i18next.t("col.all") },
          isCross: { value: "", label: i18next.t("col.all") },
          isWinlose: { value: "", label: i18next.t("col.all") },
          isHandicap: { value: "", label: i18next.t("col.all") },
          isSpecial: { value: "", label: i18next.t("col.all") },
          isInplay: { value: "", label: i18next.t("col.all") },
        }}
      >
        <Row gutter={16}>
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
            <Form.Item name={"type"} label={i18next.t("col.market")}>
              <Select
                labelInValue
                options={SportsOptions.marketFilterOptions}
                size="small"
                style={{ width: 120 }}
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
            <Form.Item name={"isCross"} label={i18next.t("sports.crossFlag")}>
              <Select
                labelInValue
                options={SportsOptions.statusFilterOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item name={"isWinlose"} label={i18next.t("sports.winDrawLoseFlag")}>
              <Select
                labelInValue
                options={SportsOptions.statusFilterOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item name={"isHandicap"} label={i18next.t("sports.handicapFlag")}>
              <Select
                labelInValue
                options={SportsOptions.statusFilterOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item name={"isSpecial"} label={i18next.t("sports.specialFlag")}>
              <Select
                labelInValue
                options={SportsOptions.statusFilterOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item name={"isInplay"} label={i18next.t("col.isLive")}>
              <Select
                labelInValue
                options={SportsOptions.statusFilterOptions}
                size="small"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              name="unUsed"
              valuePropName="checked"
              label={i18next.t("sports.allUnused")}
            >
              <Checkbox />
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

export default SportsMarketList;
