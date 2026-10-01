import i18next from "@/i18n/i18n";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row } from "antd";
import { parse, stringify } from "qs";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export interface FormProps {
  name: string;
  is_active: string;
  mission_type: string;
  is_used: string;
}

export interface QueryProps {
  name: string | undefined;
  is_active: string | undefined;
  mission_type: string | undefined;
  is_used: string | undefined;
}

interface Props {
  setFilter: Dispatch<SetStateAction<any>>;
}

const Filter = ({ setFilter }: Props) => {
  const { type } = useParams();
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const handleSubmit = (e: FormProps) => {
    const q = parse(search.replace("?", "")) as unknown as QueryProps;
    navigate({
      pathname,
      search: stringify({
        ...q,
        ...e,
        page: 1,
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryProps;

    form.setFieldsValue({
      ...e,
    });

    setFilter((prevData: any) => ({
      ...prevData,
      ...e,
      is_active: type === "mission" ? e.is_active ?? null : undefined,
      is_used: type === "coupon" ? e.is_used ?? null : undefined,
      mission_type: type === "mission" ? e.mission_type ?? null : undefined,
    }));
  }, [search]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={[16, 16]}>
        <Col {...filterColProps}>
          <Form.Item
            name={type === "mission" ? "name" : "coupon_name"}
            label={i18next.t("col.name")}
          >
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        {type === "mission" && (
          <Col {...filterColProps}>
            <Form.Item name={"mission_type"} label={i18next.t("event.missionType")}>
              <Input size="small" allowClear />
            </Form.Item>
          </Col>
        )}
        {/* {type === "mission" && (
          <Col {...filterColProps}>
            <Form.Item
              name={type === "mission" ? "is_active" : "is_used"}
              label={type === "mission" ? "상태" : "사용여부"}
              initialValue={null}
            >
              <Select size={"small"} allowClear>
                <Select.Option value="1">
                  {type === "mission" ? "Active" : "사용"}
                </Select.Option>
                <Select.Option value="0">
                  {type === "mission" ? "Inactive" : "미사용"}
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        )} */}

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
