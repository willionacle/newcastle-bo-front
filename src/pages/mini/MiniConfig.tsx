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
  Radio,
} from "antd";
import type { DescriptionsProps } from "antd";
import { getMiniConfigAPI } from "@/api/mini-game/get";
import { updateMiniConfig } from "@/api/mini-game/patch";
import commaNumber from "comma-number";

interface formData {
  minBetAmount: string;
  maxBetAmount: string;
  maxWinAmount: string;
  coinPowerball3CloseTime: number;
  coinPowerball5CloseTime: number;
  coinLadder3CloseTime: number;
  coinLadder5CloseTime: number;
  eosPowerball1CloseTime: number;
  eosPowerball2CloseTime: number;
  eosPowerball3CloseTime: number;
  eosPowerball4CloseTime: number;
  eosPowerball5CloseTime: number;
  coinPowerball3Status: number;
  coinPowerball3CloseMessage: string;
  coinPowerball5Status: number;
  coinPowerball5CloseMessage: string;
  coinLadder3Status: number;
  coinLadder3CloseMessage: string;
  coinLadder5Status: number;
  coinLadder5CloseMessage: string;
  eosPowerball1Status: number;
  eosPowerball1CloseMessage: string;
  eosPowerball2Status: number;
  eosPowerball2CloseMessage: string;
  eosPowerball3Status: number;
  eosPowerball3CloseMessage: string;
  eosPowerball4Status: number;
  eosPowerball4CloseMessage: string;
  eosPowerball5Status: number;
  eosPowerball5CloseMessage: string;
  coinPowerball3MaxBetCount: number;
  coinPowerball5MaxBetCount: number;
  coinLadder3MaxBetCount: number;
  coinLadder5MaxBetCount: number;
  eosPowerball1MaxBetCount: number;
  eosPowerball2MaxBetCount: number;
  eosPowerball3MaxBetCount: number;
  eosPowerball4MaxBetCount: number;
  eosPowerball5MaxBetCount: number;
}

