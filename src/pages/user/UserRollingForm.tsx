import { updateUserRolling } from "@/api/settings/put";
import i18next from "@/i18n/i18n";
import { ResUser } from "@/api/types"
import Panel from "@/components/Panel"
import { EditOutlined, SaveOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Form, InputNumber, notification, Row, Switch } from "antd"
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


const UserRollingForm = ({user}: {user?: ResUser['data']}) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const navigate = useNavigate()
  const [disabled, setDisabled] = useState(true);

  const handleUserRollingSave = async () => {
    const values = form.getFieldsValue();

    try {
      const { data } = await updateUserRolling({
        id: values.rollingID,
        rollingPaymentOnoff: values.rolling_payment_onoff ? 1 : 0,
        rollingPaymentLive: values.rolling_payment_live ?? 0,
        rollingPaymentSlot: values.rolling_payment_slot ?? 0,
        rollingPaymentSports: values.rolling_payment_sports ?? 0,
        rollingPaymentMinigame: values.rolling_payment_minigame ?? 0,
        rollingPaymentFishing: values.rolling_payment_fishing ?? 0,
        rollingPaymentBoard: values.rolling_payment_board ?? 0,
        rollingPaymentEtc: values.rolling_payment_etc ?? 0,
      });

      notification[data.code === 0 ? "success" : "error"]({
        message: data.data?.message || data.message
      });

      if (data.code === 0) {
        navigate(-1);
        setDisabled(true)
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        notification.error({ message: t("toast.rolling.userNotFound") });
      } else if (error.response?.status === 400) {
        notification.error({ message: t("toast.rolling.invalidData") });
      } else if (error.response?.status === 401) {
        notification.error({ message: t("toast.rolling.authRequired") });
      } else {
        notification.error({ message: t("toast.rolling.updateFailed") });
      }
      console.error("Error updating rolling settings:", error);
    }
  }

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        rollingID: user.id,
        rolling_payment_onoff: user.rolling_payment_onoff == 0 ? false : true,
        rolling_payment_live: user.rolling_payment_live,
        rolling_payment_slot: user.rolling_payment_slot,
        rolling_payment_sports: user.rolling_payment_sports,
        rolling_payment_minigame: user.rolling_payment_minigame,
        rolling_payment_fishing: user.rolling_payment_fishing,
        rolling_payment_board: user.rolling_payment_board,
        rolling_payment_etc: user.rolling_payment_etc,
      })
    }
  }, [user])

  return (
    <Panel title={i18next.t("col.rollingDeductionSetting")}>
      <Form.Item 
        label={'Rolling ID'}
        name={'rollingID'}
        hidden
      >
        <InputNumber controls={false} size="small" style={{width: '100%'}} type="hidden"/>
      </Form.Item>
      <Form.Item 
        name={"rolling_payment_onoff"} 
        // rules={[{ required: true }]}
      >
        <Switch disabled={disabled} />
      </Form.Item>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item 
            label={i18next.t("gameCat.liveCasino")} 
            name={"rolling_payment_live"} 
            // rules={[{ required: true }]}
          >
            <InputNumber 
              suffix="%"
              controls={false}
              min={0}
              max={100}
              style={{width: '100%'}}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            label={i18next.t("memberDetail.mis132")} 
            name={"rolling_payment_slot"} 
            // rules={[{ required: true }]}
          >
            <InputNumber 
              suffix="%"
              controls={false}
              min={0}
              max={100}
              style={{width: '100%'}}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            label={i18next.t("memberDetail.mis133")} 
            name={"rolling_payment_sports"} 
            // rules={[{ required: true }]}
          >
            <InputNumber 
              suffix="%"
              controls={false}
              min={0}
              max={100}
              style={{width: '100%'}}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            label={i18next.t("memberDetail.mis134")} 
            name={"rolling_payment_minigame"} 
            // rules={[{ required: true }]}
          >
            <InputNumber 
              suffix="%"
              controls={false}
              min={0}
              max={100}
              style={{width: '100%'}}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            label={i18next.t("title.fishingGame")} 
            name={"rolling_payment_fishing"} 
            // rules={[{ required: true }]}
          >
            <InputNumber 
              suffix="%"
              controls={false}
              min={0}
              max={100}
              style={{width: '100%'}}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            label={i18next.t("gameCat.board")} 
            name={"rolling_payment_board"} 
            // rules={[{ required: true }]}
          >
            <InputNumber 
              suffix="%"
              controls={false}
              min={0}
              max={100}
              style={{width: '100%'}}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            label={i18next.t("title.etc")} 
            name={"rolling_payment_etc"}
            // rules={[{ required: true }]}
          >
            <InputNumber 
              suffix="%"
              controls={false}
              min={0}
              max={100}
              style={{width: '100%'}}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </Row>
      
      <Flex gap={4}>
          <Button
            type="primary"
            htmlType="button"
            icon={disabled ? <EditOutlined /> : <StopOutlined />}
            onClick={() => setDisabled(!disabled)}
            disabled={false}
            danger={!disabled}
            className="user-button"
            style={{marginLeft: 'auto'}}
            size="middle"
          >
            {disabled ? i18next.t("sportsBet.edit") : i18next.t("global.cancel")}
          </Button>
          <Button
            type="primary"
            htmlType="button"
            className="user-button"
            size="middle"
            icon={<SaveOutlined />}
            disabled={disabled}
            onClick={handleUserRollingSave}
          >
            저장
          </Button>
        </Flex >
    </Panel>
  )
}

export default UserRollingForm