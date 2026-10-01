import i18next from "@/i18n/i18n";
import SaveBtn from "@/components/SaveBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row, } from "antd";
import { parse, stringify } from "qs";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  setFilters: Dispatch<SetStateAction<any | undefined>>;
}

interface FormData {
  // dateRange: DateRangeType;
  // type: string;
  // system_note: string;
  username: string;
}

interface QueryData {
  // dateRange: string[] | undefined;
  // type: string | undefined;
  // system_note: string | undefined;
  username: string | undefined;
}

const Filter = ({ setFilters }: Props) => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [form] = Form.useForm<FormData>();

  const handleSubmit = (e: FormData) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: "/promotion/referral-log",
      search: stringify({
        ...q,
        ...e,
        // dateRange: e.dateRange
        //   ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
        //   : undefined,
        page: 1
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData;

    form.setFieldsValue({
      ...e,
      // dateRange: e.dateRange
      //   ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
      //   : [null, null],
    });

    setFilters((prevData: any) => ({
      ...prevData,
      // start_date: e.dateRange ? GF.formatDate(e.dateRange[0], false) : null,
      // end_date: e.dateRange ? GF.formatDate(e.dateRange[1], false) : null,
      // system_note: e.system_note ? e.system_note : null,
      // type: e.type ? e.type : null,
      username: e.username ? e.username : null,
    }));
  }, [search]);

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      <Row gutter={16}>
        {/* <Col {...filterColProps}>
          <DateRange />
        </Col> */}

        {/* <Col {...filterColProps}>
          <Form.Item label="구분" name={"type"} initialValue={""}>
            <Select
              size="small"
              options={[
                {
                  label: "전체",
                  value: "",
                },
                {
                  label: "적립",
                  value: "적립",
                },
                {
                  label: "전환",
                  value: "전환",
                },
                {
                  label: "시스템 동시 증감",
                  value: "시스템동시증감",
                },
                {
                  label: "유저증감",
                  value: "유저증감",
                },
              ]}
            />
          </Form.Item>
        </Col> */}

        <Col {...filterColProps}>
          <Form.Item label={i18next.t("referralCfg.referrerId")} name={"username"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        {/* <Col {...filterColProps}>
          <Form.Item label="추천인아이디" name={"system_note"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col> */}

        <Col
          {...filterColProps}
          style={{
            alignSelf: "center",
          }}
        >
          <SaveBtn block size="small" />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
