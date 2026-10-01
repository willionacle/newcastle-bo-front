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
import { getSportsConfigAPI } from "@/api/sports-list/get";
import { updateSportsConfig } from "@/api/sports-list/patch";
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
  cancelAfterBetTime: number;
  cancelBeforeStartTime: number;
  cancelDailyCount: number;
  cancelMessage: string;
  singleMinusOdds: number;
  twoMinusOdds: number;
  alertBetAmount: string;
  losePointPercentage: number;
}

const SportsConfig = () => {
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
    cancelAfterBetTime: 0,
    cancelBeforeStartTime: 0,
    cancelDailyCount: 0,
    cancelMessage: "",
    singleMinusOdds: 0,
    twoMinusOdds: 0,
    alertBetAmount: "",
    losePointPercentage: 0,
  });

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await getSportsConfigAPI();
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
          cancelAfterBetTime: res.cancel_after_bet_time,
          cancelBeforeStartTime: res.cancel_before_start_time,
          cancelDailyCount: res.cancel_daily_count,
          cancelMessage: res.cancel_message,
          singleMinusOdds: res.single_minus_odds,
          twoMinusOdds: res.two_minus_odds,
          alertBetAmount: commaNumber(res.alert_bet_amount),
          losePointPercentage: res.lose_point_percentage * 100,
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
    let formattedValue = value;
    if (key !== "singleMinusOdds" && key !== "twoMinusOdds") {
      formattedValue = formatNumberWithCommas(value);
    }

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
    {
      label: i18next.t("sports.cancelAfterBet"),
      children: (
        <Input
          value={formData.cancelAfterBetTime}
          onChange={(e) => handleChange("cancelAfterBetTime", e.target.value)}
          addonAfter={i18next.t("unit.min")}
        />
      ),
    },
    {
      label: i18next.t("sports.cancelBeforeStart"),
      children: (
        <Input
          value={formData.cancelBeforeStartTime}
          onChange={(e) =>
            handleChange("cancelBeforeStartTime", e.target.value)
          }
          addonAfter={i18next.t("unit.min")}
        />
      ),
    },
    {
      label: i18next.t("sports.cancelCountPerDay"),
      children: (
        <Input
          value={formData.cancelDailyCount}
          onChange={(e) => handleChange("cancelDailyCount", e.target.value)}
          addonAfter={i18next.t("unit.round")}
        />
      ),
    },
    {
      label: i18next.t("sports.cancelMessage"),
      children: (
        <Input
          value={formData.cancelMessage}
          onChange={(e) => handleChange("cancelMessage", e.target.value)}
        />
      ),
    },
    {
      label: i18next.t("sports.singleDeductOdds"),
      children: (
        <Input
          value={formData.singleMinusOdds}
          onChange={(e) => handleChange("singleMinusOdds", e.target.value)}
        />
      ),
    },
    {
      label: i18next.t("sports.doubleDeductOdds"),
      children: (
        <Input
          value={formData.twoMinusOdds}
          onChange={(e) => handleChange("twoMinusOdds", e.target.value)}
        />
      ),
    },
    {
      label: i18next.t("sports.adminAlertBet"),
      children: (
        <Input
          value={formData.alertBetAmount}
          onChange={(e) => handleChange("alertBetAmount", e.target.value)}
          addonAfter="원"
        />
      ),
    },
    {
      label: i18next.t("sports.losingPointPct"),
      children: (
        <Input
          value={formData.losePointPercentage}
          onChange={(e) => handleChange("losePointPercentage", e.target.value)}
          addonAfter="%"
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
      const res = await updateSportsConfig({
        singleMinBetAmount: unComma(formData.singleMinBetAmount),
        multiMinBetAmount: unComma(formData.multiMinBetAmount),
        singleMaxBetAmount: unComma(formData.singleMaxBetAmount),
        multiMaxBetAmount: unComma(formData.multiMaxBetAmount),
        singleMaxWinAmount: unComma(formData.singleMaxWinAmount),
        multiMaxWinAmount: unComma(formData.multiMaxWinAmount),
        singleMaxWinOdds: unComma(formData.singleMaxWinOdds),
        multiMaxWinOdds: unComma(formData.multiMaxWinOdds),
        cancelAfterBetTime: formData.cancelAfterBetTime,
        cancelBeforeStartTime: formData.cancelBeforeStartTime,
        cancelDailyCount: formData.cancelDailyCount,
        cancelMessage: formData.cancelMessage,
        singleMinusOdds: formData.singleMinusOdds,
        twoMinusOdds: formData.twoMinusOdds,
        alertBetAmount: unComma(formData.alertBetAmount),
        losePointPercentage: formData.losePointPercentage / 100,
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
        <Breadcrumb replace={i18next.t("sports.gameSettings")} />
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

export default SportsConfig;
