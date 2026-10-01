import { api } from "@/api/axios";
import i18next from "@/i18n/i18n";
import { PostAddMessage } from "@/api/types";
import AgentSelect from "@/components/AgentSelect";
import GradeSelect from "@/components/GradeSelect";
import LevelSelector from "@/components/LevelSelector";
import MessageTemplateSelect from "@/components/MessageTemplateSelect";
import SaveBtn from "@/components/SaveBtn";
import UploadCSVFile from "@/components/UploadCSVFile";
import UserSelect from "@/components/UserSelect";
import UserStatusSelector from "@/components/UserStatusSelector";
import useEditor from "@/hooks/editor/Editor";
import useUserStore from "@/store/user.store";
import {
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Radio,
  RadioChangeEvent,
  Row,
  message,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

type FormData = PostAddMessage;

const MessageForm = () => {
  const { token, userid } = useUserStore.getState();
  const { t } = useTranslation();
  const [form] = Form.useForm<FormData>();
  const [target, setTarget] = useState<FormData["target"]>("user");
  const { el, value, handleSetContent, editor } = useEditor();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any>([]);

  const handleSubmit = async (e: FormData) => {
    const { username = [], agent_username = [],usernames  } = e;

    let level: any = e.level ? e.level : null;

    if (e.target === "grade") {
      level = Array.isArray(e.grade)
        ? e.grade.map((n: string) => String(n))
        : (e.grade ?? null);
    }

    const body = {
      userid: userid,
      target: e.target === "bulk" ? "user" :e.target,
      // username:
      //   username.length > 0
      //     ? username.map((item: { label: any }) => item.label)
      //     : null,
      username:
      e.target === "bulk"
        ? usernames
            ?.split("\n")
            .map((u: string) => u.trim())
            .filter(Boolean)
        : username.length > 0
        ? username.map((item: { label: any }) => item.label)
        : null,
      agent_username:
        agent_username.length > 0
          ? agent_username.map((item: { label: any }) => item.label)
          : null,
      title: e.title,
      content: value,
      level,
      status: e.user_status ? e.user_status : null,
      expires_at: dayjs(e.expires_at).format("YYYY-MM-DD HH:mm:ss"),
    };

    try {
      const res = await api.createMessage(body, token);
      const {
        data: { code, message: resMessage },
      } = res;
      if (code === 0) {
        message.success(t("global.success"));
        navigate("/system/message");
      } else {
        notification.error({ message: resMessage });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTargetChange = (e: RadioChangeEvent) => {
    form.setFieldValue("target", e.target.value);
    setTarget(e.target.value);
  };

  useEffect(() => {
    if (users?.length) {
      form.setFieldValue(
        "username",
        users.map((u: any) => ({ value: String(u), label: String(u) })),
      );
    } else {
      form.setFieldValue("username", []);
    }
  }, [users, form]);

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name={"target"} initialValue={"user"}>
            <Radio.Group onChange={handleTargetChange}>
              <Radio value={"online"}>{t("messageDetail.msgr003")}</Radio>
              <Radio value={"level"}>{t("messageDetail.msgr005")}</Radio>
              <Radio value={"user"}>{t("messageDetail.msgr006")}</Radio>
              <Radio value={"status"}>{t("messageDetail.msgr010")}</Radio>
              <Radio value={"agent"}>{i18next.t("system.selectedDistributor")}</Radio>
              <Radio value={"grade"}>{t("messageDetail.msgr012")}</Radio>
              <Radio value={"bulk"}>{t("col.userListNewline")}</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>

        {target === "user" && (
          <Col span={24}>
            <UserSelect mode="multiple" withCheckbox valueCode="username" />
          </Col>
        )}

        {target === "level" && (
          <Col span={8}>
            <LevelSelector mode="multiple" withCheckbox />
          </Col>
        )}

        {target === "status" && (
          <Col span={8}>
            <UserStatusSelector
              mode="multiple"
              withCheckbox
              initialValue={null}
            />
          </Col>
        )}

        {target === "agent" && (
          <Col span={24}>
            <AgentSelect name="agent_username" mode="multiple" withCheckbox />
          </Col>
        )}

        {target === "grade" && (
          <Col span={8}>
            <GradeSelect
              name="grade"
              mode="multiple"
              defaultValue={null}
              hideAll
            />
          </Col>
        )}

        {target === "bulk" && (
          <Col span={24}>
            <Form.Item
              name="usernames"
              label={i18next.t("col.userListNewline")}
              rules={[{ required: true, message: i18next.t("validation.enterUserListField") }]}
            >
              <TextArea
                rows={6}
                placeholder="user1&#10;user2&#10;user3"
              />
            </Form.Item>
          </Col>
        )}

        <Divider />

        {target === "user" && (
          <Col span={24}>
            <UploadCSVFile
              data={users}
              setData={setUsers}
              stringOutput={{
                headerless: true,
                trim: true,
                ignoreEmpty: true,
                unique: true,
              }}
            />
          </Col>
        )}

        <Divider />

        <Col span={24}>
          <MessageTemplateSelect
            messageFormName="content"
            titleFormName="title"
            handleSetContent={handleSetContent}
            editor={editor}
          />
        </Col>

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
          <Form.Item
            label={t("couponDetail.cpre001")}
            rules={[{ required: true }]}
            name={"expires_at"}
            initialValue={dayjs().tz().add(7, "day")}
          >
            <DatePicker style={{ width: "100%" }} showTime />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label={t("messageDetail.msgr008")}
            name={"content"}
            rules={[{ required: !value }]}
          >
            {/* <Input.TextArea style={{ height: 300 }} /> */}
            {el}
          </Form.Item>
        </Col>
      </Row>
      <Divider />
      <SaveBtn />
    </Form>
  );
};

export default MessageForm;
