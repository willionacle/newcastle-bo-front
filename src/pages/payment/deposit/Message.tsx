import i18next from "@/i18n/i18n";
import { api } from "@/api/axios";
import MessageTemplateSelect from "@/components/MessageTemplateSelect";
// import MessageTemplateSelect from "@/components/MessageTemplateSelect";
import SaveBtn from "@/components/SaveBtn";
import useEditor from "@/hooks/editor/Editor";
import useUserStore from "@/store/user.store";
import { Col, Form, Input, Row, notification } from "antd";
import dayjs from "dayjs";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

interface FormData {
  messageBody: string;
  messageTitle: string;
}

interface Props {
  username: string | undefined;
  setUsername: Dispatch<SetStateAction<string | undefined>>;
}

const Message = ({ username, setUsername }: Props) => {
  const {token, userid} = useUserStore.getState()
  const [form] = Form.useForm<FormData>();
  const { t } = useTranslation();
  const { el, value, handleSetContent, editor } = useEditor();

  const handleSubmit = async (e: FormData) => {
    if (!value) {
      notification.error({message: i18next.t("toast.messageTemplate.enterContent")});
      return;
    }
    try {
      if (username) {

        const body = { 
          "userid"    : userid,
          "target"    : 'user',
          "username"  : [username],
          "title"     : e.messageTitle,
          "content"   : value,
          "level"     : null,
          "status"    : null,
          "agent_username"    : null,
          expires_at: dayjs().tz().add(7, "day").format("YYYY-MM-DD HH:mm:ss"),
        }
    

        const res = await api.createMessage(body, token)
        const {data: {code, message: resMessage}} = res
        if (code === 0) {
          notification.success({
            message: t("global.success"),
          });
          setUsername(undefined);
        } else {
          notification.error({message: resMessage})
        }
      }
    } catch (error) {
      console.log(error);

      notification.error({
        message: i18next.t("global.fail"),
      });
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label={t("messageDetail.msgr007")}
            name={"messageTitle"}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={24}>
          <MessageTemplateSelect messageFormName="messageBody" titleFormName="messageTitle" handleSetContent={handleSetContent} editor={editor} />
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

export default Message;
