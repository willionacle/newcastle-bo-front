import { ResUser } from "@/api/types";
// import { User } from "@/api/users/get";
import { DateRangeType } from "@/components/DateRange";
// import PaymentStatusSelector from "@/components/PaymentStatusSelector";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Row } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { Dispatch, SetStateAction, useEffect } from "react";
// import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import DateRangeTag from "../topinfo/DateRangeTag";

interface Props {
  setFilters: Dispatch<SetStateAction<any | undefined>>;
  user: ResUser["data"] | undefined;
}

interface FilterData {
  dateRange: DateRangeType;
  bonusName: string | undefined;
  adminId: string | undefined;
  systemNote: string | undefined;
  username?: string;
}

interface QueryData {
  dateRangeT: string[] | undefined;
  bonusName: string | undefined;
  adminId: string | undefined;
  systemNote: string | undefined;
  username?: string;
}

const Filter = ({ setFilters, user }: Props) => {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const [form] = Form.useForm<FilterData>();

  const handleSubmit = (e: FilterData) => {
    const query = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: `${pathname}`,
      search: stringify({
        ...query,
        ...e,
        tab: pathname.includes("/user") ? "deposit-log" : undefined,
        dateRangeT: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
        page: 1,
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData;

    form.setFieldsValue({
      ...e,
      dateRange: e.dateRangeT
        ? [dayjs(e.dateRangeT[0]), dayjs(e.dateRangeT[1])]
        : [null, null],
    });

    setFilters((prevData: any) => ({
      ...prevData,
      username: e.username ?? (user ? user?.username : null),
      start_date: e.dateRangeT ? GF.formatDate(e.dateRangeT[0], true) : null,
      end_date: e.dateRangeT ? GF.formatDate(e.dateRangeT[1], true) : null,
    }));
  }, [search]);

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData;

    form.setFieldsValue({
      ...e,
      dateRange: e.dateRangeT
        ? [dayjs(e.dateRangeT[0]), dayjs(e.dateRangeT[1])]
        : [null, null],
    });

    setFilters((prevData: any) => ({
      ...prevData,
      start_date: e.dateRangeT ? GF.formatDate(e.dateRangeT[0], true) : null,
      end_date: e.dateRangeT ? GF.formatDate(e.dateRangeT[1], true) : null,
    }));
  }, []);

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <Form.Item>
            <DateRangeTag
              showTime={{
                defaultValue: [
                  dayjs("00:00:00", "HH:mm:ss"),
                  dayjs("23:59:59", "HH:mm:ss"),
                ],
              }}
            />
          </Form.Item>
        </Col>

        {/* <Col {...filterColProps}>
          <Form.Item label={t("deposit.de014")} name={"bonusName"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <PaymentStatusSelector />
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("deposit.de009")} name={"adminId"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("deposit.de015")} name={"systemNote"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col> */}

        <Col
          {...filterColProps}
          style={{
            alignSelf: "center",
            marginBottom: "40px",
          }}
        >
          <SearchBtn block size="small" />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
