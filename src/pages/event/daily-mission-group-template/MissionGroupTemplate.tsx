import Breadcrumb from "@/components/Breadcrumb";
import DateText from "@/components/DateText";
import DeleteBtn from "@/components/DeleteBtn";
import {
  DailyMissionGroupTemplate,
  getDailyMissionGroupTemplateListAPI,
} from "@/api/daily-mission/template/get";
import {
  deleteDailyMissionGroupTemplateAPI,
  templateErrorMessage,
  updateDailyMissionGroupTemplateAPI,
  TemplateEnvelope,
} from "@/api/daily-mission/template/mutate";
import SaveAsTemplateModal from "@/pages/event/daily-mission-group/components/SaveAsTemplateModal";
import { EditOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Input, Modal, Space, Switch, Table, TableProps, notification } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const MissionGroupTemplate = () => {
  const { t } = useTranslation();
  const { swr } = getDailyMissionGroupTemplateListAPI();
  const rows = swr.data?.data ?? [];

  const [createOpen, setCreateOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<DailyMissionGroupTemplate | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  /** Shared result handling for PATCH / DELETE. Returns true on code 0. */
  const run = async (id: number, call: () => Promise<TemplateEnvelope>) => {
    setBusyId(id);
    try {
      const res = await call();
      if (res?.code === 0) {
        notification.success({ message: res.message || t("global.success"), duration: 1 });
        return true;
      }
      notification.error({ message: res?.message || t("global.fail") });
    } catch (error) {
      notification.error({ message: templateErrorMessage(error, t("global.fail")) });
    } finally {
      setBusyId(null);
    }
    return false;
  };

  const handleToggle = (record: DailyMissionGroupTemplate, checked: boolean) =>
    run(record.id, () => updateDailyMissionGroupTemplateAPI(record.id, { isActive: checked }));

  const handleDelete = (record: DailyMissionGroupTemplate) =>
    run(record.id, () => deleteDailyMissionGroupTemplateAPI(record.id));

  const handleRename = async () => {
    if (!renameTarget) return;
    const name = renameValue.trim();
    if (!name) {
      notification.warning({ message: t("missionTemplate.enterName") });
      return;
    }
    if (await run(renameTarget.id, () => updateDailyMissionGroupTemplateAPI(renameTarget.id, { name }))) {
      setRenameTarget(null);
    }
  };

  const hasCreated = rows.some((r) => r.createdAt);
  const hasUpdated = rows.some((r) => r.updatedAt);

  const columns: TableProps<DailyMissionGroupTemplate>["columns"] = [
    {
      title: "No",
      align: "center",
      width: 70,
      render: (_v, _r, index) => rows.length - index,
    },
    {
      title: t("missionTemplate.name"),
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: t("missionTemplate.itemCount"),
      dataIndex: "itemCount",
      key: "itemCount",
      align: "center",
      width: 120,
    },
    {
      title: t("col.inUse"),
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      width: 120,
      render: (value: boolean, record) => (
        <Switch
          size="small"
          checked={value}
          loading={busyId === record.id}
          onChange={(checked) => handleToggle(record, checked)}
        />
      ),
    },
    {
      title: t("global.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      hidden: !hasCreated,
      render: (value?: string | null) => (value ? <DateText date={value} timeStamp /> : "-"),
    },
    {
      title: t("title.modifiedDate"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      hidden: !hasUpdated,
      render: (value?: string | null) => (value ? <DateText date={value} timeStamp /> : "-"),
    },
    {
      title: t("global.action"),
      key: "action",
      align: "center",
      fixed: "right",
      width: 220,
      render: (_v, record) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setRenameTarget(record);
              setRenameValue(record.name);
            }}
          >
            {t("missionTemplate.rename")}
          </Button>
          <DeleteBtn handleDelete={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={t("missionTemplate.title")} />
        <Button shape="round" icon={<PlusSquareOutlined />} onClick={() => setCreateOpen(true)}>
          {t("missionTemplate.createFromGroup")}
        </Button>
      </Space>

      <Divider />

      <Table
        sticky
        columns={columns}
        dataSource={rows}
        loading={swr.isLoading}
        rowKey="id"
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        tableLayout="auto"
        pagination={false}
      />

      <SaveAsTemplateModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <Modal
        open={!!renameTarget}
        title={t("missionTemplate.rename")}
        onCancel={() => setRenameTarget(null)}
        onOk={handleRename}
        okText={t("global.save")}
        cancelText={t("global.cancel")}
        confirmLoading={!!renameTarget && busyId === renameTarget.id}
        destroyOnClose
      >
        <Input
          value={renameValue}
          maxLength={100}
          placeholder={t("missionTemplate.enterName")}
          onChange={(e) => setRenameValue(e.target.value)}
          onPressEnter={handleRename}
        />
      </Modal>
    </Card>
  );
};

export default MissionGroupTemplate;
