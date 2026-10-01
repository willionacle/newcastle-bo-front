import { Col, Form, Input, Row, notification } from "antd";
import i18next from "@/i18n/i18n";
import { noteTextareaStyle } from "./UserNoteStyle";
import { useTranslation } from "react-i18next";

import { useEffect } from "react";
import { User } from "@/api/users/get";
import SaveBtn from "@/components/SaveBtn";
import { api } from "@/api/axios";
import useUserStore from "@/store/user.store";
import { joinNote, legacyMemoOf } from "@/utils/userMemo";

interface NoteField {
  key: string;
  titleKey: string;
  primary: string;
  maxLength: number;
  height: number;
}

// 6개 메모 → 4개로 통합: 총판 공유(user_memo_5)는 메모사항(user_memo_2)으로,
// 영업팀 공유(user_memo_6)는 공유사항(user_memo_3)으로 합쳐 표시한다 (utils/userMemo.ts).
const noteColumns: NoteField[][] = [
  [
    {
      key: "content_1",
      titleKey: "title.userInfo",
      primary: "user_memo_1",
      maxLength: 1000,
      height: 120,
    },
    {
      key: "content_4",
      titleKey: "title.withdrawalMemo",
      primary: "user_memo_4",
      maxLength: 1000,
      height: 120,
    },
  ],
  [
    {
      key: "content_2",
      titleKey: "memberDetail.userNote.memo",
      primary: "user_memo_2",
      maxLength: 2000,
      height: 296,
    },
  ],
  [
    {
      key: "content_3",
      titleKey: "memberDetail.userNote.shared",
      primary: "user_memo_3",
      maxLength: 2000,
      height: 296,
    },
  ],
];

const noteFields = noteColumns.flat();

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
  const { t } = useTranslation();
  const {token, userid} = useUserStore.getState()
  const handleSubmit = async (e: FormData) => {
    if (!id) return;

    // Persist what the admin sees, not a re-merge of props — the textarea may hold edits.
    const memos: Record<string, string> = {};
    noteFields.forEach((field) => {
      memos[field.primary] = e[field.key] ?? "";
      const legacy = legacyMemoOf(field.primary);
      if (legacy) memos[legacy] = "";
    });

    try {
      const res = await api.updateUser({
        ...data,
        userid: userid,
        password: undefined,
        local_grade_config: data.local_grade_config ?? "automatic",
        ...memos,
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
      noteFields.forEach((field) => {
        const legacy = legacyMemoOf(field.primary);
        form.setFieldValue(
          field.key,
          joinNote(data[field.primary], legacy && data[legacy])
        );
      });
    }
  }, [data]);

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Row gutter={[16, 16]}>
        {noteColumns.map((column) => (
          <Col span={8} key={column[0].key}>
            {column.map((field) => (
              <div key={field.key}>
                <p style={{marginBottom: '1rem', fontWeight: 'bold'}}>{t(field.titleKey)}</p>

                <Form.Item name={field.key} initialValue={""}>
                  <Input.TextArea
                    className="textarea-count-topleft"
                    maxLength={field.maxLength}
                    showCount
                    size="small"
                    style={noteTextareaStyle(field.height)}
                  />
                </Form.Item>
              </div>
            ))}
          </Col>
        ))}
        <SaveBtn className="user-button" size="middle" />
      </Row>
    </Form>
  );
};

export default UserNote;
