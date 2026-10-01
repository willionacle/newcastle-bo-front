import React, { useState } from "react";
import i18next from "@/i18n/i18n";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  notification,
  Typography,
  Breadcrumb,
  Tooltip,
} from "antd";
import type { TableProps } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

import {
  useKnowledgeList,
  createKnowledge,
  updateKnowledge,
  deleteKnowledge,
} from "@/api/mira-knowledge";
import { Knowledge } from "@/api/mira-knowledge/types";

const { Title } = Typography;
const { TextArea } = Input;

const MiraKnowledge: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Knowledge | null>(null);
  const [loading, setLoading] = useState(false);

  const { swr, paginationProps } = useKnowledgeList();

  // 모달 열기 (등록)
  const handleOpenCreate = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // 모달 열기 (수정)
  const handleOpenEdit = (record: Knowledge) => {
    setEditingRecord(record);
    form.setFieldsValue({
      title: record.Title,
      content: record.Content,
    });
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  // 저장 (등록/수정)
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingRecord) {
        // 수정
        const response = await updateKnowledge({
          id: editingRecord.Id,
          title: values.title,
          content: values.content,
        });

        if (response.data.code === 0) {
          notification.success({
            message: i18next.t("toast.knowledge.updateSuccess"),
            description: i18next.t("toast.knowledge.updateSuccessDesc"),
          });
          handleCloseModal();
          swr.mutate();
        } else {
          notification.error({
            message: i18next.t("toast.knowledge.updateFailed"),
            description: response.data.data?.message || i18next.t("toast.knowledge.updateError"),
          });
        }
      } else {
        // 등록
        const response = await createKnowledge({
          title: values.title,
          content: values.content,
        });

        if (response.data.code === 0) {
          notification.success({
            message: i18next.t("toast.knowledge.createSuccess"),
            description: i18next.t("toast.knowledge.createSuccessDesc"),
          });
          handleCloseModal();
          swr.mutate();
        } else {
          notification.error({
            message: i18next.t("toast.knowledge.createFailed"),
            description: response.data.data?.message || i18next.t("toast.knowledge.createError"),
          });
        }
      }
    } catch (error: any) {
      notification.error({
        message: editingRecord ? i18next.t("toast.knowledge.updateFailed") : i18next.t("toast.knowledge.createFailed"),
        description: error.message || i18next.t("toast.knowledge.saveError"),
      });
    } finally {
      setLoading(false);
    }
  };

  // 삭제
  const handleDelete = async (id: number) => {
    try {
      const response = await deleteKnowledge({ id });

      if (response.data.code === 0) {
        notification.success({
          message: i18next.t("toast.knowledge.deleteSuccess"),
          description: i18next.t("toast.knowledge.deleteSuccessDesc"),
        });
        swr.mutate();
      } else {
        notification.error({
          message: i18next.t("toast.knowledge.deleteFailed"),
          description: response.data.data?.message || i18next.t("toast.knowledge.deleteError"),
        });
      }
    } catch (error: any) {
      notification.error({
        message: i18next.t("toast.knowledge.deleteFailed"),
        description: error.message || i18next.t("toast.knowledge.deleteError"),
      });
    }
  };

  // 테이블 컬럼 정의
  const columns: TableProps<Knowledge>["columns"] = [
    {
      title: "No",
      align: "center",
      width: 60,
      render: (_value: unknown, _record: Knowledge, index: number) => {
        const total = swr.data?.data?.total ?? 0;
        const page = swr.data?.data?.page ?? 1;
        const limit = swr.data?.data?.limit ?? 20;
        return total - (page - 1) * limit - index;
      },
    },
    {
      title: i18next.t("col.title"),
      dataIndex: "Title",
      key: "Title",
      width: 200,
      ellipsis: true,
    },
    {
      title: i18next.t("col.content"),
      dataIndex: "Content",
      key: "Content",
      ellipsis: {
        showTitle: false,
      },
      render: (value: string) => (
        <Tooltip placement="topLeft" title={value}>
          <span>{value}</span>
        </Tooltip>
      ),
    },
    {
      title: i18next.t("title.modifiedDate"),
      dataIndex: "UpdatedAt",
      key: "UpdatedAt",
      width: 120,
      align: "center",
      render: (value: string) => (value ? dayjs(value).format("YYYY-MM-DD") : "-"),
    },
    {
      title: i18next.t("col.manage"),
      key: "action",
      width: 100,
      align: "center",
      render: (_value: unknown, record: Knowledge) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleOpenEdit(record)}
          />
          <Popconfirm
            title={i18next.t("title.confirmDelete")}
            onConfirm={() => handleDelete(record.Id)}
            okText={i18next.t("global.delete")}
            cancelText={i18next.t("global.cancel")}
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {/* 헤더 */}
        <div>
          <Breadcrumb
            items={[
              { title: <Link to="/">{i18next.t("col.home")}</Link> },
              { title: "MIRA" },
              { title: i18next.t("title.knowledgeMgmt") },
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
              Knowledge 관리
            </Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
              등록
            </Button>
          </div>
        </div>

        {/* 테이블 */}
        <Table
          columns={columns}
          dataSource={swr.data?.data?.list || []}
          loading={swr.isLoading}
          pagination={paginationProps(swr.data?.data?.total)}
          rowKey="Id"
          size="small"
        />
      </Space>

      {/* 등록/수정 모달 */}
      <Modal
        title={editingRecord ? i18next.t("miraForm.knowledgeEdit") : i18next.t("miraForm.knowledgeCreate")}
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
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="title"
            label={i18next.t("col.title")}
            rules={[
              { required: true, message: i18next.t("validation.enterTitleDot") },
              { max: 200, message: i18next.t("validation.titleMax200") },
            ]}
          >
            <Input placeholder={i18next.t("validation.enterTitle")} maxLength={200} showCount />
          </Form.Item>
          <Form.Item
            name="content"
            label={i18next.t("col.content")}
            rules={[
              { required: true, message: i18next.t("validation.enterContentDot") },
              { max: 5000, message: i18next.t("validation.contentMax5000") },
            ]}
          >
            <TextArea rows={6} placeholder={i18next.t("miraForm.enterContent")} maxLength={5000} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default MiraKnowledge;
