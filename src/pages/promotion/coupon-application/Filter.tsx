import i18next from "@/i18n/i18n";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row, Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { parse, stringify } from "qs";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface FormProps {
  username: string;
  event_name: string;
  bet_id: string;
  status: DefaultOptionType;
}

export interface QueryProps {
  username: string | undefined;
  event_name: string | undefined;
  bet_id: string | undefined;
  status: DefaultOptionType;
}

interface Props {
  setFilter: any;
}

const StatusOptions = [
  {
    label: "Applied",
    value: 0,
  },
  {
    label: "Waiting",
    value: 1,
  },
  {
    label: "Completed",
    value: 2,
  },
];

const Filter = ({ setFilter }: Props) => {
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FormProps) => {
    const q = parse(search.replace("?", "")) as unknown as QueryProps;
    navigate({
      pathname: "/promotion/coupon-application",
      search: stringify({
        ...q,
        ...e,
        page: 1
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryProps;
    console.log(e)
    form.setFieldsValue({
      ...e,
      status: e.status ? e.status : undefined
    });

    setFilter((prevData: any) => ({
      ...prevData,

      username: e.username
        ?  e.username
        : null,
      event_name: e.event_name
        ? e.event_name
        : null,
      bet_id: e.bet_id
        ? e.bet_id
        : null,
      status: e.status
        ? e.status.value
        : null,
    }));
  }, [search]);

  return (
    <Form form={form} layout="vertical"  onFinish={handleSubmit}>
      <Row gutter={16}>

        <Col {...filterColProps}>
          <Form.Item name={'username'} label="ID">
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
        <Form.Item label={i18next.t("col.status")} name={"status"}>
            <Select
              labelInValue
              options={StatusOptions}
              allowClear
              size="small"
            />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item name={'event_name'} label={i18next.t("col.name")}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item name={'bet_id'} label={i18next.t("promotion.betId")}>
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
