import { useState, useEffect } from "react";
import i18next from "@/i18n/i18n";
import { Form, Select, Button, Space, Card, message, Alert, Spin } from "antd";
import { SwapOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useDepositMethodList, DepositMethodItem } from "@/api/deposit-method/get";
import { transferInUseBetweenTypes, TransferInUseParams } from "@/api/deposit-method/post";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const DepositMethodTransfer = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [depositMethods, setDepositMethods] = useState<DepositMethodItem[]>([]);

  // 모든 입금방법 가져오기 (입금방법 설정 탭과 동일한 목록)
  const { data: allDepositMethods, isLoading: isLoadingMethods } = useDepositMethodList({
    // status, type, q 필터 없이 전체 목록 조회
  });

  useEffect(() => {
    if (allDepositMethods && allDepositMethods.length > 0) {
      setDepositMethods(allDepositMethods);
    }
  }, [allDepositMethods]);

  const handleTransfer = async (values: any) => {
    if (values.source_type === values.target_type) {
      message.error(t("toast.payment.sameMethod"));
      return;
    }

    setLoading(true);
    
    try {
      // 먼저 dry_run으로 테스트
      const dryRunParams: TransferInUseParams = {
        sourceType: values.source_type,
        targetType: values.target_type,
        dryRun: true,
      };

      const dryRunResponse = await transferInUseBetweenTypes(dryRunParams);
      
      if (dryRunResponse.code !== 0) {
        message.error(`${t("toast.payment.verifyFailed")}: ${dryRunResponse.message}`);
        setLoading(false);
        return;
      }

      // 실제 이동 실행
      const transferParams: TransferInUseParams = {
        sourceType: values.source_type,
        targetType: values.target_type,
        dryRun: false,
      };

      const response = await transferInUseBetweenTypes(transferParams);
      
      if (response.code === 0) {
        message.success(t("toast.payment.transferSuccess"));
        form.resetFields();
      } else {
        message.error(response.message || t("toast.payment.transferFailed"));
      }
    } catch (error) {
      console.error("Transfer error:", error);
      message.error(t("toast.payment.transferError"));
    } finally {
      setLoading(false);
    }
  };

  const sourceType = Form.useWatch('source_type', form);
  const targetType = Form.useWatch('target_type', form);

  // 타겟 입금방법도 전체 리스트에서 선택 (소스입금방법과 동일한 옵션)
  const availableTargetMethods = depositMethods;

  // 선택된 소스와 타겟의 타이틀 찾기
  const getMethodTitle = (type: string) => {
    const method = depositMethods.find(m => m.type === type);
    return method ? method.title : type;
  };

  if (isLoadingMethods) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>{i18next.t("depoMethod.loadingMethods")}</div>
      </div>
    );
  }

  return (
    <div>
      <Alert
        message={i18next.t("depoMethod.transferGuide")}
        description={i18next.t("depoMethod.transferGuideDesc")}
        type="info"
        showIcon
        icon={<ExclamationCircleOutlined />}
        style={{ marginBottom: 24 }}
      />

      <Card title={i18next.t("title.moveBetweenDepositMethods")}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleTransfer}
        >
          <Form.Item
            label={i18next.t("depoMethod.sourceMethod")}
            name="source_type"
            rules={[{ required: true, message: t("validation.selectSourceMethod") }]}
          >
            <Select placeholder={i18next.t("depoMethod.selectSourceMethod")} size="large" showSearch>
              {depositMethods.map(method => (
                <Option key={method.type} value={method.type}>
                  {method.type} - {method.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <SwapOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          </div>

          <Form.Item
            label={i18next.t("depoMethod.targetMethod")}
            name="target_type"
            rules={[{ required: true, message: t("validation.selectTargetMethod") }]}
          >
            <Select 
              placeholder={i18next.t("depoMethod.selectTargetMethod")} 
              size="large"
              showSearch
            >
              {availableTargetMethods.map(method => (
                <Option key={method.type} value={method.type}>
                  {method.type} - {method.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {sourceType && targetType && (
            <Alert
              message={`${getMethodTitle(sourceType)} → ${getMethodTitle(targetType)}`}
              description={i18next.t("depoMethod.transferInfo", { source: getMethodTitle(sourceType), sourceType, target: getMethodTitle(targetType), targetType })}
              type="warning"
              style={{ marginBottom: 16 }}
            />
          )}

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                disabled={!sourceType || !targetType}
                size="large"
              >
                이동 실행
              </Button>
              <Button 
                onClick={() => form.resetFields()}
                size="large"
              >
                초기화
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default DepositMethodTransfer;
