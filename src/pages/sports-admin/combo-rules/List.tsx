import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Divider, Table, Switch, Tag, Space, Button, notification, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import Breadcrumb from "@/components/Breadcrumb";
import {
  getComboRulesAPI,
  ComboRule,
  ComboRulePair,
  ComboRulesData,
} from "@/api/sports-admin/get";
import { saveComboRuleAPI } from "@/api/sports-admin/put";
import { deleteComboRuleAPI } from "@/api/sports-admin/delete";

const ALL_SPORTS = "*";

const MARKET_LABEL_I18N: Record<string, string> = {
  win: "sportsAdmin.marketWin",
  handicap: "sportsAdmin.marketHandicap",
  overunder: "sportsAdmin.marketOverunder",
};

const marketLabel = (t: (key: string) => string, market: string) =>
  MARKET_LABEL_I18N[market] ? t(MARKET_LABEL_I18N[market]) : market;

const pairLabel = (t: (key: string) => string, pair: ComboRulePair) =>
  `${marketLabel(t, pair.marketA)} + ${marketLabel(t, pair.marketB)}`;

interface Row {
  sport: string;
  label: string;
  games?: number;
}

const SportsAdminComboRulesList = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<ComboRulesData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getComboRulesAPI();
      setData(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) {
    return (
      <Card>
        <Breadcrumb replace={t("sportsAdmin.comboRulesMenu")} />
        <Divider />
        <Spin spinning={loading} />
      </Card>
    );
  }

  // Resolution order: the sport's own rule → the "*" rule → allowed (implicit).
  const findRule = (sport: string, pair: ComboRulePair): ComboRule | undefined =>
    data.rules.find(
      (r) =>
        r.sport === sport &&
        ((r.marketA === pair.marketA && r.marketB === pair.marketB) ||
          (r.marketA === pair.marketB && r.marketB === pair.marketA))
    );

  const toggle = async (sport: string, pair: ComboRulePair, allowed: boolean) => {
    try {
      const res = await saveComboRuleAPI({
        sport: sport === ALL_SPORTS ? undefined : sport,
        marketA: pair.marketA,
        marketB: pair.marketB,
        allowed,
      });
      if (res.data.code === 0) {
        notification.success({ message: res.data.message || t("toast.common.updateSuccess") });
        fetchData();
      } else {
        notification.error({ message: res.data.message });
      }
    } catch {
      notification.error({ message: t("toast.common.updateFailed") });
    }
  };

  const resetToInherited = async (rule: ComboRule) => {
    try {
      const res = await deleteComboRuleAPI(rule.id);
      if (res.data.code === 0) {
        notification.success({ message: res.data.message || t("toast.common.updateSuccess") });
        fetchData();
      } else {
        notification.error({ message: res.data.message });
      }
    } catch {
      notification.error({ message: t("toast.common.updateFailed") });
    }
  };

  const rows: Row[] = [
    { sport: ALL_SPORTS, label: t("sportsAdmin.allSports") },
    ...data.sports.map((s) => ({ sport: s.sport, label: s.sport, games: s.games })),
  ];

  const columns: ColumnsType<Row> = [
    {
      title: t("sportsAdmin.sportColumn"),
      dataIndex: "label",
      fixed: "left",
      width: 160,
      render: (_, row) =>
        row.sport === ALL_SPORTS ? (
          <b>{row.label}</b>
        ) : (
          <span>
            {row.label} <span style={{ color: "#999" }}>({row.games})</span>
          </span>
        ),
    },
    ...data.pairs.map((pair) => ({
      title: pairLabel(t, pair),
      key: `${pair.marketA}-${pair.marketB}`,
      align: "center" as const,
      render: (_: unknown, row: Row) => {
        const ownRule = row.sport !== ALL_SPORTS ? findRule(row.sport, pair) : undefined;
        const wildcardRule = findRule(ALL_SPORTS, pair);
        const effective = ownRule ?? wildcardRule;
        const allowed = effective?.allowed ?? true;
        const inherited = row.sport !== ALL_SPORTS && !ownRule;

        return (
          <Space direction="vertical" size={0} style={{ alignItems: "center" }}>
            <Switch
              checked={allowed}
              onChange={(val) => toggle(row.sport, pair, val)}
              checkedChildren={t("sportsAdmin.allowed")}
              unCheckedChildren={t("sportsAdmin.blocked")}
            />
            {inherited && (
              <Tag style={{ marginTop: 4 }} color="default">
                {t("sportsAdmin.inheritedFromAll")}
              </Tag>
            )}
            {ownRule && row.sport !== ALL_SPORTS && (
              <Button size="small" type="link" onClick={() => resetToInherited(ownRule)}>
                {t("sportsAdmin.resetToInherited")}
              </Button>
            )}
          </Space>
        );
      },
    })),
  ];

  return (
    <Card>
      <Breadcrumb replace={t("sportsAdmin.comboRulesMenu")} />
      <Divider />
      <Table
        rowKey="sport"
        size="small"
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={false}
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      />
    </Card>
  );
};

export default SportsAdminComboRulesList;
