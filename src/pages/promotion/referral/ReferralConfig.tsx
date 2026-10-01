import { useState, useEffect } from "react";
import i18next from "@/i18n/i18n";
import { Form, InputNumber, Button, Card, Row, Col, notification, Spin } from "antd";
import { getReferralConfig } from "@/api/system-config/get";
import { updateReferralConfig, ConfigUpdateItem } from "@/api/system-config/put";
import { useTranslation } from "react-i18next";

const ReferralConfig = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 설정 불러오기
  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await getReferralConfig();

      if (response.code === 0) {
        const { depositStages, rollingPoint } = response.data;

        form.setFieldsValue({
          stage1_reward: depositStages.stage1.reward,
          stage1_threshold: depositStages.stage1.threshold,
          stage2_reward: depositStages.stage2.reward,
          stage2_threshold: depositStages.stage2.threshold,
          stage3_reward: depositStages.stage3.reward,
          stage3_threshold: depositStages.stage3.threshold,
          // stage4_reward: depositStages.stage4.reward,
          // stage4_threshold: depositStages.stage4.threshold,
          // stage5_reward: depositStages.stage5.reward,
          // stage5_threshold: depositStages.stage5.threshold,
          // stage6_reward: depositStages.stage6.reward,
          // stage6_threshold: depositStages.stage6.threshold,
          // stage7_reward: depositStages.stage7.reward,
          // stage7_threshold: depositStages.stage7.threshold,
          // stage8_reward: depositStages.stage8.reward,
          // stage8_threshold: depositStages.stage8.threshold,
          rolling_rate: rollingPoint.rate * 100, // 백분율로 변환
          rolling_max: rollingPoint.max,
        });
      } else {
        notification.error({
          message: t("toast.referralConfig.loadFailed"),
          description: t("toast.referralConfig.loadFailedDesc"),
        });
      }
    } catch (error: any) {
      console.error("Failed to fetch config:", error);
      notification.error({
        message: t("toast.referralConfig.loadFailed"),
        description:
          error.response?.data?.message || t("toast.referralConfig.loadFailedDesc"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // 설정 저장
  const handleSubmit = async (values: any) => {
    setSaving(true);

    try {
      const configs: ConfigUpdateItem[] = [
        { key: "DEPOSIT_STAGE_1_THRESHOLD", value: values.stage1_threshold },
        { key: "DEPOSIT_STAGE_1_REWARD", value: values.stage1_reward },
        { key: "DEPOSIT_STAGE_2_THRESHOLD", value: values.stage2_threshold },
        { key: "DEPOSIT_STAGE_2_REWARD", value: values.stage2_reward },
        { key: "DEPOSIT_STAGE_3_THRESHOLD", value: values.stage3_threshold },
        { key: "DEPOSIT_STAGE_3_REWARD", value: values.stage3_reward },
        // { key: "DEPOSIT_STAGE_4_THRESHOLD", value: values.stage4_threshold },
        // { key: "DEPOSIT_STAGE_4_REWARD", value: values.stage4_reward },
        // { key: "DEPOSIT_STAGE_5_THRESHOLD", value: values.stage5_threshold },
        // { key: "DEPOSIT_STAGE_5_REWARD", value: values.stage5_reward },
        // { key: "DEPOSIT_STAGE_6_THRESHOLD", value: values.stage6_threshold },
        // { key: "DEPOSIT_STAGE_6_REWARD", value: values.stage6_reward },
        // { key: "DEPOSIT_STAGE_7_THRESHOLD", value: values.stage7_threshold },
        // { key: "DEPOSIT_STAGE_7_REWARD", value: values.stage7_reward },
        // { key: "DEPOSIT_STAGE_8_THRESHOLD", value: values.stage8_threshold },
        // { key: "DEPOSIT_STAGE_8_REWARD", value: values.stage8_reward },
        { key: "REFERRAL_ROLLING_RATE", value: values.rolling_rate / 100 }, // 소수점으로 변환
        { key: "REFERRAL_ROLLING_MAX", value: values.rolling_max },
      ];

      const response = await updateReferralConfig(configs);

      if (response.code === 0) {
        notification.success({
          message: t("toast.referralConfig.saveSuccess"),
          description: t("toast.referralConfig.saveSuccessDesc"),
        });
      } else {
        notification.error({
          message: t("toast.referralConfig.saveFailed"),
          description: response.message || t("toast.referralConfig.saveFailedDesc"),
        });
      }
    } catch (error: any) {
      console.error("Failed to update config:", error);
      notification.error({
        message: t("toast.referralConfig.saveFailed"),
        description:
          error.response?.data?.message || t("toast.referralConfig.saveFailedDesc"),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          {/* Stage 1 설정 */}
          <Card title={i18next.t("title.stage1Setting")} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={i18next.t("referralCfg.stage1Required")}
                  name="stage1_threshold"
                  rules={[{ required: true, message: i18next.t("validation.required") }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                    placeholder="1,000,000"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={i18next.t("referralCfg.stage1Points")}
                  name="stage1_reward"
                  rules={[{ required: true, message: i18next.t("validation.required") }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                    placeholder="100,000"
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Stage 2 설정 */}
          <Card title={i18next.t("title.stage2Setting")} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={i18next.t("referralCfg.stage2Required")}
                  name="stage2_threshold"
                  rules={[{ required: true, message: i18next.t("validation.required") }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                    placeholder="5,000,000"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={i18next.t("referralCfg.stage2Points")}
                  name="stage2_reward"
                  rules={[{ required: true, message: i18next.t("validation.required") }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                    placeholder="300,000"
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Stage 3 설정 */}
          <Card title={i18next.t("title.stage3Setting")} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={i18next.t("referralCfg.stage3Required")}
                  name="stage3_threshold"
                  rules={[{ required: true, message: i18next.t("validation.required") }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                    placeholder="10,000,000"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={i18next.t("referralCfg.stage3Points")}
                  name="stage3_reward"
                  rules={[{ required: true, message: i18next.t("validation.required") }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                    placeholder="1,000,000"
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Stage 4 설정 */}
          {/* 
          <Card title={i18next.t("title.stage4Setting")} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Stage 4 달성 필요 입금액"
                  name="stage4_threshold"
                  rules={[{ required: true, message: i18next.t("validation.required") }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                    placeholder="20,000,000"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Stage 4 지급 포인트"
                  name="stage4_reward"
                  rules={[{ required: true, message: i18next.t("validation.required") }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                    placeholder="2,000,000"
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          {*/}
          {/* Stage 5 설정 */}
          {/* 
          <Card title={i18next.t("title.stage5Setting")} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Stage 5 달성 필요 입금액"
                  name="stage5_threshold"
                  rules={[{ required: true, message: i18next.t("validation.required") }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                    placeholder="50,000,000"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Stage 5 지급 포인트"
                  name="stage5_reward"
                  rules={[{ required: true, message: i18next.t("validation.required") }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                    placeholder="5,000,000"
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          {*/}
          {/* Stage 6 설정 */}
          {/* <Card title={i18next.t("title.stage6Setting")} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Stage 6 달성 필요 입금액"
                  name="stage6_threshold"
                  rules={[{ required: true, message: i18next.t("validation.required") }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                    placeholder="100,000,000"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Stage 6 지급 포인트"
                  name="stage6_reward"
                  rules={[{ required: true, message: i18next.t("validation.required") }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                    placeholder="10,000,000"
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title={i18next.t("title.stage7Setting")} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Stage 7 달성 필요 입금액"
                  name="stage7_threshold"
                  rules={[{ required: true, message: i18next.t("validation.required") }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                    placeholder="200,000,000"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Stage 7 지급 포인트"
                  name="stage7_reward"
                  rules={[{ required: true, message: i18next.t("validation.required") }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                    placeholder="20,000,000"
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title={i18next.t("title.stage8Setting")} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Stage 8 달성 필요 입금액"
                  name="stage8_threshold"
                  rules={[{ required: true, message: i18next.t("validation.required") }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                    placeholder="500,000,000"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Stage 8 지급 포인트"
                  name="stage8_reward"
                  rules={[{ required: true, message: i18next.t("validation.required") }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                    placeholder="50,000,000"
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card> */}

          {/* 롤링 포인트 설정 */}
          <Card title={i18next.t("title.referrerRollingSetting")} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={i18next.t("referralCfg.referrerRollingPct")}
                  name="rolling_rate"
                  rules={[{ required: true, message: i18next.t("validation.required") }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="20"
                    min={0}
                    max={100}
                    formatter={(value) => `${value}%`}
                    parser={(value) => value!.replace("%", "") as any}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={i18next.t("referralCfg.referrerRollingMax")}
                  name="rolling_max"
                  rules={[{ required: true, message: i18next.t("validation.required") }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                    placeholder="100,000"
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              size="large"
            >
              설정 저장
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
};

export default ReferralConfig;
