import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row } from "antd";
import { parse, stringify } from "qs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  setFilters: any;
}

interface FilterData {
  vendor_name: string;
  game_name: string;
  game_name_en: string;
  game_category: string;
}

interface QueryData {
  vendor_name: string | undefined;
  game_name: string | undefined;
  game_name_en: string | undefined;
  game_category: string | undefined;
}

const Filter = ({ setFilters }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [form] = Form.useForm<FilterData>();

  const handleSubmit = (e: FilterData) => {
    const query = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: "/system/maintenance",
      search: stringify({
        ...query,
        ...e,
        page: 1
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData;

    form.setFieldsValue(e);

    setFilters((prevData: any) => ({
      ...prevData,
      game_name: e.game_name
        ? e.game_name
        : "",
    }));
  }, [search]);

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      <Row gutter={[16, 0]}>

        <Col {...filterColProps}>
          <Form.Item
            label={t("maintenance.mt003")}
            name={"game_name"}
            initialValue={""}
          >
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col
          {...filterColProps}
          style={{
            alignSelf: "center",
          }}
        >
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
