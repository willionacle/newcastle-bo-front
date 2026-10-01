import { useState } from "react";
import i18next from "@/i18n/i18n";
import { Button, Modal, Select, Table, notification } from "antd";
import { TrophyOutlined } from "@ant-design/icons";
import { SpecialGameData } from "@/api/special-games/get";
import { SpecialGameChoiceResult, settleSpecialGame } from "@/api/special-games/patch";

interface Props {
  record: SpecialGameData;
  mutate: () => void;
}

const RESULT_OPTIONS: { value: SpecialGameChoiceResult; labelKey: string }[] = [
  { value: "pending", labelKey: "specialGames.resultPending" },
  { value: "win", labelKey: "specialGames.resultWin" },
  { value: "lose", labelKey: "specialGames.resultLose" },
  { value: "draw", labelKey: "specialGames.resultDraw" },
  { value: "cancelled", labelKey: "specialGames.resultCancelled" },
];

const SettleModal = ({ record, mutate }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<number, SpecialGameChoiceResult>>(() =>
    Object.fromEntries(record.choices.map((c) => [c.id, "lose" as SpecialGameChoiceResult]))
  );

  const openModal = () => {
    setResults(Object.fromEntries(record.choices.map((c) => [c.id, "lose" as SpecialGameChoiceResult])));
    setOpen(true);
  };

  const handleSettle = async () => {
    setLoading(true);
    try {
      const res = await settleSpecialGame(
        record.id,
        record.choices.map((c) => ({ id: c.id, result: results[c.id] }))
      );
      const { code, message, settlement } = res.data;

      if (code === 0) {
        notification.success({
          message: message || i18next.t("specialGames.settleSuccess"),
          description: settlement
            ? `${i18next.t("specialGames.settledBets")}: ${settlement.settledBets} · ${i18next.t(
                "specialGames.winners"
              )}: ${settlement.winners} · ${i18next.t("specialGames.payoutTotal")}: ${settlement.payoutTotal}`
            : undefined,
        });
        setOpen(false);
        mutate();
      } else {
        notification.error({ message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button icon={<TrophyOutlined />} onClick={openModal}>
        {i18next.t("specialGames.settle")}
      </Button>
      <Modal
        title={i18next.t("specialGames.settleTitle")}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSettle}
        confirmLoading={loading}
        okText={i18next.t("specialGames.settle")}
        cancelText={i18next.t("global.cancel")}
        width={520}
      >
        <p>{i18next.t("specialGames.settleConfirm")}</p>
        <Table
          size="small"
          pagination={false}
          rowKey="id"
          dataSource={record.choices}
          columns={[
            { title: i18next.t("specialGames.choiceLabel"), dataIndex: "label" },
            { title: i18next.t("specialGames.odds"), dataIndex: "odds", width: 80 },
            {
              title: i18next.t("col.result"),
              width: 140,
              render: (_, choice) => (
                <Select
                  size="small"
                  style={{ width: "100%" }}
                  value={results[choice.id]}
                  options={RESULT_OPTIONS.map((o) => ({ value: o.value, label: i18next.t(o.labelKey) }))}
                  onChange={(value) => setResults((prev) => ({ ...prev, [choice.id]: value }))}
                />
              ),
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default SettleModal;
