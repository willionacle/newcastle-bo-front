import i18next from "@/i18n/i18n";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Card,
  Divider,
  Space,
  Descriptions,
  Input,
  Button,
  Spin,
  notification,
} from "antd";
import type { DescriptionsProps } from "antd";
import { getVrConfigAPI } from "@/api/vr-game/get";
import { updateVrConfig } from "@/api/vr-game/patch";
import commaNumber from "comma-number";

interface formData {
  singleMinBetAmount: string;
  multiMinBetAmount: string;
  singleMaxBetAmount: string;
  multiMaxBetAmount: string;
  singleMaxWinAmount: string;
  multiMaxWinAmount: string;
  singleMaxWinOdds: string;
  multiMaxWinOdds: string;
}

const VrConfig = () => {
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState<formData>({
    singleMinBetAmount: "",
    multiMinBetAmount: "",
    singleMaxBetAmount: "",
    multiMaxBetAmount: "",
    singleMaxWinAmount: "",
    multiMaxWinAmount: "",
    singleMaxWinOdds: "",
    multiMaxWinOdds: "",
  });

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await getVrConfigAPI();
      if (res) {
        setFormData({
          singleMinBetAmount: commaNumber(res.single_min_bet_amount),
          multiMinBetAmount: commaNumber(res.multi_min_bet_amount),
          singleMaxBetAmount: commaNumber(res.single_max_bet_amount),
          multiMaxBetAmount: commaNumber(res.multi_max_bet_amount),
          singleMaxWinAmount: commaNumber(res.single_max_win_amount),
          multiMaxWinAmount: commaNumber(res.multi_max_win_amount),
          singleMaxWinOdds: commaNumber(res.single_max_win_odds),
          multiMaxWinOdds: commaNumber(res.multi_max_win_odds),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const formatNumberWithCommas = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange = (key: keyof typeof formData, value: string) => {
    const formattedValue = formatNumberWithCommas(value);
    setFormData((prev) => ({ ...prev, [key]: formattedValue }));
  };

  const items: DescriptionsProps["items"] = [
    {
      label: i18next.t("sports.singleMinBet"),
      children: (
        <Input
          value={formData.singleMinBetAmount}
          onChange={(e) => handleChange("singleMinBetAmount", e.target.value)}
          addonAfter="원"
        />
      ),
    },
    {
      label: i18next.t("sports.multiMinBet"),
      children: (
        <Input
          value={formData.multiMinBetAmount}
          onChange={(e) => handleChange("multiMinBetAmount", e.target.value)}
          addonAfter="원"
        />
      ),
    },
    {
      label: i18next.t("sports.singleMaxBet"),
      children: (
        <Input
          value={formData.singleMaxBetAmount}
          onChange={(e) => handleChange("singleMaxBetAmount", e.target.value)}
          addonAfter="원"
        />
      ),
    },
    {
      label: i18next.t("sports.multiMaxBet"),
      children: (
        <Input
          value={formData.multiMaxBetAmount}
          onChange={(e) => handleChange("multiMaxBetAmount", e.target.value)}
          addonAfter="원"
        />
      ),
    },
    {
      label: i18next.t("sports.singleMaxWin"),
      children: (
        <Input
          value={formData.singleMaxWinAmount}
          onChange={(e) => handleChange("singleMaxWinAmount", e.target.value)}
          addonAfter="원"
        />
      ),
    },
    {
      label: i18next.t("sports.multiMaxWin"),
      children: (
        <Input
          value={formData.multiMaxWinAmount}
          onChange={(e) => handleChange("multiMaxWinAmount", e.target.value)}
          addonAfter="원"
        />
      ),
    },
    {
      label: i18next.t("sports.singleMaxWinOdds"),
      children: (
        <Input
          value={formData.singleMaxWinOdds}
          onChange={(e) => handleChange("singleMaxWinOdds", e.target.value)}
          addonAfter={i18next.t("unit.times")}
        />
      ),
    },
    {
      label: i18next.t("sports.multiMaxWinOdds"),
      children: (
        <Input
          value={formData.multiMaxWinOdds}
          onChange={(e) => handleChange("multiMaxWinOdds", e.target.value)}
          addonAfter={i18next.t("unit.times")}
        />
      ),
    },
  ];

  const unComma = (val: string) => {
    return val.replace(/,/g, "");
  };

  const updateConfig = async () => {
    setUpdateLoading(true);
    try {
      const res = await updateVrConfig({
        singleMinBetAmount: unComma(formData.singleMinBetAmount),
        multiMinBetAmount: unComma(formData.multiMinBetAmount),
        singleMaxBetAmount: unComma(formData.singleMaxBetAmount),
        multiMaxBetAmount: unComma(formData.multiMaxBetAmount),
        singleMaxWinAmount: unComma(formData.singleMaxWinAmount),
        multiMaxWinAmount: unComma(formData.multiMaxWinAmount),
        singleMaxWinOdds: unComma(formData.singleMaxWinOdds),
        multiMaxWinOdds: unComma(formData.multiMaxWinOdds),
      });

      if (res.status === 200) {
        notification.success({ message: res.data.message });
        fetchConfig();
      } else {
        notification.error({ message: res.data.message });
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={i18next.t("vrCfg.gameSettings")} />
      </Space>
      <Divider />

      <div style={{ marginBottom: "10px", textAlign: "right" }}>
        <Button type="primary" onClick={updateConfig} loading={updateLoading}>
          {i18next.t("sportsScore.save")}
        </Button>
      </div>
      <Spin spinning={loading}>
        <Descriptions bordered column={2} items={items} />
      </Spin>
    </Card>
  );
};

export default VrConfig;
