import { useMemo, useState, useEffect } from "react";
import { Modal, Table, Input, Button, notification, Alert } from "antd";
import { useTranslation, Trans } from "react-i18next";
import type { TFunction } from "i18next";
import { ColumnsType } from "antd/es/table";
import { getSportsScorePreviewAPI } from "@/api/sports-list/get";
import { updateSportsMatchScoreAPI } from "@/api/sports-list/patch";
import SportsScoreUpdatePreviewModal from "./SportsScoreUpdatePreviewModal";

type ScoreMap = Record<string, string>;

interface MatchData {
  id: number;
  sports_name: string;
  home_name: string;
  away_name: string;
  score: string;
}

interface ScoreItem {
  value: string;
  label: string;
  home: string;
  away: string;
}

interface Props {
  isOpen: boolean;
  close: () => void;
  matchData?: MatchData;
}

const sportsSet = (sports: string, t: TFunction) => {
  let setArr: any = [];

  switch (sports) {
    case "soccer":
      setArr = [
        {
          label: t("sportsScore.firstHalf"),
          value: "1",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.secondHalf"),
          value: "2",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.halfTime"),
          value: "ht",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.fullTime"),
          value: "ft",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.extraTime"),
          value: "et",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.penalty"),
          value: "pen",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.firstScore"),
          value: "f_g",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.lastScore"),
          value: "l_g",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.finalScore"),
          value: "score",
          home: "",
          away: "",
        },
      ];
      break;
    case "americanfootball":
      setArr = [
        {
          label: t("sportsScore.quarter1"),
          value: "1",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.quarter2"),
          value: "2",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.quarter3"),
          value: "3",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.quarter4"),
          value: "4",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.fullTime"),
          value: "ft",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.extraTime"),
          value: "et",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.finalScore"),
          value: "score",
          home: "",
          away: "",
        },
      ];
      break;
    case "boxingufc":
      setArr = [
        {
          label: t("sportsScore.finalScore"),
          value: "score",
          home: "",
          away: "",
        },
      ];
      break;
    case "tennis":
      setArr = [
        {
          label: t("sportsScore.set1"),
          value: "1",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.set2"),
          value: "2",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.set3"),
          value: "3",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.set4"),
          value: "4",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.set5"),
          value: "5",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setScore1"),
          value: "1_set",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setScore2"),
          value: "2_set",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setScore3"),
          value: "3_set",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setScore4"),
          value: "4_set",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setScore5"),
          value: "5_set",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.finalScore"),
          value: "score",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.finalSetScore"),
          value: "score_set",
          home: "",
          away: "",
        },
      ];
      break;
    case "baseball":
      setArr = [
        {
          label: t("sportsScore.inning1"),
          value: "1",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.inning2"),
          value: "2",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.inning3"),
          value: "3",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.inning4"),
          value: "4",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.inning5"),
          value: "5",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.inning6"),
          value: "6",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.inning7"),
          value: "7",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.inning8"),
          value: "8",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.inning9"),
          value: "9",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.fullTime"),
          value: "ft",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.extraTime"),
          value: "et",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.finalScore"),
          value: "score",
          home: "",
          away: "",
        },
      ];
      break;
    case "icehockey":
      setArr = [
        {
          label: t("sportsScore.period1"),
          value: "1",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.period2"),
          value: "2",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.period3"),
          value: "3",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.fullTime"),
          value: "ft",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.extraTime"),
          value: "et",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.penalty"),
          value: "pen",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.firstScore"),
          value: "f_g",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.lastScore"),
          value: "l_g",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.finalScore"),
          value: "score",
          home: "",
          away: "",
        },
      ];
      break;
    case "basketball":
      setArr = [
        {
          label: t("sportsScore.quarter1"),
          value: "1",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.quarter2"),
          value: "2",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.quarter3"),
          value: "3",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.quarter4"),
          value: "4",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.fullTime"),
          value: "ft",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.extraTime"),
          value: "et",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.finalScore"),
          value: "score",
          home: "",
          away: "",
        },
      ];
      break;
    case "handball":
      setArr = [
        {
          label: t("sportsScore.firstHalf"),
          value: "1",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.secondHalf"),
          value: "2",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.extraTime"),
          value: "et",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.finalScore"),
          value: "score",
          home: "",
          away: "",
        },
      ];
      break;
    case "volleyball":
      setArr = [
        {
          label: t("sportsScore.set1"),
          value: "1",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.set2"),
          value: "2",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.set3"),
          value: "3",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.set4"),
          value: "4",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.set5"),
          value: "5",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setScore1"),
          value: "1_set",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setScore2"),
          value: "2_set",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setScore3"),
          value: "3_set",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setScore4"),
          value: "4_set",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setScore5"),
          value: "5_set",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.finalScore"),
          value: "score",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.finalSetScore"),
          value: "score_set",
          home: "",
          away: "",
        },
      ];
      break;
    case "tabletennis":
      setArr = [
        {
          label: t("sportsScore.set1"),
          value: "1",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.set2"),
          value: "2",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.set3"),
          value: "3",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.set4"),
          value: "4",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.set5"),
          value: "5",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.set6"),
          value: "6",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.set7"),
          value: "7",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setScore1"),
          value: "1_set",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setScore2"),
          value: "2_set",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setScore3"),
          value: "3_set",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setScore4"),
          value: "4_set",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setScore5"),
          value: "5_set",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setScore6"),
          value: "6_set",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setScore7"),
          value: "7_set",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.finalScore"),
          value: "score",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.finalSetScore"),
          value: "score_set",
          home: "",
          away: "",
        },
      ];
      break;
    case "esports":
      setArr = [
        {
          label: t("sportsScore.set1"),
          value: "1",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.set2"),
          value: "2",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.set3"),
          value: "3",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.set4"),
          value: "4",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.set5"),
          value: "5",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setKills1"),
          value: "k1",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setKills2"),
          value: "k2",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setKills3"),
          value: "k3",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setKills4"),
          value: "k4",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.setKills5"),
          value: "k5",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.firstKill"),
          value: "f_k1",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.firstTower"),
          value: "f_t1",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.firstBaron"),
          value: "f_b1",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.firstDragon"),
          value: "f_d1",
          home: "",
          away: "",
        },
        {
          label: t("sportsScore.finalScore"),
          value: "score",
          home: "",
          away: "",
        },
      ];
      break;
  }

  return setArr;
};

