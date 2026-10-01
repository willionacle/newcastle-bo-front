import gameList from "@/pages/betting/record/gameList";
import { Form, Select, SelectProps } from "antd";
import { useTranslation } from "react-i18next";

const VenderSelect = () => {
  const { t } = useTranslation();
  const vendorOptions: SelectProps["options"] = [];

  for (const key in gameList) {
    vendorOptions.push({
      label: gameList[key],
      value: key,
    });
  }

  return (
    <Form.Item
      label={t("memberDetail.mis053")}
      name={"vendorKey"}
      initialValue={""}
    >
      <Select size="small" options={vendorOptions} allowClear />
    </Form.Item>
  );
};

export default VenderSelect;
