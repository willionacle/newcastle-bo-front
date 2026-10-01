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
import { getVrRateConfigAPI } from "@/api/vr-game/get";
import { updateVrRateConfigAPI } from "@/api/vr-game/patch";

interface formData {
  id: number;
  vr_sports_config: { sports_name: string; sports_name_kr: string };
  winlose_rate: number;
  winlose_sum: number;
  winlose_status: number;
  handicap_rate: number;
  handicap_sum: number;
  handicap_status: number;
  underover_rate: number;
  underover_sum: number;
  underover_status: number;
}

const VrRateConfig = () => {
  const [data, setData] = useState<formData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await getVrRateConfigAPI();

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

      const res = await updateVrRateConfigAPI({
        id: item.id,
        winloseRate: item.winlose_rate,
        winloseSum: item.winlose_sum,
        winloseStatus: item.winlose_status,
        handicapRate: item.handicap_rate,
        handicapSum: item.handicap_sum,
        handicapStatus: item.handicap_status,
        underoverRate: item.underover_rate,
        underoverSum: item.underover_sum,
        underoverStatus: item.underover_status,
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
        <Breadcrumb replace={i18next.t("vrCfg.rateSettings")} />
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
              <td rowSpan={2} style={{ border: "1px solid #ddd" }}></td>
            </tr>
            <tr>
              {["승무패", "핸디캡", "언오버"].map((label, i) => (
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
              {Array.from({ length: 9 }).map((_, i) => (
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
                    {item.vr_sports_config.sports_name_kr}
                  </td>

                  {metrics.map((metric) => (
                    <React.Fragment key={`${metric}`}>
                      <td
                        style={{
                          textAlign: "center",
                          border: "1px solid #ddd",
                        }}
                      >
                        <Input
                          size="small"
                          value={item[`${metric}_rate`]}
                          style={{ width: 80, textAlign: "center" }}
                          onChange={(e) =>
                            handleChange(
                              index,
                              `${metric}_rate`,
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
                          value={item[`${metric}_sum`]}
                          style={{ width: 80, textAlign: "center" }}
                          onChange={(e) =>
                            handleChange(index, `${metric}_sum`, e.target.value)
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
                          name={`${metric}radiogroup-${index}`}
                          value={item[`${metric}_status`]}
                          onChange={(e) =>
                            handleChange(
                              index,
                              `${metric}_status`,
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
                  ))}

                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #ddd",
                    }}
                  >
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

export default VrRateConfig;
