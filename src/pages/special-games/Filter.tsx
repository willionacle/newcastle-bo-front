import i18next from "@/i18n/i18n";
import SearchBtn from "@/components/SearchBtn";
import { Col, Form, Input, Row, Select } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import { SetStateAction, useEffect } from "react";

interface FormProps {
  keyword: string;
  category: string;
  status: string;
  isVisible: string;
}

interface Props {
  setFilter: SetStateAction<any | undefined>;
}

const STATUS_OPTIONS = [
  { value: "draft", labelKey: "specialGames.statusDraft" },
  { value: "open", labelKey: "specialGames.statusOpen" },
  { value: "closed", labelKey: "specialGames.statusClosed" },
  { value: "settled", labelKey: "specialGames.statusSettled" },
  { value: "cancelled", labelKey: "specialGames.statusCancelled" },
];

const Filter = ({ setFilter }: Props) => {
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FormProps) => {
    const q = parse(search.replace("?", "")) as unknown as FormProps;
    navigate({
      pathname: "/special-games",
      search: stringify({
        ...q,
        keyword: e.keyword || undefined,
        category: e.category || undefined,
        status: e.status || undefined,
        isVisible: e.isVisible || undefined,
        page: 1,
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as FormProps;
    form.setFieldsValue(e);
    setFilter((prev: any) => ({
      ...prev,
      keyword: e.keyword || undefined,
      category: e.category || undefined,
      status: e.status || undefined,
      isVisible: e.isVisible || undefined,
    }));
  }, [search]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col>
          <Form.Item label={i18next.t("specialGames.title")} name={"keyword"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label={i18next.t("col.category")} name={"category"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label={i18next.t("col.status")} name={"status"}>
            <Select
              size="small"
              allowClear
              style={{ width: 140 }}
              options={STATUS_OPTIONS.map((o) => ({ value: o.value, label: i18next.t(o.labelKey) }))}
            />
          </Form.Item>
        </Col>
        <Col style={{ alignSelf: "center", marginTop: "-1.2rem" }}>
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
