import React, { useState } from "react";
import i18next from "@/i18n/i18n";
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Space,
  notification,
  Typography,
  Breadcrumb,
  Avatar,
  Tag,
  Spin,
} from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { useAgentPromptList, updateAgentPrompt } from "@/api/mira-agent-prompt";
import { AgentPrompt } from "@/api/mira-agent-prompt/types";

const { Title, Text } = Typography;
const { TextArea } = Input;

const MiraAgentPrompt: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AgentPrompt | null>(null);
  const [loading, setLoading] = useState(false);

  const { swr } = useAgentPromptList();

  // 모달 열기 (수정)
  const handleOpenEdit = (record: AgentPrompt) => {
    setEditingRecord(record);
    form.setFieldsValue({
      Name: record.Name,
      Age: record.Age,
      Personality: record.Personality,
      SystemPrompt: record.SystemPrompt,
      profileImg: record.profileImg,
      Active: record.Active,
    });
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  // 저장 (수정)
  const handleSubmit = async () => {
    if (!editingRecord) return;

    try {
      const values = await form.validateFields();
      setLoading(true);

      const response = await updateAgentPrompt({
        agentIndex: editingRecord.AgentIndex,
        Name: values.Name,
        Age: values.Age,
        Personality: values.Personality,
        SystemPrompt: values.SystemPrompt,
        profileImg: values.profileImg,
        Active: values.Active,
      });

      if (response.data.code === 0) {
        notification.success({
          message: i18next.t("toast.agentPrompt.updateSuccess"),
          description: i18next.t("toast.agentPrompt.updateSuccessDesc"),
        });
        handleCloseModal();
        swr.mutate();
      } else {
        notification.error({
          message: i18next.t("toast.agentPrompt.updateFailed"),
          description: response.data.data?.message || i18next.t("toast.agentPrompt.updateError"),
        });
      }
    } catch (error: any) {
      notification.error({
        message: i18next.t("toast.agentPrompt.updateFailed"),
        description: error.message || i18next.t("toast.agentPrompt.saveError"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {/* 헤더 */}
        <div>
          <Breadcrumb
            items={[
              { title: <Link to="/">{i18next.t("col.home")}</Link> },
              { title: "MIRA" },
              { title: i18next.t("title.agentPromptMgmt") },
            ]}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              Agent Prompt 관리
            </Title>
          </div>
        </div>

        {/* 카드 그리드 */}
        {swr.isLoading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {swr.data?.data?.map((agent) => (
              <Col key={agent.Id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  style={{ textAlign: "center" }}
                  actions={[
                    <Button
                      key="edit"
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleOpenEdit(agent)}
                    >
                      {i18next.t("sportsBet.edit")}
                    </Button>,
                  ]}
                >
                  <Avatar
                    size={80}
                    src={agent.profileImg}
                    icon={!agent.profileImg && <UserOutlined />}
                    style={{ marginBottom: 12 }}
                  />
                  <Title level={5} style={{ margin: "8px 0 4px" }}>
                    {agent.Name}
                  </Title>
                  <Text type="secondary">{agent.Age ? `${agent.Age}세` : "-"}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag color={agent.Active ? "green" : "default"}>
                      {agent.Active ? i18next.t("regulation.rg005") : i18next.t("regulation.rg006")}
                    </Tag>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Space>

      {/* 수정 모달 */}
      <Modal
        title={i18next.t("title.agentPromptEdit")}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            {i18next.t("global.cancel")}
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
            저장
          </Button>,
        ]}
        width={700}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          {editingRecord && (
            <Form.Item label="Agent Index">
              <Input value={editingRecord.AgentIndex} disabled />
            </Form.Item>
          )}
          <Form.Item
            name="Name"
            label={i18next.t("col.name")}
            rules={[
              { required: true, message: i18next.t("validation.enterNameDot") },
              { max: 50, message: i18next.t("validation.nameMax50") },
            ]}
          >
            <Input placeholder={i18next.t("miraForm.enterName")} maxLength={50} showCount />
          </Form.Item>
          <Form.Item name="Age" label={i18next.t("miraForm.age")}>
            <InputNumber
              placeholder={i18next.t("miraForm.enterAge")}
              min={0}
              max={999}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="Personality" label={i18next.t("miraForm.personality")}>
            <TextArea rows={3} placeholder={i18next.t("miraForm.enterPersonality")} />
          </Form.Item>
          <Form.Item
            name="SystemPrompt"
            label={i18next.t("miraForm.systemPrompt")}
            rules={[{ required: true, message: i18next.t("validation.enterSystemPrompt") }]}
          >
            <TextArea rows={6} placeholder={i18next.t("miraForm.enterSystemPrompt")} />
          </Form.Item>
          <Form.Item
            name="profileImg"
            label={i18next.t("miraForm.profileImageUrl")}
            rules={[{ max: 500, message: i18next.t("validation.urlMax500") }]}
          >
            <Input placeholder={i18next.t("miraForm.enterProfileImageUrl")} maxLength={500} />
          </Form.Item>
          <Form.Item name="Active" label={i18next.t("regulation.rg005")} valuePropName="checked">
            <Switch disabled={editingRecord?.AgentIndex === -2} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default MiraAgentPrompt;
