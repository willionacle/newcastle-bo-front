import i18next from "@/i18n/i18n";
import { ResUser } from "@/api/types";
import { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, Row } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import TypeCheckBox, { plainOptions } from "./TypeFilter/TypeCheckBox";
import DateRangeTag from "@/components/DateRangeTag";

interface Props {
  setFilter: Dispatch<SetStateAction<any | undefined>>;
  user: ResUser['data'] | undefined;
  lastDepositDate?: string;
  lastWithdrawRequestDate?: string;
  isWithdrawPage?: boolean;
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
  is_withdrawal?: boolean
}

const Filter = ({ setFilter, user, lastDepositDate, lastWithdrawRequestDate, isWithdrawPage }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const [form] = Form.useForm<FormData>();
  
  const handleSubmit = (e: FormData) => {
    const query = parse(search.replace("?", "")) as unknown as QueryData;
    console.log('MONEYLOG form', e)
    
    // 출금 페이지에서는 날짜만 전달
    const searchParams = isWithdrawPage ? {
      ...query,
      dateRangeM: e.dateRange
        ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
        : undefined,
      // 출금 페이지에서는 type과 system_note 제거
      type: undefined,
      system_note: undefined,
    } : {
      ...query,
      ...e,
      tab: pathname.includes('/user') ? "moneyLog" : undefined,
      dateRangeM: e.dateRange
        ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
        : undefined,
    };
    
    navigate({
      pathname: `${pathname}`,
      search: stringify(searchParams),
    });
  };

  useEffect(() => {
    console.log(pathname)
    const e = parse(search.replace("?", "")) as unknown as QueryData;
    console.log('MONEYLOG parsed search', e)
    console.log(e)
    
    // 기본 날짜 범위 설정: URL에 날짜가 없고 props로 날짜가 전달된 경우
    const defaultDateRange = e.dateRangeM
      ? [dayjs(e.dateRangeM[0]), dayjs(e.dateRangeM[1])]
      : (lastDepositDate && lastWithdrawRequestDate && pathname.includes("withdraw"))
        ? [dayjs(lastDepositDate), dayjs(lastWithdrawRequestDate)]
        : [null, null];
    
    form.setFieldsValue({
      ...e,
      type: e.type ? e.type : undefined,
      dateRange: defaultDateRange,
    });

    // 출금 페이지에서는 새 API 파라미터 형식 사용
    if (isWithdrawPage) {
      setFilter((prevData: any) => ({
        ...prevData,
        startDate: e.dateRangeM 
          ? dayjs(e.dateRangeM[0]).format('YYYY-MM-DD HH:mm:ss')
          : (defaultDateRange[0] ? defaultDateRange[0].format('YYYY-MM-DD HH:mm:ss') : null),
        endDate: e.dateRangeM 
          ? dayjs(e.dateRangeM[1]).format('YYYY-MM-DD HH:mm:ss')
          : (defaultDateRange[1] ? defaultDateRange[1].format('YYYY-MM-DD HH:mm:ss') : null),
      }));
    } else {
      setFilter((prevData: any) => ({
        ...prevData,
        username    : e.username ?? (user ? user?.username : null),
        start_date  : e.dateRangeM 
          ? GF.formatDate(e.dateRangeM[0], true) 
          : (defaultDateRange[0] ? GF.formatDate(defaultDateRange[0].format(), false) : null),
        end_date    : e.dateRangeM 
          ? GF.formatDate(e.dateRangeM[1], true)
          : (defaultDateRange[1] ? GF.formatDate(defaultDateRange[1].format(), false) : null),
        type        : e.type ?  JSON.stringify(e.type) : JSON.stringify(['']),
        system_note : e.system_note ? e.system_note : null,
        is_withdrawal :pathname === "/payment/withdraw" || pathname.includes("withdraw") ? true : false,
      }));
    }

    console.log(e.username, user?.username)
  }, [search, user, pathname, lastDepositDate, lastWithdrawRequestDate, isWithdrawPage]);

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <DateRangeTag showTime hasDefault />
        </Col>

        {!isWithdrawPage && (
          <Col {...filterColProps}>
            <Form.Item
              label={t("memberDetail.mis042")}
              name={"system_note"}
              initialValue={""}
            >
              <Input size="small" allowClear />
            </Form.Item>
          </Col>
        )}

        {!isWithdrawPage && (
          <Col span={9}>
            <Form.Item name={"type"} label={i18next.t("col.category")} initialValue={plainOptions.flatMap(item => item.value)}>
              <TypeCheckBox />
            </Form.Item>
          </Col>
        )}

        <Col span={2} style={{ alignSelf: "center" }}>
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
