import i18next from "@/i18n/i18n";
import { DateRangeType } from "@/components/DateRange";
import DateRangeTag from "@/components/DateRangeTag";
import SearchBtn from "@/components/SearchBtn";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, Row } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { CSSProperties } from "styled-components";

interface FormProps {
  dateRange: DateRangeType;
}

interface Props {
  setFilter: any;
}

const btnStyle: CSSProperties = {
  marginBottom: "1.4rem",
};

const Filter = ({ setFilter }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FormProps) => {
    navigate({
      pathname: "/statistic/agent-period",
      search: stringify({
        ...e,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as any;
    console.log("filter effect", e);
    form.setFieldsValue({
      ...e,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
    });
    setFilter((prevData: any) => ({
      ...prevData,
      username  : e.username ? e.username : null,
      tree_depth     : e.tree_depth ? e.tree_depth : null,
      start_date: e.dateRange ? GF.formatDate(e.dateRange[0], false) : null,
      end_date  : e.dateRange ? GF.formatDate(e.dateRange[1], false) : null,
      user_real_name : e.user_real_name ? e.user_real_name : null,
    }));
  }, [search]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        <Col>
          <DateRangeTag />
        </Col>
        <Col>
          <Form.Item
            label={t("ID")}
            name={"username"}
            initialValue={""}
          >
            <Input size="small" allowClear style={{width: '100%'}} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label={t("agent.al045")}
            name={"user_real_name"}
            initialValue={""}
          >
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name={"tree_depth"} label={i18next.t("col.level")}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col span={2} style={{ alignSelf: "center" }}>
          <SearchBtn size="small" block style={btnStyle} />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
