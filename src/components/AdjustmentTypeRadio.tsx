import { Form, Radio } from "antd";
import { useTranslation } from "react-i18next";

const AdjustmentTypeRadio = () => {
  const { t } = useTranslation();
  return (
    <Form.Item label={t("memberDetail.mis040")} name={"type"} initialValue={""}>
      <Radio.Group optionType="button" size="small" buttonStyle="solid">
        <Radio value={""}>{t("global.none")}</Radio>
        <Radio value={"MANUAL_ADJUSTMENT"}>{t("memberDetail.mis081")}</Radio>
        <Radio value={"SYSTEM_ADJUSTMENT"}>{t("memberDetail.mis082")}</Radio>
      </Radio.Group>
    </Form.Item>
  );
};

export default AdjustmentTypeRadio;