const SportsScoreDetailModal = ({ isOpen, close, matchData }: Props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const initialScoreData: ScoreItem[] = useMemo(() => {
    if (!matchData?.score) return [];

    try {
      const setArr = sportsSet(matchData.sports_name, t);

      const parsed = JSON.parse(matchData.score) as {
        home: ScoreMap;
        away: ScoreMap;
      };

      for (const set of setArr) {
        if (parsed.home[set.value]) {
          set.home = parsed.home[set.value];
        }

        if (parsed.away[set.value]) {
          set.away = parsed.away[set.value];
        }
      }

      return setArr;
    } catch (e) {
      console.error("Failed to parse score:", e);
      return [];
    }
  }, [matchData, t]);

  const [scoreData, setScoreData] = useState<ScoreItem[]>([]);

  useEffect(() => {
    setScoreData(initialScoreData);
  }, [initialScoreData]);

  const handleChange = (
    round: string,
    field: "home" | "away",
    value: string
  ) => {
    setScoreData((prev) =>
      prev.map((item) =>
        item.value === round ? { ...item, [field]: value } : item
      )
    );
  };

  const getPreview = async () => {
    try {
      setPreviewLoading(true);

      const parsedScore: any = {
        home: {},
        away: {},
      };

      scoreData.forEach((x) => {
        parsedScore.home[x.value] = x.home;
        parsedScore.away[x.value] = x.away;
      });

      const res = await getSportsScorePreviewAPI({
        id: matchData?.id,
        score: JSON.stringify(parsedScore),
      });

      if (res.status === 200) {
        if (res.data.length === 0) {
          notification.warning({ message: t("sportsScore.noBetsToEdit") });
        } else {
          setPreviewData(res.data);
          setIsOpenPreview(true);
        }
      } else {
        notification.error({ message: res.data.message });
      }
    } finally {
      setPreviewLoading(false);
    }
  };

  const updateScore = async () => {
    try {
      setLoading(true);

      const parsedScore: any = {
        home: {},
        away: {},
      };

      scoreData.forEach((x) => {
        parsedScore.home[x.value] = x.home;
        parsedScore.away[x.value] = x.away;
      });

      const res = await updateSportsMatchScoreAPI({
        id: matchData?.id,
        score: JSON.stringify(parsedScore),
      });

      if (res.status === 200) {
        notification.success({ message: res.data.message });
      } else {
        notification.error({ message: res.data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<ScoreItem> = [
    {
      title: t("sportsScore.round"),
      dataIndex: "label",
      align: "center",
    },
    {
      title: t("sportsScore.homeCol", { name: matchData?.home_name ?? "" }),
      dataIndex: "home",
      align: "center",
      render: (value: string, record: ScoreItem) => (
        <Input
          value={value}
          onChange={(e) => handleChange(record.value, "home", e.target.value)}
        />
      ),
    },
    {
      title: t("sportsScore.awayCol", { name: matchData?.away_name ?? "" }),
      dataIndex: "away",
      align: "center",
      render: (value: string, record: ScoreItem) => (
        <Input
          value={value}
          onChange={(e) => handleChange(record.value, "away", e.target.value)}
        />
      ),
    },
  ];

  const closePreview = () => {
    setIsOpenPreview(false);
  };

  return (
    <Modal
      title={t("sportsScore.title")}
      open={isOpen}
      onCancel={close}
      width={750}
      footer={[
        <Button key="back" onClick={close}>
          {t("sportsScore.close")}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={updateScore}
        >
          {t("sportsScore.save")}
        </Button>,
      ]}
    >
      <div style={{ textAlign: "right", marginBottom: 8 }}>
        <Button onClick={getPreview} loading={previewLoading}>
          {t("sportsScore.previewEdit")}
        </Button>
      </div>

      <Alert
        type="error"
        style={{ marginBottom: 12, fontSize: "14px" }}
        message={
          <Trans i18nKey="sportsScore.warning" components={{ b: <strong />, br: <br /> }} />
        }
      />
      <Table
        rowKey="value"
        columns={columns}
        dataSource={scoreData}
        pagination={false}
        bordered
      />
      <SportsScoreUpdatePreviewModal
        isOpen={isOpenPreview}
        close={closePreview}
        data={previewData}
      />
    </Modal>
  );
};

export default SportsScoreDetailModal;
