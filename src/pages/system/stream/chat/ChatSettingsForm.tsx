import i18next from "@/i18n/i18n";
import { api } from "@/api/axios";
import SaveBtn from "@/components/SaveBtn";
import useUserStore from "@/store/user.store";
import {
  Divider,
  Form,
  Input,
  Switch,
  notification,
} from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface FormData {
  forbidden_word: string;
  is_allowed: 1 | 0;
}

const ChatSettingsForm = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormData>();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormData) => {
    const { token } = useUserStore.getState();
    const { forbidden_word,is_allowed } = e;

    const reqBody = {
      forbidden_word,
      is_allowed: is_allowed ? 1 : 0,
    };

    try {
       const res = await api.createChatForbiddenWords(reqBody, token);
        const {
          data: { code, message },
        } = res;
        if (code == 0) {
          notification.success({ message: message });
          navigate("/stream/chat-user-list?tab=forbidder-words");
        } else {
          notification.error({ message: message });
        }
    } catch (error: any) {
      notification.error({
        message: error.response.data.error.message ?? i18next.t("toast.common.saveFailed"),
      });
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        label={t("col.word")}
        name={"forbidden_word"}
        rules={[{ required: true }]}
      >
        <Input type="text" size="small" />
      </Form.Item>

      <Form.Item
        label={t("col.exposure")}
        name={"is_allowed"}
        rules={[{ required: true }]}
        initialValue={false}
      >
        <Switch />
      </Form.Item>
      <Divider />
      <SaveBtn />
    </Form>
  );
};

export default ChatSettingsForm;
