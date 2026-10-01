import i18next from "@/i18n/i18n";
import { LossingData, weeklyLossingAPI } from "@/api/lossing-config/get";
import { updateWeeklyLossingAPI } from "@/api/lossing-config/put";
import GradeCheckbox from "@/components/GradeCheckbox";
import UserLevelCheckBox from "@/components/UserLevelCheckBox";
import useUserStore from "@/store/user.store";
import { EditOutlined, SaveOutlined, StopOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  notification,
  Row,
  Select,
  SelectProps,
  Space,
  Switch,
  TimePicker,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type LossingFormDataProps = Pick<
  LossingData,
  | "id"
  | "lossing_onoff"
  | "lossing_type"
  | "lossing_format"
  | "lossing_payment_day"
  | "lossing_payment_time"
  | "lossing_coupon_validity"
  | "lossing_method"
  | "lossing_system_log"
  | "lossing_member_selection"
  | "lossing_rating_bronze"
  | "lossing_rating_silver"
  | "lossing_rating_gold"
  | "lossing_rating_emerald"
  | "lossing_rating_ruby"
  | "lossing_rating_diamond"
  | "lossing_rating_black_diamond"
  | "lossing_rating_level_1"
  | "lossing_rating_level_2"
  | "lossing_rating_level_3"
  | "lossing_rating_level_4"
  | "lossing_rating_level_5"
  | "lossing_rating_level_6"
  | "lossing_rating_level_7"
  | "lossing_rating_level_8"
  | "lossing_rating_level_9"
> & Partial<{
  lossingGrades: number[];
  lossingLevels: number[];
}>;

const typeOptions: SelectProps["options"] = [
  { value: "D-W", label: i18next.t("promotion.depositMinusWithdraw") },
  // { value: "D-W-B", label: "입금-출금-보유금" },
];

const paymentMethodOptions: SelectProps["options"] = [
  { value: "points", label: i18next.t("col.paybackPoint") },
  { value: "coupon", label: i18next.t("topNavi.tn030") },
];

const autoManualOptions: SelectProps["options"] = [
  { value: "automatic", label: i18next.t("promotion.autoPayAutoList") },
  { value: "manual", label: i18next.t("promotion.manualPayAutoList") },
];

const daysOptions: SelectProps["options"] = [
  { value: 1, label: i18next.t("promotion.everyMonday") },
  { value: 2, label: i18next.t("promotion.everyTuesday") },
  { value: 3, label: i18next.t("promotion.everyWednesday") },
  { value: 4, label: i18next.t("promotion.everyThursday") },
  { value: 5, label: i18next.t("promotion.everyFriday") },
  { value: 6, label: i18next.t("promotion.everySaturday") },
  { value: 7, label: i18next.t("promotion.everySunday") },
];

const grades: { key: keyof LossingData; value: number }[] = [
  { key: "lossing_rating_bronze", value: 1 },
  { key: "lossing_rating_silver", value: 2 },
  { key: "lossing_rating_gold", value: 3 },
  { key: "lossing_rating_emerald", value: 4 },
  { key: "lossing_rating_ruby", value: 5 },
  { key: "lossing_rating_diamond", value: 6 },
  { key: "lossing_rating_black_diamond", value: 7 },
];

const levels: { key: keyof LossingData; value: number }[] = [
  { key: "lossing_rating_level_1", value: 1 },
  { key: "lossing_rating_level_2", value: 2 },
  { key: "lossing_rating_level_3", value: 3 },
  { key: "lossing_rating_level_4", value: 4 },
  { key: "lossing_rating_level_5", value: 5 },
  { key: "lossing_rating_level_6", value: 6 },
  { key: "lossing_rating_level_7", value: 7 },
  { key: "lossing_rating_level_8", value: 8 },
  { key: "lossing_rating_level_9", value: 9 },
];

const PaybackForm = () => {
  const { t } = useTranslation();
  const [disabled, setDisabled] = useState(true);
  const { data, mutate, isLoading } = weeklyLossingAPI();
  const [form] = Form.useForm<LossingFormDataProps>();
  const userType = Form.useWatch('lossing_member_selection', form)
  const isManual = Form.useWatch('lossing_format', form) === 'manual'
  const {userid} = useUserStore.getState();

  const handleWeeklyLossingSubmit = async (e: LossingFormDataProps) => {
    console.log(e)

    const newLossingGrades = grades.reduce<Record<keyof LossingData, number>>((acc, {key, value}) => {
      acc[key] = (e.lossingGrades && e.lossingGrades.includes(value)) ? 1 : 0;
      return acc;
    }, {} as Record<keyof LossingData, number>);

    const newLossingLevels = levels.reduce<Record<keyof LossingData, number>>((acc, {key, value}) => {
      acc[key] = (e.lossingLevels && e.lossingLevels.includes(value)) ? 1 : 0;
      return acc;
    }, {} as Record<keyof LossingData, number>);

    const data = {
      ...e,
      ...newLossingGrades,
      ...newLossingLevels,
      id: 1,
      userid: userid,
      lossing_payment_time: dayjs(e.lossing_payment_time).format("HH:00:00"),
      lossing_onoff: e.lossing_onoff ? 1 : 0,
      lossingGrades: undefined,
      lossingLevels: undefined,
    };

    console.log(data)
    // return;
    try {
      const res = await updateWeeklyLossingAPI(data)
      if (res.data.code === 0) {
        notification.success({ message: t("toast.common.updateSuccess") });
        mutate();
        setDisabled(true)
      } else {
        notification.error({ message: res.data.message });
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (!isLoading && data && data.data) {
      const lossingGrades = grades.reduce<number[]>((acc, { key, value }) => {
        if ((data.data[key]) === 1) acc.push(value);
        return acc;
      }, []);
      
      const lossingLevels = levels.reduce<number[]>((acc, { key, value }) => {
        if ((data.data[key]) === 1) acc.push(value);
        return acc;
      }, []);

      console.log(lossingGrades)
      
      form.setFieldsValue({
        lossing_onoff: data?.data?.lossing_onoff,
        lossing_type: data?.data?.lossing_type,
        lossing_format: data?.data?.lossing_format,
        lossing_payment_day: data?.data?.lossing_payment_day,
        lossing_payment_time: dayjs().set("hour", dayjs.utc(data.data.lossing_payment_time).hour()),
        lossing_method: data?.data?.lossing_method,
        lossing_system_log: data?.data?.lossing_system_log,
        lossing_member_selection: data?.data?.lossing_member_selection,
        lossing_coupon_validity: data?.data?.lossing_coupon_validity,
        lossingGrades,
        lossingLevels,
      });
    }
  }, [data]);

  return (
    <>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleWeeklyLossingSubmit}
        disabled={disabled}
      >
        <Row
          gutter={[16, 0]}
          style={{
            background: "var(--ant-color-fill-secondary)",
            padding: "1rem",
            borderRadius: "var(--ant-border-radius)",
          }}
        >
          <Col
            span={24}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: 'center',
              marginBottom: '1rem'
            }}
          >
            <Typography.Title level={3} style={{marginBottom: 0}}>{i18next.t("sidemenu.sm018")}</Typography.Title>
            <Button size="small" htmlType="button" color="success" disabled={false} style={{marginLeft: 'auto', marginRight: 6, backgroundColor: 'var(--ant-green)'}}>{i18next.t("promotion.applyPayback")}</Button>
            {/* <Typography.Text style={{margin: '0 4px 0 6px'}}>페이백 ON/OFF</Typography.Text> */}
            
            <Form.Item 
              label={'ID'}
              name={'id'}
              hidden
            >
              <InputNumber controls={false} size="small" style={{width: '100%'}} type="hidden"/>
            </Form.Item>

            <Form.Item 
              name={"lossing_onoff"}
              noStyle
            >
              <Switch  />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item label={i18next.t("title.type")} name={"lossing_type"} initialValue={"D-W"}>
              <Select options={typeOptions} />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item label={i18next.t("promotion.payoutType")} name={"lossing_format"} initialValue={"automatic"}>
              <Select options={autoManualOptions} />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item label={i18next.t("promotion.payoutDaySetting")} name={"lossing_payment_day"} initialValue={1}>
              <Select options={daysOptions} disabled={isManual || disabled} />
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item label={i18next.t("paybackListDetail.plr010")} name={"lossing_payment_time"}>
              <TimePicker style={{ width: "100%" }} showHour disabled={isManual || disabled}/>
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item 
              label={i18next.t("promotion.payoutMethod")} 
              name={"lossing_method"} 
              initialValue={"points"}
              rules={[{required: true}]}
            >
              <Select options={paymentMethodOptions} />
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item label={i18next.t("promotion.systemLog")} name={"lossing_system_log"} initialValue={i18next.t("col.paybackPoint")}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item label={i18next.t("promotion.couponValidity")} name={"lossing_coupon_validity"}>
              <InputNumber style={{width: '100%'}}/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={i18next.t("promotion.selectMember")} name={"lossing_member_selection"} initialValue={'level'} required>
              <Select>
                <Select.Option value={'level'}>{i18next.t("col.level")}</Select.Option>
                {/* <Select.Option value={'grade'}>등급</Select.Option> */}
              </Select>
            </Form.Item>
          </Col>
          <Col span={16}>
            {userType === 'level' && (
              <UserLevelCheckBox label={i18next.t("col.level")} name="lossingLevels" required/>
            )}
            {userType === 'grade' && (
              <GradeCheckbox label={i18next.t("col.grade")} name="lossingGrades" hideAll required/>
            )}
          </Col>
          <Col span={24}>
            <Space direction="horizontal">
              <Button
                type="primary"
                htmlType="button"
                icon={disabled ? <EditOutlined /> : <StopOutlined />}
                onClick={() => setDisabled(!disabled)}
                disabled={false}
                danger={!disabled}
              >
                {disabled ? i18next.t("sportsBet.edit") : i18next.t("global.cancel")}
              </Button>
              <Button
                htmlType="submit"
                icon={<SaveOutlined />}
              >
                저장
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default PaybackForm;
