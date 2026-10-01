import { createDepositBonusV2 } from "@/api/deposit-bonuses-v2/post";
import i18next from "@/i18n/i18n";
import { updateDepositBonusV2 } from "@/api/deposit-bonuses-v2/put";
import { DepositBonusV2Data } from "@/api/deposit-bonuses-v2/get";
import LevelSelectorV2 from "@/components/LevelSelectorV2";
import GradeSelectorV2 from "@/components/GradeSelectorV2";
import SaveBtn from "@/components/SaveBtn";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
  TimePicker,
  notification,
} from "antd";
import { CSSProperties, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface ExposurePeriod {
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
}
interface FormProps {
  bonusName: string;
  bonusPercentage: number;
  withdrawalRolling: number;
  minDeposit: number;
  maxAmount: number;
  availableLevels: number[];
  availableGrades: number[];
  bonusType: 0 | 1 | 2;
  inUse: boolean;
  tempOrder: number;
  dailyLimit: number | null;
  systemNote: string | null;
  bonusGroup: string;
  exposurePeriods?: ExposurePeriod[];
  isWelcome: boolean;
}

interface Props {
  data?: DepositBonusV2Data;
}

const DepositBonusV2Form = ({ data }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormProps>();
  const inputStyle: CSSProperties = { width: "100%" };
  const navigate = useNavigate();

  // Form의 bonusType 값을 실시간으로 감시
  const bonusType = Form.useWatch("bonusType", form);

  const handleSubmit = async (e: FormProps) => {
    const {
      availableLevels,
      availableGrades,
      bonusName,
      bonusPercentage,
      bonusType,
      inUse,
      maxAmount,
      minDeposit,
      withdrawalRolling,
      tempOrder,
      dailyLimit,
      systemNote,
      bonusGroup,
      exposurePeriods,
      isWelcome,
    } = e;

    const formattedExposurePeriods =
    exposurePeriods?.map((item) => ({
      startTime: item.startTime.format("HH:mm:ss"),
      endTime: item.endTime.format("HH:mm:ss"),
    })) || [];

    const bodyData = {
      bonusName,
      bonusPercentage,
      minDeposit,
      maxAmount,
      withdrawalRolling,
      availableLevels: availableLevels || [],
      availableGrades: availableGrades || [],
      bonusType,
      inUse: (inUse === true ? 1 : 0) as 0 | 1,
      tempOrder,
      dailyLimit: dailyLimit || null,
      systemNote: systemNote || null,
      bonusGroup,
      exposurePeriods: formattedExposurePeriods,
      isWelcome: isWelcome === true,
    };

    try {
      const res = data
        ? await updateDepositBonusV2(data.id, bodyData)
        : await createDepositBonusV2(bodyData);

      const { data: responseData } = res;

      if (responseData.code === 0) {
        notification.success({
          message: t("global.success"),
          description: responseData.message || (data ? i18next.t("promotion.updated") : i18next.t("promotion.created")),
        });
        navigate(-1);
      } else {
        notification.error({
          message: t("global.error"),
          description: responseData.message || i18next.t("promotion.processFailed"),
        });
      }
    } catch (error: any) {
      notification.error({
        message: t("global.error"),
        description: error.response?.data?.message || i18next.t("promotion.processFailed"),
      });
      console.error(error);
    }
  };

  useEffect(() => {
    if (data) {
      let parsedExposurePeriods: any[] = [];

      if (data.exposurePeriods) {
        try {
          const parsed =
            typeof data.exposurePeriods === "string"
              ? JSON.parse(data.exposurePeriods)
              : data.exposurePeriods;

          if (Array.isArray(parsed)) {
            parsedExposurePeriods = parsed.map((item: any) => ({
              startTime: dayjs(item.startTime, "HH:mm:ss"),
              endTime: dayjs(item.endTime, "HH:mm:ss"),
            }));
          }
        } catch (error) {
          console.error(error);
        }
      }
      form.setFieldsValue({
        bonusGroup: data.bonusGroup,
        bonusName: data.bonusName,
        bonusPercentage: data.bonusPercentage,
        bonusType: data.bonusType,
        inUse: data.inUse === 1,
        availableLevels: data.availableLevels,
        availableGrades: data.availableGrades,
        maxAmount: data.maxAmount,
        minDeposit: data.minDeposit,
        tempOrder: data.tempOrder,
        withdrawalRolling: data.withdrawalRolling,
        dailyLimit: data.dailyLimit,
        systemNote: data.systemNote || "",
        exposurePeriods: parsedExposurePeriods,
        // Backend may hand back true/false/1/0/null — normalize to boolean.
        isWelcome: !!data.isWelcome,
      });
    }
  }, [data, form]);

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label={i18next.t("depositBonus.db010")}
            name="bonusGroup"
            rules={[{ required: true, message: i18next.t("validation.enterBonusGroup") }]}
          >
            <Input placeholder={i18next.t("promotion.egBonusType")} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label={t("depositBonusDetail.dbe001")}
            name="bonusName"
            rules={[{ required: true, message: i18next.t("validation.enterBonusName") }]}
          >
            <Input placeholder={i18next.t("deposit.de014")} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label={i18next.t("promotion.bonusType")}
            name="bonusType"
            rules={[{ required: true, message: i18next.t("validation.selectBonusType") }]}
          >
            <Select
              placeholder={i18next.t("promotion.selectBonusType")}
              onChange={(value) => {
                // Form.useWatch가 자동으로 bonusType 값을 감지함
                // 보너스 타입 변경 시 해당하지 않는 필드 초기화
                if (value === 0) {
                  form.setFieldValue("availableGrades", []);
                } else if (value === 1) {
                  form.setFieldValue("availableLevels", []);
                }
              }}
            >
              <Select.Option value={0}>{i18next.t("col.level")}</Select.Option>
              <Select.Option value={1}>{i18next.t("col.grade")}</Select.Option>
              <Select.Option value={2}>{i18next.t("promotion.levelPlusGrade")}</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label={t("depositBonusDetail.dbe002")}
            name="bonusPercentage"
            rules={[{ required: true, message: i18next.t("validation.enterBonusRate") }]}
          >
            <InputNumber
              min={0}
              max={1000}
              addonAfter="%"
              step={0.01}
              style={inputStyle}
              placeholder="0"
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label={t("depositBonusDetail.dbe005")}
            name="withdrawalRolling"
            rules={[{ required: true, message: i18next.t("validation.enterWithdrawalRolling") }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              addonAfter={i18next.t("unit.times")}
              style={inputStyle}
              placeholder="0"
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label={t("depositBonusDetail.dbe003")}
            name="minDeposit"
            rules={[{ required: true, message: i18next.t("validation.enterMinDeposit") }]}
          >
            <InputNumber
              min={0}
              precision={0}
              style={inputStyle}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              placeholder="0"
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label={t("depositBonusDetail.dbe004")}
            name="maxAmount"
            rules={[{ required: true, message: i18next.t("validation.enterMaxBonusAmount") }]}
          >
            <InputNumber
              min={0}
              precision={0}
              style={inputStyle}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              placeholder="0"
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="availableLevels"
            label={i18next.t("promotion.applyLevelsMulti")}
            rules={[
              {
                required: bonusType === 0 || bonusType === 2,
                message: i18next.t("validation.selectAppliedLevel"),
              },
            ]}
          >
            <LevelSelectorV2
              mode="multiple"
              withCheckbox
              disabled={bonusType === 1}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="availableGrades"
            label={i18next.t("promotion.applyGradesMulti")}
            rules={[
              {
                required: bonusType === 1 || bonusType === 2,
                message: i18next.t("validation.selectAppliedGrade"),
              },
            ]}
          >
            <GradeSelectorV2
              mode="multiple"
              withCheckbox
              disabled={bonusType === 0}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="tempOrder"
            label={i18next.t("col.displayOrder")}
            rules={[{ required: true, message: i18next.t("validation.enterDisplayOrderRule") }]}
          >
            <InputNumber
              style={inputStyle}
              placeholder="1"
              min={0}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="dailyLimit" label={i18next.t("col.dailyPayoutCount")}>
            <InputNumber
              style={inputStyle}
              placeholder={i18next.t("promotion.noLimit")}
              min={0}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="inUse"
            label={t("depositBonusDetail.dbe016")}
            initialValue={true}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="isWelcome"
            label={t("depositBonusDetail.dbe018")}
            extra={t("depositBonusDetail.dbe018Hint")}
            initialValue={false}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.List name="exposurePeriods">
            {(fields, { add, remove }) => (
              <>
                <label style={{ fontWeight: 500, marginBottom:"10px", display:"block" }}>{i18next.t("promotion.exposureTimeRange")}</label>

                {fields.map(({ key, name, ...restField }) => (
                  <Row
                    gutter={16}
                    key={key}
                    align="middle"
                    justify="center"
                    style={{ marginBottom: 8 }}
                  >
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, "startTime"]}
                        style={{ marginBottom: 0 }}
                        rules={[
                          { required: true, message: i18next.t("validation.selectStartTime") },
                        ]}
                      >
                        <TimePicker
                          format="HH:mm:ss"
                          style={{ width: "100%" }}
                          placeholder={i18next.t("title.startTime")}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, "endTime"]}
                        style={{ marginBottom: 0 }}
                        rules={[
                          { required: true, message: i18next.t("validation.selectEndTime") },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const start = getFieldValue(["exposurePeriods", name, "startTime"]);
                              if (!start || !value || value.isAfter(start)) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(i18next.t("promotion.endAfterStart"))
                              );
                            },
                          }),
                        ]}
                      >
                        <TimePicker
                          format="HH:mm:ss"
                          style={{ width: "100%" }}
                          placeholder={i18next.t("title.endTime")}
                        />
                      </Form.Item>
                    </Col>

                    <Col
                      span={4}
                      style={{
                        display: "flex",
                        alignItems: "start",
                        justifyContent: "start",
                      }}
                    >
                      <Button danger type="primary" block onClick={() => remove(name)}>
                        <MinusCircleOutlined
                          style={{ fontSize: 18 }}
                        />
                      </Button>
                    </Col>
                  </Row>
                ))}

                {fields.length < 3 && (
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      시간 범위 추가
                    </Button>
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>
        </Col>

        <Col span={24}>
          <Form.Item name="systemNote" label={i18next.t("col.remarks")}>
            <Input.TextArea
              allowClear
              rows={3}
              placeholder={i18next.t("promotion.enterRemarks")}
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider />

      <SaveBtn />
    </Form>
  );
};

export default DepositBonusV2Form;