const MiniConfig = () => {
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState<formData>({
    minBetAmount: "0",
    maxBetAmount: "0",
    maxWinAmount: "0",
    coinPowerball3CloseTime: 0,
    coinPowerball5CloseTime: 0,
    coinLadder3CloseTime: 0,
    coinLadder5CloseTime: 0,
    eosPowerball1CloseTime: 0,
    eosPowerball2CloseTime: 0,
    eosPowerball3CloseTime: 0,
    eosPowerball4CloseTime: 0,
    eosPowerball5CloseTime: 0,
    coinPowerball3Status: 0,
    coinPowerball3CloseMessage: "",
    coinPowerball5Status: 0,
    coinPowerball5CloseMessage: "",
    coinLadder3Status: 0,
    coinLadder3CloseMessage: "",
    coinLadder5Status: 0,
    coinLadder5CloseMessage: "",
    eosPowerball1Status: 0,
    eosPowerball1CloseMessage: "",
    eosPowerball2Status: 0,
    eosPowerball2CloseMessage: "",
    eosPowerball3Status: 0,
    eosPowerball3CloseMessage: "",
    eosPowerball4Status: 0,
    eosPowerball4CloseMessage: "",
    eosPowerball5Status: 0,
    eosPowerball5CloseMessage: "",
    coinPowerball3MaxBetCount: 0,
    coinPowerball5MaxBetCount: 0,
    coinLadder3MaxBetCount: 0,
    coinLadder5MaxBetCount: 0,
    eosPowerball1MaxBetCount: 0,
    eosPowerball2MaxBetCount: 0,
    eosPowerball3MaxBetCount: 0,
    eosPowerball4MaxBetCount: 0,
    eosPowerball5MaxBetCount: 0,
  });

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await getMiniConfigAPI();
      if (res) {
        setFormData({
          minBetAmount: commaNumber(res.min_bet_amount),
          maxBetAmount: commaNumber(res.max_bet_amount),
          maxWinAmount: commaNumber(res.max_win_amount),
          coinPowerball3CloseTime: res.coin_powerball_3_close_time,
          coinPowerball5CloseTime: res.coin_powerball_5_close_time,
          coinLadder3CloseTime: res.coin_ladder_3_close_time,
          coinLadder5CloseTime: res.coin_ladder_5_close_time,
          eosPowerball1CloseTime: res.eos_powerball_1_close_time,
          eosPowerball2CloseTime: res.eos_powerball_2_close_time,
          eosPowerball3CloseTime: res.eos_powerball_3_close_time,
          eosPowerball4CloseTime: res.eos_powerball_4_close_time,
          eosPowerball5CloseTime: res.eos_powerball_5_close_time,
          coinPowerball3Status: res.coin_powerball_3_status,
          coinPowerball5Status: res.coin_powerball_5_status,
          coinLadder3Status: res.coin_ladder_3_status,
          coinLadder5Status: res.coin_ladder_5_status,
          eosPowerball1Status: res.eos_powerball_1_status,
          eosPowerball2Status: res.eos_powerball_2_status,
          eosPowerball3Status: res.eos_powerball_3_status,
          eosPowerball4Status: res.eos_powerball_4_status,
          eosPowerball5Status: res.eos_powerball_5_status,
          coinPowerball3CloseMessage: res.coin_powerball_3_close_message,
          coinPowerball5CloseMessage: res.coin_powerball_5_close_message,
          coinLadder3CloseMessage: res.coin_ladder_3_close_message,
          coinLadder5CloseMessage: res.coin_ladder_5_close_message,
          eosPowerball1CloseMessage: res.eos_powerball_1_close_message,
          eosPowerball2CloseMessage: res.eos_powerball_2_close_message,
          eosPowerball3CloseMessage: res.eos_powerball_3_close_message,
          eosPowerball4CloseMessage: res.eos_powerball_4_close_message,
          eosPowerball5CloseMessage: res.eos_powerball_5_close_message,
          coinPowerball3MaxBetCount: res.coin_powerball_3_max_bet_count,
          coinPowerball5MaxBetCount: res.coin_powerball_5_max_bet_count,
          coinLadder3MaxBetCount: res.coin_ladder_3_max_bet_count,
          coinLadder5MaxBetCount: res.coin_ladder_5_max_bet_count,
          eosPowerball1MaxBetCount: res.eos_powerball_1_max_bet_count,
          eosPowerball2MaxBetCount: res.eos_powerball_2_max_bet_count,
          eosPowerball3MaxBetCount: res.eos_powerball_3_max_bet_count,
          eosPowerball4MaxBetCount: res.eos_powerball_4_max_bet_count,
          eosPowerball5MaxBetCount: res.eos_powerball_5_max_bet_count,
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

  const handleChangeStatus = (key: keyof typeof formData, value: number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const items: DescriptionsProps["items"] = [
    {
      label: i18next.t("miniCfg.minBet"),
      children: (
        <Input
          value={formData.minBetAmount}
          onChange={(e) => handleChange("minBetAmount", e.target.value)}
          addonAfter="원"
        />
      ),
    },
    {
      label: i18next.t("miniCfg.maxBet"),
      children: (
        <Input
          value={formData.maxBetAmount}
          onChange={(e) => handleChange("maxBetAmount", e.target.value)}
          addonAfter="원"
        />
      ),
    },
    {
      label: i18next.t("miniCfg.maxWin"),
      children: (
        <Input
          value={formData.maxWinAmount}
          onChange={(e) => handleChange("maxWinAmount", e.target.value)}
          addonAfter="원"
        />
      ),
    },
    {
      label: "",
      children: <div></div>,
    },
    {
      label: i18next.t("miniCfg.CoinPowerBall3minCloseTime"),
      children: (
        <Input
          value={formData.coinPowerball3CloseTime}
          onChange={(e) =>
            handleChange("coinPowerball3CloseTime", e.target.value)
          }
          addonAfter={i18next.t("unit.sec")}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.CoinPowerBall3minMaxBetsrounds"),
      children: (
        <Input
          value={formData.coinPowerball3MaxBetCount}
          onChange={(e) =>
            handleChange("coinPowerball3MaxBetCount", e.target.value)
          }
          addonAfter={i18next.t("unit.round")}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.CoinPowerBall5minCloseTime"),
      children: (
        <Input
          value={formData.coinPowerball5CloseTime}
          onChange={(e) =>
            handleChange("coinPowerball5CloseTime", e.target.value)
          }
          addonAfter={i18next.t("unit.sec")}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.CoinPowerBall5minMaxBetsrounds"),
      children: (
        <Input
          value={formData.coinPowerball5MaxBetCount}
          onChange={(e) =>
            handleChange("coinPowerball5MaxBetCount", e.target.value)
          }
          addonAfter={i18next.t("unit.round")}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.CoinLadder3minCloseTime"),
      children: (
        <Input
          value={formData.coinLadder3CloseTime}
          onChange={(e) => handleChange("coinLadder3CloseTime", e.target.value)}
          addonAfter={i18next.t("unit.sec")}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.CoinLadder3minMaxBetsrounds"),
      children: (
        <Input
          value={formData.coinLadder3MaxBetCount}
          onChange={(e) =>
            handleChange("coinLadder3MaxBetCount", e.target.value)
          }
          addonAfter={i18next.t("unit.round")}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.CoinLadder5minCloseTime"),
      children: (
        <Input
          value={formData.coinLadder5CloseTime}
          onChange={(e) => handleChange("coinLadder5CloseTime", e.target.value)}
          addonAfter={i18next.t("unit.sec")}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.CoinLadder5minMaxBetsrounds"),
      children: (
        <Input
          value={formData.coinLadder5MaxBetCount}
          onChange={(e) =>
            handleChange("coinLadder5MaxBetCount", e.target.value)
          }
          addonAfter={i18next.t("unit.round")}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall1minCloseTime"),
      children: (
        <Input
          value={formData.eosPowerball1CloseTime}
          onChange={(e) =>
            handleChange("eosPowerball1CloseTime", e.target.value)
          }
          addonAfter={i18next.t("unit.sec")}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall1minMaxBetsrounds"),
      children: (
        <Input
          value={formData.eosPowerball1MaxBetCount}
          onChange={(e) =>
            handleChange("eosPowerball1MaxBetCount", e.target.value)
          }
          addonAfter={i18next.t("unit.round")}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall2minCloseTime"),
      children: (
        <Input
          value={formData.eosPowerball2CloseTime}
          onChange={(e) =>
            handleChange("eosPowerball2CloseTime", e.target.value)
          }
          addonAfter={i18next.t("unit.sec")}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall2minMaxBetsrounds"),
      children: (
        <Input
          value={formData.eosPowerball2MaxBetCount}
          onChange={(e) =>
            handleChange("eosPowerball2MaxBetCount", e.target.value)
          }
          addonAfter={i18next.t("unit.round")}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall3minCloseTime"),
      children: (
        <Input
          value={formData.eosPowerball3CloseTime}
          onChange={(e) =>
            handleChange("eosPowerball3CloseTime", e.target.value)
          }
          addonAfter={i18next.t("unit.sec")}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall3minMaxBetsrounds"),
      children: (
        <Input
          value={formData.eosPowerball3MaxBetCount}
          onChange={(e) =>
            handleChange("eosPowerball3MaxBetCount", e.target.value)
          }
          addonAfter={i18next.t("unit.round")}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall4minCloseTime"),
      children: (
        <Input
          value={formData.eosPowerball4CloseTime}
          onChange={(e) =>
            handleChange("eosPowerball4CloseTime", e.target.value)
          }
          addonAfter={i18next.t("unit.sec")}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall4minMaxBetsrounds"),
      children: (
        <Input
          value={formData.eosPowerball4MaxBetCount}
          onChange={(e) =>
            handleChange("eosPowerball4MaxBetCount", e.target.value)
          }
          addonAfter={i18next.t("unit.round")}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall5minCloseTime"),
      children: (
        <Input
          value={formData.eosPowerball5CloseTime}
          onChange={(e) =>
            handleChange("eosPowerball5CloseTime", e.target.value)
          }
          addonAfter={i18next.t("unit.sec")}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall5minMaxBetsrounds"),
      children: (
        <Input
          value={formData.eosPowerball5MaxBetCount}
          onChange={(e) =>
            handleChange("eosPowerball5MaxBetCount", e.target.value)
          }
          addonAfter={i18next.t("unit.round")}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.CoinPowerBall3minUsage"),
      children: (
        <Radio.Group
          name="coinpowerball3radiogroup"
          value={formData.coinPowerball3Status}
          onChange={(e) =>
            handleChangeStatus("coinPowerball3Status", e.target.value)
          }
          options={[
            { value: 1, label: i18next.t("status.use") },
            { value: 0, label: i18next.t("status.unused") },
          ]}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.CoinPowerBall3minMaintenanceMessage"),
      children: (
        <Input
          value={formData.coinPowerball3CloseMessage}
          onChange={(e) =>
            handleChange("coinPowerball3CloseMessage", e.target.value)
          }
        />
      ),
    },
    {
      label: i18next.t("miniCfg.CoinPowerBall5minUsage"),
      children: (
        <Radio.Group
          name="coinpowerball5radiogroup"
          value={formData.coinPowerball5Status}
          onChange={(e) =>
            handleChangeStatus("coinPowerball5Status", e.target.value)
          }
          options={[
            { value: 1, label: i18next.t("status.use") },
            { value: 0, label: i18next.t("status.unused") },
          ]}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.CoinPowerBall5minMaintenanceMessage"),
      children: (
        <Input
          value={formData.coinPowerball5CloseMessage}
          onChange={(e) =>
            handleChange("coinPowerball5CloseMessage", e.target.value)
          }
        />
      ),
    },
    {
      label: i18next.t("miniCfg.CoinLadder3minUsage"),
      children: (
        <Radio.Group
          name="coinladder3radiogroup"
          value={formData.coinLadder3Status}
          onChange={(e) =>
            handleChangeStatus("coinLadder3Status", e.target.value)
          }
          options={[
            { value: 1, label: i18next.t("status.use") },
            { value: 0, label: i18next.t("status.unused") },
          ]}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.CoinLadder3minMaintenanceMessage"),
      children: (
        <Input
          value={formData.coinLadder3CloseMessage}
          onChange={(e) =>
            handleChange("coinLadder3CloseMessage", e.target.value)
          }
        />
      ),
    },
    {
      label: i18next.t("miniCfg.CoinLadder5minUsage"),
      children: (
        <Radio.Group
          name="coinladder5radiogroup"
          value={formData.coinLadder5Status}
          onChange={(e) =>
            handleChangeStatus("coinLadder5Status", e.target.value)
          }
          options={[
            { value: 1, label: i18next.t("status.use") },
            { value: 0, label: i18next.t("status.unused") },
          ]}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.CoinLadder5minMaintenanceMessage"),
      children: (
        <Input
          value={formData.coinLadder5CloseMessage}
          onChange={(e) =>
            handleChange("coinLadder5CloseMessage", e.target.value)
          }
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall1minUsage"),
      children: (
        <Radio.Group
          name="eospowerball1radiogroup"
          value={formData.eosPowerball1Status}
          onChange={(e) =>
            handleChangeStatus("eosPowerball1Status", e.target.value)
          }
          options={[
            { value: 1, label: i18next.t("status.use") },
            { value: 0, label: i18next.t("status.unused") },
          ]}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall1minMaintenanceMessage"),
      children: (
        <Input
          value={formData.eosPowerball1CloseMessage}
          onChange={(e) =>
            handleChange("eosPowerball1CloseMessage", e.target.value)
          }
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall2minUsage"),
      children: (
        <Radio.Group
          name="eospowerball2radiogroup"
          value={formData.eosPowerball2Status}
          onChange={(e) =>
            handleChangeStatus("eosPowerball2Status", e.target.value)
          }
          options={[
            { value: 1, label: i18next.t("status.use") },
            { value: 0, label: i18next.t("status.unused") },
          ]}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall2minMaintenanceMessage"),
      children: (
        <Input
          value={formData.eosPowerball2CloseMessage}
          onChange={(e) =>
            handleChange("eosPowerball2CloseMessage", e.target.value)
          }
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall3minUsage"),
      children: (
        <Radio.Group
          name="eospowerball3radiogroup"
          value={formData.eosPowerball3Status}
          onChange={(e) =>
            handleChangeStatus("eosPowerball3Status", e.target.value)
          }
          options={[
            { value: 1, label: i18next.t("status.use") },
            { value: 0, label: i18next.t("status.unused") },
          ]}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall3minMaintenanceMessage"),
      children: (
        <Input
          value={formData.eosPowerball3CloseMessage}
          onChange={(e) =>
            handleChange("eosPowerball3CloseMessage", e.target.value)
          }
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall4minUsage"),
      children: (
        <Radio.Group
          name="eospowerball4radiogroup"
          value={formData.eosPowerball4Status}
          onChange={(e) =>
            handleChangeStatus("eosPowerball4Status", e.target.value)
          }
          options={[
            { value: 1, label: i18next.t("status.use") },
            { value: 0, label: i18next.t("status.unused") },
          ]}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall4minMaintenanceMessage"),
      children: (
        <Input
          value={formData.eosPowerball4CloseMessage}
          onChange={(e) =>
            handleChange("eosPowerball4CloseMessage", e.target.value)
          }
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall5minUsage"),
      children: (
        <Radio.Group
          name="eospowerball5radiogroup"
          value={formData.eosPowerball5Status}
          onChange={(e) =>
            handleChangeStatus("eosPowerball5Status", e.target.value)
          }
          options={[
            { value: 1, label: i18next.t("status.use") },
            { value: 0, label: i18next.t("status.unused") },
          ]}
        />
      ),
    },
    {
      label: i18next.t("miniCfg.EOSPowerBall5minMaintenanceMessage"),
      children: (
        <Input
          value={formData.eosPowerball5CloseMessage}
          onChange={(e) =>
            handleChange("eosPowerball5CloseMessage", e.target.value)
          }
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
      const res = await updateMiniConfig({
        minBetAmount: unComma(formData.minBetAmount),
        maxBetAmount: unComma(formData.maxBetAmount),
        maxWinAmount: unComma(formData.maxWinAmount),
        coinPowerball3CloseTime: formData.coinPowerball3CloseTime,
        coinPowerball5CloseTime: formData.coinPowerball5CloseTime,
        coinLadder3CloseTime: formData.coinLadder3CloseTime,
        coinLadder5CloseTime: formData.coinLadder5CloseTime,
        eosPowerball1CloseTime: formData.eosPowerball1CloseTime,
        eosPowerball2CloseTime: formData.eosPowerball2CloseTime,
        eosPowerball3CloseTime: formData.eosPowerball3CloseTime,
        eosPowerball4CloseTime: formData.eosPowerball4CloseTime,
        eosPowerball5CloseTime: formData.eosPowerball5CloseTime,
        coinPowerball3Status: formData.coinPowerball3Status,
        coinPowerball5Status: formData.coinPowerball5Status,
        coinLadder3Status: formData.coinLadder3Status,
        coinLadder5Status: formData.coinLadder5Status,
        eosPowerball1Status: formData.eosPowerball1Status,
        eosPowerball2Status: formData.eosPowerball2Status,
        eosPowerball3Status: formData.eosPowerball3Status,
        eosPowerball4Status: formData.eosPowerball4Status,
        eosPowerball5Status: formData.eosPowerball5Status,
        coinPowerball3CloseMessage: formData.coinPowerball3CloseMessage,
        coinPowerball5CloseMessage: formData.coinPowerball5CloseMessage,
        coinLadder3CloseMessage: formData.coinLadder3CloseMessage,
        coinLadder5CloseMessage: formData.coinLadder5CloseMessage,
        eosPowerball1CloseMessage: formData.eosPowerball1CloseMessage,
        eosPowerball2CloseMessage: formData.eosPowerball2CloseMessage,
        eosPowerball3CloseMessage: formData.eosPowerball3CloseMessage,
        eosPowerball4CloseMessage: formData.eosPowerball4CloseMessage,
        eosPowerball5CloseMessage: formData.eosPowerball5CloseMessage,
        coinPowerball3MaxBetCount: formData.coinPowerball3MaxBetCount,
        coinPowerball5MaxBetCount: formData.coinPowerball5MaxBetCount,
        coinLadder3MaxBetCount: formData.coinLadder3MaxBetCount,
        coinLadder5MaxBetCount: formData.coinLadder5MaxBetCount,
        eosPowerball1MaxBetCount: formData.eosPowerball1MaxBetCount,
        eosPowerball2MaxBetCount: formData.eosPowerball2MaxBetCount,
        eosPowerball3MaxBetCount: formData.eosPowerball3MaxBetCount,
        eosPowerball4MaxBetCount: formData.eosPowerball4MaxBetCount,
        eosPowerball5MaxBetCount: formData.eosPowerball5MaxBetCount,
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
        <Breadcrumb replace={i18next.t("miniCfg.gameSettings")} />
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

export default MiniConfig;
