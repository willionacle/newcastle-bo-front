import i18next from "@/i18n/i18n";
import { User } from "@/api/users/get";
import Btn from "@/components/Btn";
import { DateRangeType } from "@/components/DateRange";
import { Col, Form, Input, InputNumber, Row, Select } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { filterColProps } from "@/provider/filterColStyle";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import dayjs from "dayjs";
import { GF } from "@/utils/GlobalFunctions";
import DateRangeTag2 from "@/components/DateRangeTag2";
import AppUsageSelector from "@/components/AppUsageSelector";

export interface FormProps {
  dateRange: DateRangeType;
  username: string;
  user_real_name: string;
  level: string;
  agent_username: string;
  referral_username: string;
  user_grade: string;
  status: User["status"] | "";
  is_online: string;
  phone_number: string;
  hasAppLogin: string | undefined;
}

interface QueryProps {
  dateRange: string[] | undefined;
  username: string | undefined;
  user_real_name: string | undefined;
  level: string | undefined;
  agent_username: string | undefined;
  referral_username: string | undefined;
  status: User["status"] | undefined;
  online: string | undefined;
  user_grade: string | undefined;
  is_online: string | undefined;
  nonpayment_days: string | undefined;
  provider_id: string | undefined;
  phone_number: string;
  high_value: string | undefined;
  hasAppLogin: string | undefined;
}

interface Props {
  setBody: any;
  isOnlineVal?: string;
}

const Filter = ({ setBody, isOnlineVal }: Props) => {
  const [form] = Form.useForm<FormProps>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FormProps) => {
    const q = parse(search.replace("?", "")) as unknown as QueryProps;
    // navigate({
    //   pathname: "/user",
    //   search: stringify({
    //     ...e,
    //     dateRange: e.dateRange
    //       ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
    //       : undefined,
    //   }),
    // });

    navigate({
      pathname: "/user",
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
    const e = parse(search.replace("?", "")) as unknown as QueryProps;

    form.setFieldsValue({
      ...e,
      status: e.status ? e.status : "",
      // online: e.online === "true" ? true : false,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
    });

    console.log(e)

 setBody((prevData: any) => ({
      ...prevData,
      startDate: e.dateRange ? GF.formatDate(e.dateRange[0], false) : null,
      endDate: e.dateRange ? GF.formatDate(e.dateRange[1], false) : null,
      username: e.username ? e.username : null,
      userRealName: e.user_real_name ? e.user_real_name : null,
      userLevel: e.level ? e.level : null,
      agentUsername: e.agent_username ? e.agent_username : null,
      referralUsername: e.referral_username ? e.referral_username : null,
      status: e.status ? e.status : null,
      isOnline: e.is_online ? e.is_online : null,
      nonpaymentDays: e.nonpayment_days ? e.nonpayment_days : null,
      userGrade: e.user_grade ? e.user_grade : null,
      phoneNumber: e.phone_number ? e.phone_number : null,
      highValue: e.high_value ?? null,
      hasAppLogin: e.hasAppLogin ? e.hasAppLogin : null,
    }));
  }, [search]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <DateRangeTag2 hasDefault={false} required={false} />
        </Col>

        <Col {...filterColProps}>
          <Form.Item
            label={t("memberInfo.mi004")}
            name={"username"}
            initialValue={""}
          >
            <Input
              size="small"
              allowClear
              placeholder="search username or leave blank"
            />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item
            label={t("memberInfo.mi006")}
            name={"user_real_name"}
            initialValue={""}
          >
            <Input
              size="small"
              allowClear
              placeholder="search user real name or leave blank"
            />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("memberInfo.mi007")} name={"level"}>
            <Input size="small" style={{ width: "100%" }} allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item
            label={t("memberInfo.mi008")}
            name={"agent_username"}
            initialValue={""}
          >
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item
            label={t("memberInfo.mi009")}
            name={"referral_username"}
            initialValue={""}
          >
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item
            label={t("memberInfo.mi010")}
            name={"status"}
            initialValue={""}
          >
            <Select size="small">
              <Select.Option value="">{t("memberInfo.mi011")}</Select.Option>
              <Select.Option value="ACTIVE">
                {t("memberInfo.mi012")}
              </Select.Option>
              <Select.Option value="ROYALBLACK">{t("memberInfo.royalBlack")}</Select.Option>
              {/* <Select.Option value="INACTIVE">
                {t("memberInfo.mi013")}
              </Select.Option> */}
              <Select.Option value="OBSERVATION">
                <span style={{ color: "blue" }}>{t("memberInfo.mi036")}</span>
              </Select.Option>
              <Select.Option value="DEACTIVATED">
                {t("memberInfo.mi014")}
              </Select.Option>
              <Select.Option value="SUSPENDED">
                <span style={{ color: "var(--ant-color-error)" }}>
                  {t("memberInfo.mi015")}
                </span>
              </Select.Option>
              <Select.Option value="UNVERIFIED">
                {t("memberInfo.mi030")}
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item
            label={t("memberInfo.mi016")}
            name={"is_online"}
            initialValue={isOnlineVal ?? ""}
          >
            <Select size="small" allowClear>
              {/* <Select.Option value="">{t("memberInfo.mi016")}</Select.Option> */}
              <Select.Option value="1">{t("global.true")}</Select.Option>
              <Select.Option value="">{t("col.allUsers")}</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item
            label={t("memberInfo.mi032")}
            name={"user_grade"}
            initialValue={""}
          >
            <Select size="small" allowClear>
              <Select.Option value="">{i18next.t("col.all")}</Select.Option>
              <Select.Option value="1">{i18next.t("grade.bronze")}</Select.Option>
              <Select.Option value="2">{i18next.t("grade.silver")}</Select.Option>
              <Select.Option value="3">{i18next.t("grade.gold")}</Select.Option>
              <Select.Option value="4">{i18next.t("grade.emerald")}</Select.Option>
              <Select.Option value="5">{i18next.t("grade.ruby")}</Select.Option>
              <Select.Option value="6">{i18next.t("grade.diamond")}</Select.Option>
              <Select.Option value="7">{i18next.t("grade.blackDiamond")}</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item
            label={t("memberInfo.mi034")}
            name={"nonpayment_days"}
            initialValue={""}
          >
            {/* <Input size="small" allowClear /> */}
            <InputNumber
              size="small"
              addonAfter={i18next.t("user.daysOrMore")}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item
            label={t("col.phone")}
            name={"phone_number"}
            initialValue={""}
            rules={[
              {
                pattern: /^[\d\s-]*$/,
                message: i18next.t("validation.numbersSpacesHyphenOnly"),
              },
            ]}
          >
            <Input size="small" placeholder="" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <AppUsageSelector name="hasAppLogin" />
        </Col>

        <Col {...filterColProps} style={{ display: "flex" }}>
          <Btn
            btnType="search"
            htmlType="submit"
            size="small"
            block
            style={{ alignSelf: "center" }}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
