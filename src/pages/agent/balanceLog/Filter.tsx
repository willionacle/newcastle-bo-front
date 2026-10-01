import i18next from "@/i18n/i18n";
import { ResUser } from "@/api/types";
import DateRange, { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, Row } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import TypeCheckBox from "./TypeFilter/TypeCheckBox";

interface Props {
  setFilter: Dispatch<SetStateAction<any | undefined>>;
  user: ResUser['data'] | undefined;
}

interface FormData {
  dateRange: DateRangeType;
  type: string[];
  system_note: string;
}

interface QueryData {
  dateRangeM: string[];
  type: string[];
  system_note: string;
  username?: string
}

const Filter = ({ setFilter, user }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const [form] = Form.useForm<FormData>();
  
  const handleSubmit = (e: FormData) => {
    const query = parse(search.replace("?", "")) as unknown as QueryData;
    console.log('MONEYLOG form', e)
    navigate({
      pathname: `${pathname}`,
      search: stringify({
        ...query,
        ...e,
        dateRangeM: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
      }),
    });
  };

  useEffect(() => {
    console.log(pathname)
    const e = parse(search.replace("?", "")) as unknown as QueryData;
    console.log('MONEYLOG parsed search', e)
    console.log(e)
    form.setFieldsValue({
      ...e,
      type: e.type ? e.type : [''],
      dateRange: e.dateRangeM
        ? [dayjs(e.dateRangeM[0]), dayjs(e.dateRangeM[1])]
        : undefined,
    });

    setFilter((prevData: any) => ({
      ...prevData,
      username    : e.username ?? (user ? user?.username : null),
      start_date  : e.dateRangeM ? GF.formatDate(e.dateRangeM[0], false) : null,
      end_date    : e.dateRangeM ? GF.formatDate(e.dateRangeM[1], false) : null,
      type        : e.type ?  JSON.stringify(e.type) : null,
      system_note : e.system_note ? e.system_note : null,
    }));

    console.log(e.username, user?.username)
  }, [search, user]);

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      <Row gutter={[16, 0]}>
        <Col span={12}>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <DateRange />
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("ID")}
                name={"username"}
                initialValue={""}
              >
                <Input size="small" allowClear style={{width: '100%'}} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("memberDetail.mis042")}
                name={"system_note"}
                initialValue={""}
              >
                <Input size="small" allowClear />
              </Form.Item>
            </Col>
          </Row>
        </Col>

        <Col span={9}>
          <Form.Item name={"type"} label={i18next.t("col.category")} initialValue={""}>
            <TypeCheckBox />
          </Form.Item>
        </Col>

        <Col span={2} style={{ alignSelf: "center" }}>
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
