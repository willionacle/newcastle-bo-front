import i18next from "@/i18n/i18n";
import { Dropdown, Modal, Tag, notification } from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
  SpecialGameStatus,
  updateSpecialGameStatus,
} from "@/api/special-games/patch";
import { SpecialGameData } from "@/api/special-games/get";

interface Props {
  record: SpecialGameData;
  mutate: () => void;
}

const STATUS_META: Record<SpecialGameData["status"], { color: string; labelKey: string }> = {
  draft: { color: "default", labelKey: "specialGames.statusDraft" },
  open: { color: "green", labelKey: "specialGames.statusOpen" },
  closed: { color: "orange", labelKey: "specialGames.statusClosed" },
  settled: { color: "blue", labelKey: "specialGames.statusSettled" },
  cancelled: { color: "red", labelKey: "specialGames.statusCancelled" },
};

// Only draft/open/closed/cancelled are reachable via PATCH .../status —
// "settled" only happens through the settle action (see SettleModal).
const TRANSITIONABLE_STATUSES: SpecialGameStatus[] = ["draft", "open", "closed", "cancelled"];

const StatusActionTag = ({ record, mutate }: Props) => {
  const meta = STATUS_META[record.status];
  // Terminal states — no further status-tag transitions offered.
  const locked = record.status === "settled" || record.status === "cancelled";

  const handleChange = (status: SpecialGameStatus) => {
    Modal.confirm({
      title: i18next.t("specialGames.changeStatus"),
      content: i18next.t("specialGames.changeStatusConfirm"),
      okText: i18next.t("global.confirm"),
      cancelText: i18next.t("global.cancel"),
      onOk: async () => {
        const res = await updateSpecialGameStatus(record.id, status);
        const { code, message } = res.data;

        if (code === 0) {
          notification.success({ message: message || i18next.t("specialGames.statusUpdateSuccess") });
          mutate();
        } else {
          notification.error({ message });
        }
      },
    });
  };

  if (locked) {
    return <Tag color={meta.color}>{i18next.t(meta.labelKey)}</Tag>;
  }

  const items = TRANSITIONABLE_STATUSES.filter((status) => status !== record.status).map(
    (status) => ({
      key: status,
      label: i18next.t(STATUS_META[status].labelKey),
      onClick: () => handleChange(status),
    })
  );

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <Tag color={meta.color} style={{ cursor: "pointer" }}>
        {i18next.t(meta.labelKey)} <DownOutlined style={{ fontSize: 10 }} />
      </Tag>
    </Dropdown>
  );
};

export default StatusActionTag;
