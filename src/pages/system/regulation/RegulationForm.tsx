import { Divider, Form, Input, notification, Select } from "antd";
import { useTranslation } from "react-i18next";
import SaveBtn from "@/components/SaveBtn";
import useEditor from "@/hooks/editor/Editor";
import { useEffect } from "react";
// import { GF } from "@/utils/GlobalFunctions";
import { PostGetRegulationRes } from "@/api/types";
import useUserStore from "@/store/user.store";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/axios";
import RegulationsSelect from "@/components/RegulationsSelect";

interface Props {
  data?: PostGetRegulationRes["data"];
  content?: object;
}

interface FormData {
  userid: number;
  title: string;
  content: string;
  type: string;
  status?: number;
}

const RegulationForm = ({ data, content }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormData>();
  const { el, value } = useEditor(content);
  const { token, userid } = useUserStore.getState();
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    const { title, type, status } = e;
    const reqBody = {
      userid: userid,
      title: title,
      content: value,
      type: type,
      ...(data ? { status } : {}),
    };

    if (data) {
      const res = await api.updateRegulation(
        {
          ...reqBody,
          id: data.id,
        },
        token
      );
      const {
        data: { code, message },
      } = res;
      console.log(res);
      if (code == 0) {
        notification.success({ message: message });
        navigate("/system/regulation");
      } else {
        notification.error({ message: message });
      }
    } else {
      const res = await api.createRegulation(reqBody, token);
      const {
        data: { code, message },
      } = res;
      if (code == 0) {
        notification.success({ message: message });
        navigate("/system/regulation");
      } else {
        notification.error({ message: message });
      }
    }
  };

  useEffect(() => {
    if (data) {
      const { title, status, content_type } = data;
      form.setFieldsValue({
        title,
        status,
        type: content_type,
      });
    }
  }, [data]);

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      <Form.Item
        label={t("bannerDetail.bnr006")}
        rules={[{ required: true }]}
        name={"title"}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={t("regulation.rg007")}
        rules={[{ required: true }]}
        name={"type"}
      >
        <RegulationsSelect hideAll/>
      </Form.Item>

      {data && (
        <Form.Item
          label={t("regulation.rg003")}
          rules={[{ required: true }]}
          name={"status"}
        >
          <Select>
            <Select.Option value={1}>{t("regulation.rg005")}</Select.Option>
            <Select.Option value={0}>{t("regulation.rg006")}</Select.Option>
          </Select>
        </Form.Item>
      )}
      <Divider />
      {el}
      <SaveBtn />
    </Form>
  );
};

export default RegulationForm;
