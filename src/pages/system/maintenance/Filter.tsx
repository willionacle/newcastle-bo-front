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

    // Land on the Sports tab by default when the page is opened fresh (no
    // game_category in the URL yet) — replace (not push) so it doesn't add
    // an extra back-button entry, and re-run this effect once `search` picks
    // up the new query.
    if (!e.game_category) {
      navigate(
        {
          pathname: "/system/maintenance",
          search: stringify({ ...e, game_category: "sports-lobby" }),
        },
        { replace: true }
      );
      return;
    }

    form.setFieldsValue(e);

    setFilters((prevData: any) => ({
      ...prevData,
      vendor_name: e.vendor_name
        ? e.vendor_name
        : "",
      // game_name: e.game_name
      //   ?  e.game_name
      //   : "",
      game_name_en: e.game_name_en
        ? e.game_name_en
        : "",
      game_category: e.game_category
        ? e.game_category
        : "",
    }));
  }, [search]);

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form} style={{display: 'none'}}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <Form.Item
            label={t("maintenance.mt001")}
            name={"vendor_name"}
            initialValue={""}
          >
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        {/* <Col {...filterColProps}>
          <Form.Item
            label={t("maintenance.mt002")}
            name={"game_name"}
            initialValue={""}
          >
            <Input size="small" allowClear />
          </Form.Item>
        </Col> */}

        <Col {...filterColProps}>
          <Form.Item
            label={t("maintenance.mt003")}
            name={"game_name_en"}
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
