import { Col, Form, Input, Row, notification } from "antd";
import i18next from "@/i18n/i18n";
import { textareaStyle } from "./UserNoteStyle";

import { useEffect } from "react";
import { User } from "@/api/users/get";
import SaveBtn from "@/components/SaveBtn";
import { api } from "@/api/axios";
import useUserStore from "@/store/user.store";

interface SystemNoteData {
  id: number;
  title: string;
  contents: string;
}

const dummyData: SystemNoteData[] = [
  { id: 1, title: i18next.t("title.userInfo"), contents: "" },
  { id: 2, title: i18next.t("title.userInfo"), contents: "" },
  { id: 3, title: i18next.t("title.userInfo"), contents: "" },
  { id: 4, title: i18next.t("title.withdrawalMemo"), contents: "" },
  { id: 5, title: i18next.t("title.agentShare"), contents: "" },
  { id: 6, title: i18next.t("title.salesTeamShare"), contents: "" },
];

interface Props {
  data: any;
  id: User["id"] | undefined;
  mutate: any;
}

interface FormData {
  [key: string]: string;
}

const UserNote = ({ data, id, mutate }: Props) => {
  const [form] = Form.useForm<FormData>();
  const {token, userid} = useUserStore.getState()
  const handleSubmit = async (e: FormData) => {
    if (!id) return;

    try {
      const res = await api.updateUser({
        ...data,
        userid: userid,
        password: undefined,
        local_grade_config: data.local_grade_config ?? "automatic",
        user_memo_1: e.content_1,
        user_memo_2: e.content_2,
        user_memo_3: e.content_3,
        user_memo_4: e.content_4,
        user_memo_5: e.content_5,
        user_memo_6: e.content_6,
      }, token);

      if (res.data.code == 0) {
        notification.success({
          message: i18next.t("toast.common.saveSuccess"),
        });
      } else {
        notification.success({
          message: res.data.message,
        });
      }
    } catch (error) {
      notification.error({
        message: i18next.t("toast.common.saveFailed"),
      });
    } finally {
      mutate();
    }
  };

  useEffect(() => {
    form.resetFields();

    if (data) {
      form.setFieldValue(`content_1`, data.user_memo_1);
      form.setFieldValue(`content_2`, data.user_memo_2);
      form.setFieldValue(`content_3`, data.user_memo_3);
      form.setFieldValue(`content_4`, data.user_memo_4);
      form.setFieldValue(`content_5`, data.user_memo_5);
      form.setFieldValue(`content_6`, data.user_memo_6);
    }
  }, [data]);

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Row gutter={[16, 16]}>
        {dummyData.map((item) => (
          <Col span={8} key={item.id}>
            <p style={{marginBottom: '1rem', fontWeight: 'bold'}}>{item.title}</p>

            <Form.Item name={`content_${item.id}`} initialValue={""}>
              <Input.TextArea
              className="textarea-count-topleft"
                maxLength={1000}
                showCount
                size="small"
                style={textareaStyle}
              />
            </Form.Item>
          </Col>
        ))}
        <SaveBtn className="user-button" size="middle" />
      </Row>
    </Form>
  );
};

export default UserNote;
