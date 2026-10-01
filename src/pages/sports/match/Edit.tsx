import { useEffect, useState } from "react";
import i18next from "@/i18n/i18n";
import { useParams } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Card,
  Divider,
  Space,
  notification,
  Input,
  Radio,
  Descriptions,
  Select,
  Spin,
  Table,
  Button,
  Form,
  Col,
  Row,
  Popconfirm,
} from "antd";
import {
  getSportsMatchViewAPI,
  getSportsMarketListAPI,
} from "@/api/sports-list/get";
import {
  updateSportsMatchAPI,
  updateSportsOddsAPI,
  updateSportsResultPerMarketAPI,
  updateSportsResultPerMarketScoreAPI,
} from "@/api/sports-list/patch";
import { createSportsOddsAPI } from "@/api/sports-list/post";
import SaveBtn from "@/components/SaveBtn";
import type { DescriptionsProps } from "antd";
import dayjs from "dayjs";
import SportsOptions from "../SportsOptions.json";
import commaNumber from "comma-number";
import SportsScoreDetailModal from "@/components/SportsScoreDetailModal";
import { ColumnsType } from "antd/es/table";

interface FormData {
  market: {
    value: number;
    label: string;
  };
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
}

interface marketOption {
  label: string;
  value: number;
}

const SportsMatchEdit = () => {
  const [form] = Form.useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [matchData, setMatchData] = useState<any>({});
  const [isAuto, setIsAuto] = useState(1);
  const [oddsData, setOddsData] = useState<any>([]);
  const { id } = useParams();
  const [isOpenScore, setIsOpenScore] = useState(false);
  const [marketOptions, setMarketOptions] = useState<marketOption[]>([]);

  const fetchView = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const res = await getSportsMatchViewAPI(id);

      if (res) {
        setMatchData({
          id: res.id,
          match_id: res.match_id,
          sports_name: res.sports_name,
          sports_name_kr: res.sports_name_kr,
          country_kr: res.country_kr,
          country_image: res.country_image,
          league_name: res.league_name,
          league_image: res.league_image,
          home_name: res.home_name,
          home_image: res.home_image,
          away_name: res.away_name,
          away_image: res.away_image,
          period: {
            label: res.period_kr || i18next.t("sports.unknown"),
            value: res.period_id,
          },
          status: { label: res.status_kr, value: res.status_id },
          status_kr: res.status_kr,
          period_kr: res.period_kr,
          start_datetime: res.start_datetime,
          is_inplay_delete: res.is_inplay_delete,
          is_inplay_ing: res.is_inplay_ing,
          is_inplay_stop: res.is_inplay_stop,
          score: res.score,
          is_result: res.is_result,
          resulted_at: res.resulted_at,
          deleted_at: res.deleted_at,
          is_delete: {
            label: res.is_delete ? i18next.t("status.notDisplayed") : i18next.t("userGameSettings.shown"),
            value: res.is_delete,
          },
          bet_amount: res.bet_amount,
          win_amount: res.win_amount,
        });

        setIsAuto(res.is_auto);
        setOddsData(res.sports_odds);

        fetchMarketList();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchView();
  }, []);

  const fetchMarketList = async () => {
    setMarketOptions([]);

    const res = await getSportsMarketListAPI({
      page: 1,
      size: 999,
      sportsName: matchData.sports_name,
    });

    res.data.forEach((x: any) => {
      setMarketOptions((prev) => {
        return [...prev, { label: x.name, value: x.market_id }];
      });
    });
  };

  const periodOptionMap: Record<string, any[]> = {
    soccer: SportsOptions.soccerPeriodOptions,
    baseball: SportsOptions.baseballPeriodOptions,
    basketball: SportsOptions.basketballPeriodOptions,
    icehockey: SportsOptions.icehockeyPeriodOptions,
    volleyball: SportsOptions.volleyballPeriodOptions,
    tennis: SportsOptions.tennisPeriodOptions,
    americanfootball: SportsOptions.americanfootballPeriodOptions,
    esports: SportsOptions.esportsPeriodOptions,
  };

  const getPeriodOptions = () => periodOptionMap[matchData.sports_name] || [];

  const renderEditableText = (field: string) =>
    isAuto ? (
      <span>{matchData[field]}</span>
    ) : (
      <Input
        defaultValue={matchData[field]}
        onChange={(e) =>
          setMatchData({ ...matchData, [field]: e.target.value })
        }
      />
    );

  const getScore = () => {
    if (!matchData.score) return;
    const parseScore = JSON.parse(matchData.score);

    let homeScore;
    let awayScore;

    if (parseScore.home.score_set) {
      homeScore = parseScore.home.score_set;
      awayScore = parseScore.away.score_set;
    } else if (parseScore.home.score) {
      homeScore = parseScore.home.score;
      awayScore = parseScore.away.score;
    }

    if (homeScore && awayScore) {
      return `${homeScore} : ${awayScore}`;
    } else {
      return i18next.t("status.none");
    }
  };

  const items: DescriptionsProps["items"] = [
    {
      label: i18next.t("sportsBet.matchTime"),
      children: isAuto ? (
        <span>
          {dayjs.utc(matchData.start_datetime).format("YYYY-MM-DD HH:mm:ss")}
        </span>
      ) : (
        <Input
          defaultValue={dayjs
            .utc(matchData.start_datetime)
            .format("YYYY-MM-DD HH:mm:ss")}
          onChange={(e) =>
            setMatchData({ ...matchData, start_datetime: e.target.value })
          }
        />
      ),
    },
    {
      label: i18next.t("col.sport"),
      children: <span>{matchData.sports_name_kr}</span>,
    },
    {
      label: i18next.t("title.matchStatus"),
      children: isAuto ? (
        <span>{matchData.status_kr}</span>
      ) : (
        <Select
          labelInValue
          options={SportsOptions.matchStatusOptions}
          value={matchData.status}
          style={{ width: "100%" }}
          onChange={(val) =>
            setMatchData({
              ...matchData,
              status: { label: val.label, value: val.value },
            })
          }
        />
      ),
    },
    {
      label: i18next.t("title.periodTitle"),
      children:
        isAuto ||
        ["boxingufc", "tabletennis", "handball"].includes(
          matchData.sports_name
        ) ? (
          <span>{matchData.period_kr || i18next.t("sports.unknown")}</span>
        ) : (
          <Select
            labelInValue
            options={getPeriodOptions()}
            value={matchData.period}
            style={{ width: "100%" }}
            onChange={(val) =>
              setMatchData({
                ...matchData,
                period: { label: val.label, value: val.value },
              })
            }
          />
        ),
    },
    {
      label: i18next.t("title.country"),
      children: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
          }}
        >
          {matchData.country_image && (
            <img src={matchData.country_image} style={{ width: 24 }} />
          )}

          {renderEditableText("country_kr")}
        </div>
      ),
    },
    {
      label: i18next.t("col.league"),
      children: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
          }}
        >
          {matchData.league_image && (
            <img src={matchData.league_image} style={{ width: 24 }} />
          )}
          {renderEditableText("league_name")}
        </div>
      ),
    },
    {
      label: i18next.t("col.home"),
      children: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
          }}
        >
          {matchData.home_image && (
            <img src={matchData.home_image} style={{ width: 24 }} />
          )}
          {renderEditableText("home_name")}
        </div>
      ),
    },
    {
      label: i18next.t("col.away"),
      children: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
          }}
        >
          {matchData.away_image && (
            <img src={matchData.away_image} style={{ width: 24 }} />
          )}
          {renderEditableText("away_name")}
        </div>
      ),
    },
    {
      label: i18next.t("title.displayStatus"),
      children: (
        <Select
          labelInValue
          options={SportsOptions.deleteOptions}
          value={matchData.is_delete}
          style={{ width: "100%" }}
          onChange={(val) =>
            setMatchData({
              ...matchData,
              is_delete: { label: val.label, value: val.value },
            })
          }
        />
      ),
    },
    {
      label: i18next.t("sports.betAmount"),
      children: <span>{commaNumber(matchData.bet_amount)}</span>,
    },
    {
      label: i18next.t("col.winningAmount"),
      children: <span>{commaNumber(matchData.win_amount)}</span>,
    },
    {
      label: i18next.t("sports.score"),
      children: <a onClick={() => setIsOpenScore(true)}>{getScore()}</a>,
    },
    {
      label: i18next.t("title.resultProcessing"),
      children: <span>{matchData.is_result ? i18next.t("global.complete") : i18next.t("sports.beforeProcessing")}</span>,
    },
    {
      label: i18next.t("sports.resultProcessTime"),
      children: (
        <span>
          {matchData.resulted_at &&
            dayjs.utc(matchData.resulted_at).format("YYYY-MM-DD HH:mm:ss")}
        </span>
      ),
    },
    {
      label: i18next.t("sports.liveSuspend"),
      children: <span>{matchData.is_inplay_stop ? i18next.t("status.suspended") : i18next.t("adminLog.adl004")}</span>,
    },
    {
      label: i18next.t("sports.liveDelete"),
      children: <span>{matchData.is_inplay_delete ? i18next.t("global.delete") : i18next.t("adminLog.adl004")}</span>,
    },
  ];

  const updateMatch = async () => {
    try {
      setUpdateLoading(true);

      const formData = {
        id,
        isAuto,
        startTime: dayjs
          .utc(matchData.start_datetime)
          .format("YYYY-MM-DD HH:mm:ss"),
        status: matchData.status.value,
        period: matchData.period.value,
        countryKr: matchData.country_kr,
        leagueName: matchData.league_name,
        homeName: matchData.home_name,
        awayName: matchData.away_name,
        isDelete: matchData.is_delete.value,
      };

      const res = await updateSportsMatchAPI(formData);

      if (res.status === 200) {
        notification.success({ message: res.data.message });
        fetchView();
      } else {
        notification.error({ message: res.data.message });
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const updateOdds = async (id: number) => {
    try {
      setLoading(true);

      const findOdds = oddsData.find((x: any) => x.id === id);

      const formData = {
        id: findOdds.id,
        isAuto: findOdds.is_auto,
        homeOdds: findOdds.home_odds,
        drawOdds: findOdds.draw_odds,
        awayOdds: findOdds.away_odds,
        isMarketStop: findOdds.is_market_stop,
        isOddsStop: findOdds.is_odds_stop,
        isHomeStop: findOdds.is_home_stop,
        isDrawStop: findOdds.is_draw_stop,
        isAwayStop: findOdds.is_away_stop,
        isDelete: findOdds.is_delete,
      };

      const res = await updateSportsOddsAPI(formData);

      if (res.status === 200) {
        notification.success({ message: res.data.message });
        fetchView();
      } else {
        notification.error({ message: res.data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateResultPerMarket = async (oddsKey: string, status: number) => {
    try {
      setLoading(true);

      const formData = {
        oddsKey,
        status,
      };

      const res = await updateSportsResultPerMarketAPI(formData);

      if (res.status === 200) {
        notification.success({ message: res.data.message });
        fetchView();
      } else {
        notification.error({ message: res.data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateResultPerMarketScore = async (oddsKey: string) => {
    try {
      setLoading(true);

      const findOdds = oddsData.find((x: any) => x.odds_key === oddsKey);

      const formData = {
        oddsKey,
        homeScore: findOdds.home_score,
        awayScore: findOdds.away_score,
      };

      const res = await updateSportsResultPerMarketScoreAPI(formData);

      if (res.status === 200) {
        notification.success({ message: res.data.message });
        fetchView();
      } else {
        notification.error({ message: res.data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: i18next.t("col.market"),
      align: "center",
      render: (_, record) => <span>{record.sports_market.name}</span>,
    },
    {
      title: i18next.t("title.firstHome"),
      align: "center",
      render: (_, record) => <span>{record.init_home_odds}</span>,
    },
    {
      title: i18next.t("title.firstDraw"),
      align: "center",
      render: (_, record) => <span>{record.init_draw_odds}</span>,
    },
    {
      title: i18next.t("title.firstAway"),
      align: "center",
      render: (_, record) => <span>{record.init_away_odds}</span>,
    },
    {
      title: i18next.t("col.home"),
      align: "center",
      render: (_, record) =>
        record.is_auto ? (
          <>{record.home_odds}</>
        ) : (
          <Input
            size="small"
            type="number"
            style={{ width: 80 }}
            defaultValue={record.home_odds}
            onChange={(e) => {
              setOddsData((prev: any) =>
                prev.map((item: any) =>
                  item.id === record.id
                    ? { ...item, home_odds: e.target.value }
                    : item
                )
              );
            }}
          />
        ),
    },
    {
      title: i18next.t("sportsBet.draw"),
      align: "center",
      render: (_, record) => {
        const showInput = !record.is_auto && record.draw_odds;

        if (record.is_auto) {
          return <>{record.draw_odds || record.odds_line || "VS"}</>;
        }

        if (showInput) {
          return (
            <Input
              size="small"
              type="number"
              style={{ width: 80 }}
              defaultValue={record.draw_odds}
              onChange={(e) => {
                setOddsData((prev: any) =>
                  prev.map((item: any) =>
                    item.id === record.id
                      ? { ...item, draw_odds: e.target.value }
                      : item
                  )
                );
              }}
            />
          );
        }

        return <>{record.odds_line || "VS"}</>;
      },
    },
    {
      title: i18next.t("col.away"),
      align: "center",
      render: (_, record) =>
        record.is_auto ? (
          <>{record.away_odds}</>
        ) : (
          <Input
            size="small"
            type="number"
            style={{ width: 80 }}
            defaultValue={record.away_odds}
            onChange={(e) => {
              setOddsData((prev: any) =>
                prev.map((item: any) =>
                  item.id === record.id
                    ? { ...item, away_odds: e.target.value }
                    : item
                )
              );
            }}
          />
        ),
    },
    {
      title: i18next.t("title.marketSuspended"),
      align: "center",
      render: (_, record) => {
        if (record.is_auto) {
          return record.is_market_stop ? (
            <span style={{ color: "red" }}>{i18next.t("status.suspended")}</span>
          ) : (
            i18next.t("adminLog.adl004")
          );
        }

        return (
          <Radio.Group
            name="marketstopradiogroup"
            onChange={(e) => {
              setOddsData((prev: any) =>
                prev.map((item: any) =>
                  item.id === record.id
                    ? { ...item, is_market_stop: e.target.value }
                    : item
                )
              );
            }}
            value={record.is_market_stop}
            options={SportsOptions.isStopOptions}
          />
        );
      },
    },
    {
      title: i18next.t("title.oddsSuspended"),
      align: "center",
      render: (_, record) => {
        if (record.is_auto) {
          return record.is_odds_stop ? (
            <span style={{ color: "red" }}>{i18next.t("status.suspended")}</span>
          ) : (
            i18next.t("adminLog.adl004")
          );
        }

        return (
          <Radio.Group
            name="oddstopradiogroup"
            onChange={(e) => {
              setOddsData((prev: any) =>
                prev.map((item: any) =>
                  item.id === record.id
                    ? { ...item, is_odds_stop: e.target.value }
                    : item
                )
              );
            }}
            value={record.is_odds_stop}
            options={SportsOptions.isStopOptions}
          />
        );
      },
    },
    {
      title: i18next.t("title.homeSuspended"),
      align: "center",
      render: (_, record) => {
        if (record.is_auto) {
          return record.is_home_stop ? (
            <span style={{ color: "red" }}>{i18next.t("status.suspended")}</span>
          ) : (
            i18next.t("adminLog.adl004")
          );
        }

        return (
          <Radio.Group
            name="homestopradiogroup"
            onChange={(e) => {
              setOddsData((prev: any) =>
                prev.map((item: any) =>
                  item.id === record.id
                    ? { ...item, is_home_stop: e.target.value }
                    : item
                )
              );
            }}
            value={record.is_home_stop}
            options={SportsOptions.isStopOptions}
          />
        );
      },
    },
    {
      title: i18next.t("title.drawSuspended"),
      align: "center",
      render: (_, record) => {
        if (record.is_auto) {
          return record.is_draw_stop ? (
            <span style={{ color: "red" }}>{i18next.t("status.suspended")}</span>
          ) : (
            i18next.t("adminLog.adl004")
          );
        }

        return (
          <Radio.Group
            name="drawstopradiogroup"
            onChange={(e) => {
              setOddsData((prev: any) =>
                prev.map((item: any) =>
                  item.id === record.id
                    ? { ...item, is_draw_stop: e.target.value }
                    : item
                )
              );
            }}
            value={record.is_draw_stop}
            options={SportsOptions.isStopOptions}
          />
        );
      },
    },
    {
      title: i18next.t("title.awaySuspended"),
      align: "center",
      render: (_, record) => {
        if (record.is_auto) {
          return record.is_away_stop ? (
            <span style={{ color: "red" }}>{i18next.t("status.suspended")}</span>
          ) : (
            i18next.t("adminLog.adl004")
          );
        }

        return (
          <Radio.Group
            name="awaystopradiogroup"
            onChange={(e) => {
              setOddsData((prev: any) =>
                prev.map((item: any) =>
                  item.id === record.id
                    ? { ...item, is_away_stop: e.target.value }
                    : item
                )
              );
            }}
            value={record.is_away_stop}
            options={SportsOptions.isStopOptions}
          />
        );
      },
    },
    {
      title: i18next.t("global.delete"),
      align: "center",
      render: (_, record) => {
        if (record.is_auto) {
          return record.is_delete ? (
            <span style={{ color: "red" }}>{i18next.t("global.delete")}</span>
          ) : (
            i18next.t("adminLog.adl004")
          );
        }

        return (
          <Radio.Group
            name="deleteradiogroup"
            onChange={(e) => {
              setOddsData((prev: any) =>
                prev.map((item: any) =>
                  item.id === record.id
                    ? { ...item, is_delete: e.target.value }
                    : item
                )
              );
            }}
            value={record.is_delete}
            options={SportsOptions.isDeleteOptions}
          />
        );
      },
    },
    {
      title: i18next.t("title.autoManual"),
      align: "center",
      render: (_, record) => (
        <Radio.Group
          name="autoradiogroup"
          onChange={(e) => {
            setOddsData((prev: any) =>
              prev.map((item: any) =>
                item.id === record.id
                  ? { ...item, is_auto: e.target.value }
                  : item
              )
            );
          }}
          value={record.is_auto}
          options={SportsOptions.isAutoOptions}
        />
      ),
    },
    {
      title: i18next.t("sportsBet.edit"),
      align: "center",
      render: (_, record) => (
        <Button loading={loading} onClick={() => updateOdds(record.id)}>
          {i18next.t("sportsScore.save")}
        </Button>
      ),
    },
    {
      title: i18next.t("title.resultProcessing"),
      align: "center",
      render: (_, record) => (
        <>
          <Input
            style={{ width: "40px" }}
            onChange={(e) => {
              setOddsData((prev: any) =>
                prev.map((item: any) =>
                  item.id === record.id
                    ? { ...item, home_score: e.target.value }
                    : item
                )
              );
            }}
          />{" "}
          :{" "}
          <Input
            style={{ width: "40px", marginRight: "5px" }}
            onChange={(e) => {
              setOddsData((prev: any) =>
                prev.map((item: any) =>
                  item.id === record.id
                    ? { ...item, away_score: e.target.value }
                    : item
                )
              );
            }}
          />
          <Popconfirm
            title={i18next.t("title.confirmResultByScore")}
            onConfirm={() => updateResultPerMarketScore(record.odds_key)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" style={{ marginRight: "5px" }}>
              {i18next.t("title.resultProcessing")}
            </Button>
          </Popconfirm>
          <Popconfirm
            title={i18next.t("title.confirmVoidProcessing")}
            onConfirm={() => updateResultPerMarket(record.odds_key, 3)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small">{i18next.t("sportsBet.statusSpecial")}</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const closeScoreModal = () => {
    setIsOpenScore(false);
  };

  const addOddsData = async (e: FormData) => {
    try {
      setLoading(true);

      const res = await createSportsOddsAPI({
        ...e,
        matchId: matchData.match_id,
        marketId: e.market.value,
      });

      if (res.status === 200) {
        notification.success({ message: res.data.message });
        form.resetFields();
        fetchView();
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
        <Breadcrumb replace={i18next.t("sports.matchEdit")} />
      </Space>
      <Divider />
      <Spin spinning={loading}>
        <div style={{ marginBottom: "10px", textAlign: "right" }}>
          <SaveBtn loading={updateLoading} onClick={updateMatch} />
        </div>
        <Radio.Group
          name="autoradiogroup"
          value={isAuto}
          onChange={(e) => setIsAuto(e.target.value)}
          options={SportsOptions.isAutoOptions}
          style={{ marginBottom: 12 }}
        />
        <Descriptions
          bordered
          layout="vertical"
          column={4}
          items={items}
          style={{ marginBottom: 24 }}
        />

        <Form layout="vertical" form={form} onFinish={addOddsData}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>{i18next.t("sports.registerOdds")}</h3>
            <Button htmlType="submit">{i18next.t("sports.addOdds")}</Button>
          </div>
          <Row gutter={[16, 0]} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Form.Item
                label={i18next.t("col.market")}
                name={"market"}
                rules={[{ required: true, message: i18next.t("validation.selectMarketField") }]}
              >
                <Select
                  labelInValue
                  options={marketOptions}
                  placeholder={i18next.t("sports.selectMarket")}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={i18next.t("col.home")}
                name={"homeOdds"}
                rules={[{ required: true, message: i18next.t("validation.enterHomeOddsField") }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={i18next.t("sports.drawOrHandicap")} name={"drawOdds"}>
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={i18next.t("col.away")}
                name={"awayOdds"}
                rules={[{ required: true, message: i18next.t("validation.enterAwayOddsField") }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={oddsData}
          loading={loading}
          pagination={false}
        />
      </Spin>

      <SportsScoreDetailModal
        isOpen={isOpenScore}
        close={closeScoreModal}
        matchData={matchData}
      />
    </Card>
  );
};

export default SportsMatchEdit;
