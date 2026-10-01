import i18next from "@/i18n/i18n";
import { createMessageTemplateAPI } from "@/api/message-template/post";
import { editMessageTemplateAPI } from "@/api/message-template/put";
import { PostGetMessageTemplate } from "@/api/types";
import SaveBtn from "@/components/SaveBtn";
import useEditor from "@/hooks/editor/Editor";
import {
  Col,
  Form,
  Input, 
  Row,
  message,
  notification,
} from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface FormData {
  title: string;
  message: string;
}

const MessageTemplateForm = ({data, tempMessage}: {data?: PostGetMessageTemplate['data']; tempMessage?: object;}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormData>();
  const navigate = useNavigate();
  const { el, value } = useEditor(tempMessage);
  const handleSubmit = async (e: FormData) => {
    if (!value) {
      notification.error({message: t("toast.messageTemplate.enterContent")});
      return;
    }
    const body = { 
      "id"        : data ? data.id : undefined,
      "title"     : e.title,
      "message"   : value,
    }
    let res;
    try {
      if (data) {
        res = await editMessageTemplateAPI(body)
      } else {
        res = await createMessageTemplateAPI(body)
      }
      const {data: {code, message: resMessage}} = res
      if (code === 0) {
        message.success(t("global.success"));
        navigate("/system/message-template");
      } else {
        notification.error({message: resMessage})
      }
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        title: data.title,
        // message: data.message,
      })
    }
  }, [data])

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label={t("messageDetail.msgr007")}
            name={"title"}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={24}>
          <div className="" style={{margin: '8px'}}>{i18next.t("col.content")}</div>
          {el}
        </Col>
      </Row>
      <SaveBtn />
    </Form>
  );
};

export default MessageTemplateForm;
