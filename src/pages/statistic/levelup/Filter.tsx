import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import { SetStateAction, useEffect } from "react";

interface FormProps {
  username: string;
}

interface Props {
  setFilter: SetStateAction<any | undefined>
}

interface QueryData {
  username: string;
}

const Filter = ({setFilter}: Props) => {
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FormProps) => {
    console.log('user filter stats',e)
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: "/statistic/level-up",
      search: stringify({
        ...q,
        username: e.username ? e.username : undefined,
        page: 1
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData;
    console.log('filter effect',e)
    form.setFieldsValue({
      ...e,
    });
    setFilter((prevData: any) => ({
      ...prevData,
      username: e.username ? e.username : null,
    }))
  }, [search]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>

        <Col {...filterColProps}>
          <Form.Item label="ID" name={"username"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col
          {...filterColProps}
          style={{ alignSelf: "center" }}
        >
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
