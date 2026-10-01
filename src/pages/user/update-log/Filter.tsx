import i18next from "@/i18n/i18n";
import DateRangeTag from "@/components/DateRangeTag";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, Row, Select } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { DateRangeType } from "@/components/DateRange";

interface Props {
  setFilters: Dispatch<SetStateAction<any | undefined>>;
}

interface FilterData {
  dateRange: DateRangeType;
  username: string | undefined;
  userRealName: string | undefined;
  columnName: string | undefined;
  columnGroup: string[] | undefined;
  oldValue: string | undefined;
  newValue: string | undefined;
  adminUsername: string | undefined;
}

interface QueryData {
  dateRange: string[] | undefined;
  username: string | undefined;
  userRealName: string | undefined;
  columnName: string | undefined;
  columnGroup: string[] | undefined;
  oldValue: string | undefined;
  newValue: string | undefined;
  adminUsername: string | undefined;
}

// 컬럼 그룹 한글 매핑
const getColumnGroupKorean = (columnGroup: string): string => {
  const groupMapping: Record<string, string> = {
    'rollingGroup': i18next.t("user.rollingPointSetting"),
    'lossingGroup': i18next.t("user.paybackPointSetting"),
    'levelGroup': i18next.t("sidemenu.sm021"),
    'accountGroup': i18next.t("user.accountInfo"),
    'gradeGroup': i18next.t("memberInfoEdit.mie036"),
    'rollingPaymentGroup': i18next.t("col.rollingDeductionSetting"),
    'username': i18next.t("col.id"),
    'decodePassword': i18next.t("user.password"),
    'phoneNumber': i18next.t("col.phone"),
    'agentUsername': i18next.t("col.agent"),
    'wWalletAddress': i18next.t("user.walletAddress"),
    'referralUsername': i18next.t("col.referrer"),
  };
  return groupMapping[columnGroup] || columnGroup;
};

// 컬럼 그룹 옵션 리스트
const columnGroupOptions = [
  { value: 'rollingGroup', label: getColumnGroupKorean('rollingGroup') },
  { value: 'lossingGroup', label: getColumnGroupKorean('lossingGroup') },
  { value: 'levelGroup', label: getColumnGroupKorean('levelGroup') },
  { value: 'accountGroup', label: getColumnGroupKorean('accountGroup') },
  { value: 'gradeGroup', label: getColumnGroupKorean('gradeGroup') },
  { value: 'rollingPaymentGroup', label: getColumnGroupKorean('rollingPaymentGroup') },
  { value: 'username', label: getColumnGroupKorean('username') },
  { value: 'decodePassword', label: getColumnGroupKorean('decodePassword') },
  { value: 'phoneNumber', label: getColumnGroupKorean('phoneNumber') },
  { value: 'agentUsername', label: getColumnGroupKorean('agentUsername') },
  { value: 'wWalletAddress', label: getColumnGroupKorean('wWalletAddress') },
  { value: 'referralUsername', label: getColumnGroupKorean('referralUsername') },
];

const Filter = ({ setFilters }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FilterData>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FilterData) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;

    navigate({
      pathname: "/user/update-log",
      search: stringify({
        ...q,
        ...e,
        dateRange: e.dateRange
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
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
    });

    setFilters((prevData: any) => ({
      ...prevData,
      username: e.username ? e.username : null,
      userRealName: e.userRealName ? e.userRealName : null,
      columnName: e.columnName ? e.columnName : null,
      columnGroup: e.columnGroup && e.columnGroup.length > 0 ? e.columnGroup : null,
      oldValue: e.oldValue ? e.oldValue : null,
      newValue: e.newValue ? e.newValue : null,
      adminUsername: e.adminUsername ? e.adminUsername : null,
      startDate: e.dateRange
        ? `${GF.formatDate(e.dateRange[0], false)} 00:00:00`
        : null,
      endDate: e.dateRange
        ? `${GF.formatDate(e.dateRange[1], false)} 23:59:59`
        : null,
    }));
  }, [search]);

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        {/* Row 1 */}
        <Col {...filterColProps}>
          <Form.Item>
            <DateRangeTag showTime />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("col.id")} name={"username"}>
            <Input size="small" allowClear placeholder={t("col.id")} />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("col.name")} name={"userRealName"}>
            <Input size="small" allowClear placeholder={t("col.name")} />
          </Form.Item>
        </Col>

        {/* Row 2 */}
        <Col {...filterColProps}>
          <Form.Item label={t("col.category")} name={"columnGroup"}>
            <Select
              mode="multiple"
              size="small"
              allowClear
              placeholder={t("col.selectCategory")}
              options={columnGroupOptions}
              maxTagCount="responsive"
            />
          </Form.Item>
        </Col>

        {/* <Col {...filterColProps}>
          <Form.Item label={t("col.columnName")} name={"columnName"}>
            <Input size="small" allowClear placeholder={t("col.columnName")} />
          </Form.Item>
        </Col> */}

        {/* <Col {...filterColProps}>
          <Form.Item label={t("col.previousValue")} name={"oldValue"}>
            <Input size="small" allowClear placeholder={t("col.previousValue")} />
          </Form.Item>
        </Col> */}

        {/* Row 3 */}
        {/* <Col {...filterColProps}>
          <Form.Item label={t("col.changedValue")} name={"newValue"}>
            <Input size="small" allowClear placeholder={t("col.changedValue")} />
          </Form.Item>
        </Col> */}

        <Col {...filterColProps}>
          <Form.Item label={t("col.processedBy")} name={"adminUsername"}>
            <Input size="small" allowClear placeholder={t("col.processedBy")} />
          </Form.Item>
        </Col>

        <Col {...filterColProps} style={{ alignSelf: "center", marginBottom:"45px" }}>
          <SearchBtn block size="small" />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
