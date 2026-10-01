import { User } from "@/api/users/get";
import DateRange, { DateRangeType } from "@/components/DateRange";
import PaymentStatusSelector from "@/components/PaymentStatusSelector";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  setFilters: Dispatch<SetStateAction<any | undefined>>;
  user: User | undefined;
}

interface FilterData {
  dateRange: DateRangeType;
  agent_id: string | undefined;
  username: string | undefined;
  userRealName: string | undefined;
  userLevel: string | undefined;
  status: string | undefined;
  adminId: string | undefined;
}

interface QueryData {
  dateRange: string[] | undefined;
  agent_id: string | undefined;
  username: string | undefined;
  userRealName: string | undefined;
  userLevel: string | undefined;
  status: string | undefined;
  adminId: string | undefined;
}

const Filter = ({ user, setFilters }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [form] = Form.useForm<FilterData>();

  const handleSubmit = (e: FilterData) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: `/user/${user?.id}`,
      search: stringify({
        ...q,
        ...e,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
        page: 1
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData;

    form.setFieldsValue({
      ...e,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
    });

    setFilters({
      user: {
        username: {
          $eq: user?.username,
        },
      },
      createdAt: e.dateRange
        ? {
            $gt: e.dateRange[0],
            $lt: e.dateRange[1],
          }
        : undefined,
      status:
        e.status !== ""
          ? {
              $eq: e.status,
            }
          : undefined,
      adminId:
        e.adminId !== ""
          ? {
              $contains: e.adminId,
            }
          : undefined,
    });
  }, [search, user]);

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={[16, 16]} align={"top"}>
        <Col {...filterColProps}>
          <Form.Item>
            <DateRange />
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

        <Col
          {...filterColProps}
          style={{
            alignSelf: "center",
            marginBottom: "1.2rem",
          }}
        >
          <SearchBtn block size="small" />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
