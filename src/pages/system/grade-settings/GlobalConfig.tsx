import i18next from "@/i18n/i18n";
import { getGlobalConfig } from "@/api/global-config/get";
import {
  updateGlobalConfig,
  UpdateGlobalConfigRequest,
} from "@/api/global-config/put";
import { EditOutlined, SaveOutlined, StopOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  notification,
  Row,
  Space,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

const GlobalConfig = () => {
  const { data, isLoading, mutate } = getGlobalConfig();
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);

  const handleSubmit = async (values: any) => {
    try {
      const updateData: UpdateGlobalConfigRequest = {
        globalLevelMinimumDailyBettingAmount:
          values.globalLevelMinimumDailyBettingAmount,
        globalLevelMinimumDailyBettingAmountSlot:
          values.globalLevelMinimumDailyBettingAmountSlot,
        globalLevelMinimumDailyBettingAmountCasino:
          values.globalLevelMinimumDailyBettingAmountCasino,
        globalLevelMinimumDailyBettingAmountSports:
          values.globalLevelMinimumDailyBettingAmountSports,
        globalLevelMinimumDailyBettingAmountMiniGame:
          values.globalLevelMinimumDailyBettingAmountMiniGame,
      };

      const response = await updateGlobalConfig(updateData);

      if (response.data.code === 0) {
        notification.success({
          message: i18next.t("toast.grade.updateSuccess"),
        });
        setDisabled(true);
        mutate();
      } else {
        notification.error({ message: response.data.message });
      }
    } catch (error) {
      console.error("Update error:", error);
      notification.error({ message: i18next.t("toast.common.updateError") });
    }
  };

  useEffect(() => {
    if (data && !isLoading) {
      form.setFieldsValue({
        globalLevelMinimumDailyBettingAmount:
          data.globalLevelMinimumDailyBettingAmount,
        globalLevelMinimumDailyBettingAmountSlot:
          data.globalLevelMinimumDailyBettingAmountSlot,
        globalLevelMinimumDailyBettingAmountCasino:
          data.globalLevelMinimumDailyBettingAmountCasino,
        globalLevelMinimumDailyBettingAmountSports:
          data.globalLevelMinimumDailyBettingAmountSports,
        globalLevelMinimumDailyBettingAmountMiniGame:
          data.globalLevelMinimumDailyBettingAmountMiniGame,
      });
    }
  }, [data, isLoading, form]);

  return (
    <Card size="small" style={{ marginBottom: 36 }}>
      <Typography.Title level={4}>{i18next.t("system.globalGradeSettings")}</Typography.Title>

      <Form
        layout="vertical"
        disabled={disabled || isLoading}
        form={form}
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={i18next.t("system.casinoMinDailyBet")}
              name="globalLevelMinimumDailyBettingAmountCasino"
              rules={[
                {
                  required: true,
                  message: i18next.t("validation.enterCasinoMinDailyBet"),
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                addonAfter="원"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={i18next.t("system.slotMinDailyBet")}
              name="globalLevelMinimumDailyBettingAmountSlot"
              rules={[
                {
                  required: true,
                  message: i18next.t("validation.enterSlotMinDailyBet"),
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                addonAfter="원"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={i18next.t("system.sportsMinDailyBet")}
              name="globalLevelMinimumDailyBettingAmountSports"
              rules={[
                {
                  required: true,
                  message: i18next.t("validation.enterSportsMinDailyBet"),
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                addonAfter="원"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={i18next.t("system.minigameMinDailyBet")}
              name="globalLevelMinimumDailyBettingAmountMiniGame"
              rules={[
                {
                  required: true,
                  message: i18next.t("validation.enterMinigameMinDailyBet"),
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                addonAfter="원"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={i18next.t("system.totalMinDailyBet")}
              name="globalLevelMinimumDailyBettingAmount"
              rules={[
                {
                  required: true,
                  message: i18next.t("validation.enterTotalMinDailyBet"),
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                addonAfter="원"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item>
              <Space direction="horizontal">
                <Button
                  type="primary"
                  htmlType="button"
                  icon={disabled ? <EditOutlined /> : <StopOutlined />}
                  onClick={() => setDisabled(!disabled)}
                  disabled={isLoading}
                  danger={!disabled}
                >
                  {disabled ? i18next.t("sportsBet.edit") : i18next.t("global.cancel")}
                </Button>
                <Button
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  disabled={disabled}
                >
                  저장
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default GlobalConfig;
