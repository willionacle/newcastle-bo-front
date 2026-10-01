import i18next from "@/i18n/i18n";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Card,
  Divider,
  Space,
  Input,
  Button,
  Spin,
  notification,
  Radio,
} from "antd";
import { getSportsRateConfigAPI } from "@/api/sports-list/get";
import { updateSportsRateConfigAPI } from "@/api/sports-list/patch";

interface formData {
  id: number;
  sports_name: string;
  sports_name_kr: string;
  normal_winlose_rate: number;
  normal_winlose_sum: number;
  normal_winlose_status: number;
  normal_handicap_rate: number;
  normal_handicap_sum: number;
  normal_handicap_status: number;
  normal_underover_rate: number;
  normal_underover_sum: number;
  normal_underover_status: number;
  special_winlose_rate: number;
  special_winlose_sum: number;
  special_winlose_status: number;
  special_handicap_rate: number;
  special_handicap_sum: number;
  special_handicap_status: number;
  special_underover_rate: number;
  special_underover_sum: number;
  special_underover_status: number;
  inplay_winlose_rate: number;
  inplay_winlose_sum: number;
  inplay_winlose_status: number;
  inplay_handicap_rate: number;
  inplay_handicap_sum: number;
  inplay_handicap_status: number;
  inplay_underover_rate: number;
  inplay_underover_sum: number;
  inplay_underover_status: number;
}

const SportsRateConfig = () => {
  const [data, setData] = useState<formData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await getSportsRateConfigAPI();

      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleChange = (
    rowIndex: number,
    field: string,
    value: string | number
  ) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [field]: value,
      };
      return newData;
    });
  };

  const updateConfig = async (item: formData) => {
    try {
      setLoading(true);

      const res = await updateSportsRateConfigAPI({
        id: item.id,
        normalWinloseRate: item.normal_winlose_rate,
        normalWinloseSum: item.normal_winlose_sum,
        normalWinloseStatus: item.normal_winlose_status,
        normalHandicapRate: item.normal_handicap_rate,
        normalHandicapSum: item.normal_handicap_sum,
        normalHandicapStatus: item.normal_handicap_status,
        normalUnderoverRate: item.normal_underover_rate,
        normalUnderoverSum: item.normal_underover_sum,
        normalUnderoverStatus: item.normal_underover_status,
        specialWinloseRate: item.special_winlose_rate,
        specialWinloseSum: item.special_winlose_sum,
        specialWinloseStatus: item.special_winlose_status,
        specialHandicapRate: item.special_handicap_rate,
        specialHandicapSum: item.special_handicap_sum,
        specialHandicapStatus: item.special_handicap_status,
        specialUnderoverRate: item.special_underover_rate,
        specialUnderoverSum: item.special_underover_sum,
        specialUnderoverStatus: item.special_underover_status,
        inplayWinloseRate: item.inplay_winlose_rate,
        inplayWinloseSum: item.inplay_winlose_sum,
        inplayWinloseStatus: item.inplay_winlose_status,
        inplayHandicapRate: item.inplay_handicap_rate,
        inplayHandicapSum: item.inplay_handicap_sum,
        inplayHandicapStatus: item.inplay_handicap_status,
        inplayUnderoverRate: item.inplay_underover_rate,
        inplayUnderoverSum: item.inplay_underover_sum,
        inplayUnderoverStatus: item.inplay_underover_status,
      });

      if (res.status === 200) {
        notification.success({ message: res.data.message });
        fetchList();
      } else {
        notification.error({ message: res.data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={i18next.t("sports.rateSettings")} />
      </Space>
      <Divider />
      <Spin spinning={loading}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ddd",
          }}
        >
          <thead>
            <tr>
              <td
                rowSpan={3}
                style={{ textAlign: "center", border: "1px solid #ddd" }}
              >
                {i18next.t("col.sport")}
              </td>
              <td
                colSpan={9}
                style={{ textAlign: "center", border: "1px solid #ddd" }}
              >
                일반/조합
              </td>
              <td
                colSpan={9}
                style={{ textAlign: "center", border: "1px solid #ddd" }}
              >
                {i18next.t("title.special")}
              </td>
              <td
                colSpan={9}
                style={{ textAlign: "center", border: "1px solid #ddd" }}
              >
                {i18next.t("title.live")}
              </td>
              <td rowSpan={2} style={{ border: "1px solid #ddd" }}></td>
            </tr>
            <tr>
              {[
                "승무패",
                "핸디캡",
                "언오버",
                "승무패",
                "핸디캡",
                "언오버",
                "승무패",
                "핸디캡",
                "언오버",
              ].map((label, i) => (
                <td
                  key={i}
                  colSpan={3}
                  style={{
                    textAlign: "center",
                    border: "1px solid #ddd",
                    backgroundColor: "#eee",
                  }}
                >
                  {label}
                </td>
              ))}
            </tr>
            <tr>
              {Array.from({ length: 27 }).map((_, i) => (
                <td
                  key={i}
                  style={{
                    textAlign: "center",
                    backgroundColor: "#d7e3ff",
                    border: "1px solid #ddd",
                  }}
                >
                  {["환수율", "합계", "기준"][i % 3]}
                </td>
              ))}
              <td
                style={{
                  textAlign: "center",
                  border: "1px solid #ddd",
                }}
              >
                {i18next.t("sportsBet.edit")}
              </td>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const types = ["normal", "special", "inplay"] as const;
              const metrics = ["winlose", "handicap", "underover"] as const;

              return (
                <tr key={index}>
                  <td
                    style={{
                      textAlign: "center",
                      backgroundColor: "#d7e3ff",
                      border: "1px solid #ddd",
                    }}
                  >
                    {item.sports_name_kr}
                  </td>

                  {types.map((type) =>
                    metrics.map((metric) => (
                      <React.Fragment key={`${type}-${metric}`}>
                        <td
                          style={{
                            textAlign: "center",
                            border: "1px solid #ddd",
                          }}
                        >
                          <Input
                            size="small"
                            value={item[`${type}_${metric}_rate`]}
                            style={{ width: 40, textAlign: "center" }}
                            onChange={(e) =>
                              handleChange(
                                index,
                                `${type}_${metric}_rate`,
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            border: "1px solid #ddd",
                          }}
                        >
                          <Input
                            size="small"
                            value={item[`${type}_${metric}_sum`]}
                            style={{ width: 40, textAlign: "center" }}
                            onChange={(e) =>
                              handleChange(
                                index,
                                `${type}_${metric}_sum`,
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td
                          style={{
                            textAlign: "center",
                            border: "1px solid #ddd",
                          }}
                        >
                          <Radio.Group
                            name={`${type}${metric}radiogroup-${index}`}
                            value={item[`${type}_${metric}_status`]}
                            onChange={(e) =>
                              handleChange(
                                index,
                                `${type}_${metric}_status`,
                                e.target.value
                              )
                            }
                            options={[
                              { value: 1, label: i18next.t("sports.ratio") },
                              { value: 0, label: i18next.t("sports.same") },
                            ]}
                          />
                        </td>
                      </React.Fragment>
                    ))
                  )}

                  <td>
                    <Button size="small" onClick={() => updateConfig(item)}>
                      {i18next.t("sportsBet.edit")}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Spin>
    </Card>
  );
};

export default SportsRateConfig;
