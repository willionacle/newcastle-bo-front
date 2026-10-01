import { useMemo, useState, useEffect } from "react";
import i18next from "@/i18n/i18n";
import { Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";

type ScoreMap = Record<string, string>;

interface MatchData {
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

const sportsSet = (sports: string) => {
  let setArr: any = [];

  switch (sports) {
    case "soccer":
      setArr = [
        {
          label: "전반전",
          value: "1",
          home: "",
          away: "",
        },
        {
          label: "후반전",
          value: "2",
          home: "",
          away: "",
        },
        {
          label: "하프타임",
          value: "ht",
          home: "",
          away: "",
        },
        {
          label: "풀타임",
          value: "ft",
          home: "",
          away: "",
        },
        {
          label: "연장전",
          value: "et",
          home: "",
          away: "",
        },
        {
          label: "패널티",
          value: "pen",
          home: "",
          away: "",
        },
        {
          label: "첫득점",
          value: "f_g",
          home: "",
          away: "",
        },
        {
          label: "마지막득점",
          value: "l_g",
          home: "",
          away: "",
        },
        {
          label: "최종점수",
          value: "score",
          home: "",
          away: "",
        },
      ];
      break;
    case "americanfootball":
      setArr = [
        {
          label: "1쿼터",
          value: "1",
          home: "",
          away: "",
        },
        {
          label: "2쿼터",
          value: "2",
          home: "",
          away: "",
        },
        {
          label: "3쿼터",
          value: "3",
          home: "",
          away: "",
        },
        {
          label: "4쿼터",
          value: "4",
          home: "",
          away: "",
        },
        {
          label: "풀타임",
          value: "ft",
          home: "",
          away: "",
        },
        {
          label: "연장전",
          value: "et",
          home: "",
          away: "",
        },
        {
          label: "최종점수",
          value: "score",
          home: "",
          away: "",
        },
      ];
      break;
    case "boxingufc":
      setArr = [
        {
          label: "최종점수",
          value: "score",
          home: "",
          away: "",
        },
      ];
      break;
    case "tennis":
      setArr = [
        {
          label: "1세트",
          value: "1",
          home: "",
          away: "",
        },
        {
          label: "2세트",
          value: "2",
          home: "",
          away: "",
        },
        {
          label: "3세트",
          value: "3",
          home: "",
          away: "",
        },
        {
          label: "4세트",
          value: "4",
          home: "",
          away: "",
        },
        {
          label: "5세트",
          value: "5",
          home: "",
          away: "",
        },
        {
          label: "1세트의 세트 점수",
          value: "1_set",
          home: "",
          away: "",
        },
        {
          label: "2세트의 세트 점수",
          value: "2_set",
          home: "",
          away: "",
        },
        {
          label: "3세트의 세트 점수",
          value: "3_set",
          home: "",
          away: "",
        },
        {
          label: "4세트의 세트 점수",
          value: "4_set",
          home: "",
          away: "",
        },
        {
          label: "5세트의 세트 점수",
          value: "5_set",
          home: "",
          away: "",
        },
        {
          label: "최종점수",
          value: "score",
          home: "",
          away: "",
        },
        {
          label: "최종세트점수",
          value: "score_set",
          home: "",
          away: "",
        },
      ];
      break;
    case "baseball":
      setArr = [
        {
          label: "1이닝",
          value: "1",
          home: "",
          away: "",
        },
        {
          label: "2이닝",
          value: "2",
          home: "",
          away: "",
        },
        {
          label: "3이닝",
          value: "3",
          home: "",
          away: "",
        },
        {
          label: "4이닝",
          value: "4",
          home: "",
          away: "",
        },
        {
          label: "5이닝",
          value: "5",
          home: "",
          away: "",
        },
        {
          label: "6이닝",
          value: "6",
          home: "",
          away: "",
        },
        {
          label: "7이닝",
          value: "7",
          home: "",
          away: "",
        },
        {
          label: "8이닝",
          value: "8",
          home: "",
          away: "",
        },
        {
          label: "9이닝",
          value: "9",
          home: "",
          away: "",
        },
        {
          label: "풀타임",
          value: "ft",
          home: "",
          away: "",
        },
        {
          label: "연장전",
          value: "et",
          home: "",
          away: "",
        },
        {
          label: "최종점수",
          value: "score",
          home: "",
          away: "",
        },
      ];
      break;
    case "icehockey":
      setArr = [
        {
          label: "1피리어드",
          value: "1",
          home: "",
          away: "",
        },
        {
          label: "2피리어드",
          value: "2",
          home: "",
          away: "",
        },
        {
          label: "3피리어드",
          value: "3",
          home: "",
          away: "",
        },
        {
          label: "풀타임",
          value: "ft",
          home: "",
          away: "",
        },
        {
          label: "연장전",
          value: "et",
          home: "",
          away: "",
        },
        {
          label: "패널티",
          value: "pen",
          home: "",
          away: "",
        },
        {
          label: "첫득점",
          value: "f_g",
          home: "",
          away: "",
        },
        {
          label: "마지막득점",
          value: "l_g",
          home: "",
          away: "",
        },
        {
          label: "최종점수",
          value: "score",
          home: "",
          away: "",
        },
      ];
      break;
    case "basketball":
      setArr = [
        {
          label: "1쿼터",
          value: "1",
          home: "",
          away: "",
        },
        {
          label: "2쿼터",
          value: "2",
          home: "",
          away: "",
        },
        {
          label: "3쿼터",
          value: "3",
          home: "",
          away: "",
        },
        {
          label: "4쿼터",
          value: "4",
          home: "",
          away: "",
        },
        {
          label: "풀타임",
          value: "ft",
          home: "",
          away: "",
        },
        {
          label: "연장전",
          value: "et",
          home: "",
          away: "",
        },
        {
          label: "최종점수",
          value: "score",
          home: "",
          away: "",
        },
      ];
      break;
    case "handball":
      setArr = [
        {
          label: "전반전",
          value: "1",
          home: "",
          away: "",
        },
        {
          label: "후반전",
          value: "2",
          home: "",
          away: "",
        },
        {
          label: "연장전",
          value: "et",
          home: "",
          away: "",
        },
        {
          label: "최종점수",
          value: "score",
          home: "",
          away: "",
        },
      ];
      break;
    case "volleyball":
      setArr = [
        {
          label: "1세트",
          value: "1",
          home: "",
          away: "",
        },
        {
          label: "2세트",
          value: "2",
          home: "",
          away: "",
        },
        {
          label: "3세트",
          value: "3",
          home: "",
          away: "",
        },
        {
          label: "4세트",
          value: "4",
          home: "",
          away: "",
        },
        {
          label: "5세트",
          value: "5",
          home: "",
          away: "",
        },
        {
          label: "1세트의 세트 점수",
          value: "1_set",
          home: "",
          away: "",
        },
        {
          label: "2세트의 세트 점수",
          value: "2_set",
          home: "",
          away: "",
        },
        {
          label: "3세트의 세트 점수",
          value: "3_set",
          home: "",
          away: "",
        },
        {
          label: "4세트의 세트 점수",
          value: "4_set",
          home: "",
          away: "",
        },
        {
          label: "5세트의 세트 점수",
          value: "5_set",
          home: "",
          away: "",
        },
        {
          label: "최종점수",
          value: "score",
          home: "",
          away: "",
        },
        {
          label: "최종세트점수",
          value: "score_set",
          home: "",
          away: "",
        },
      ];
      break;
    case "tabletennis":
      setArr = [
        {
          label: "1세트",
          value: "1",
          home: "",
          away: "",
        },
        {
          label: "2세트",
          value: "2",
          home: "",
          away: "",
        },
        {
          label: "3세트",
          value: "3",
          home: "",
          away: "",
        },
        {
          label: "4세트",
          value: "4",
          home: "",
          away: "",
        },
        {
          label: "5세트",
          value: "5",
          home: "",
          away: "",
        },
        {
          label: "6세트",
          value: "6",
          home: "",
          away: "",
        },
        {
          label: "7세트",
          value: "7",
          home: "",
          away: "",
        },
        {
          label: "1세트의 세트 점수",
          value: "1_set",
          home: "",
          away: "",
        },
        {
          label: "2세트의 세트 점수",
          value: "2_set",
          home: "",
          away: "",
        },
        {
          label: "3세트의 세트 점수",
          value: "3_set",
          home: "",
          away: "",
        },
        {
          label: "4세트의 세트 점수",
          value: "4_set",
          home: "",
          away: "",
        },
        {
          label: "5세트의 세트 점수",
          value: "5_set",
          home: "",
          away: "",
        },
        {
          label: "6세트의 세트 점수",
          value: "6_set",
          home: "",
          away: "",
        },
        {
          label: "7세트의 세트 점수",
          value: "7_set",
          home: "",
          away: "",
        },
        {
          label: "최종점수",
          value: "score",
          home: "",
          away: "",
        },
        {
          label: "최종세트점수",
          value: "score_set",
          home: "",
          away: "",
        },
      ];
      break;
    case "esports":
      setArr = [
        {
          label: "1세트",
          value: "1",
          home: "",
          away: "",
        },
        {
          label: "2세트",
          value: "2",
          home: "",
          away: "",
        },
        {
          label: "3세트",
          value: "3",
          home: "",
          away: "",
        },
        {
          label: "4세트",
          value: "4",
          home: "",
          away: "",
        },
        {
          label: "5세트",
          value: "5",
          home: "",
          away: "",
        },
        {
          label: "1세트 킬 수",
          value: "k1",
          home: "",
          away: "",
        },
        {
          label: "2세트 킬 수",
          value: "k2",
          home: "",
          away: "",
        },
        {
          label: "3세트 킬 수",
          value: "k3",
          home: "",
          away: "",
        },
        {
          label: "4세트 킬 수",
          value: "k4",
          home: "",
          away: "",
        },
        {
          label: "5세트 킬 수",
          value: "k5",
          home: "",
          away: "",
        },
        {
          label: "1세트 첫 킬",
          value: "f_k1",
          home: "",
          away: "",
        },
        {
          label: "1세트 첫 타워",
          value: "f_t1",
          home: "",
          away: "",
        },
        {
          label: "1세트 첫 바론",
          value: "f_b1",
          home: "",
          away: "",
        },
        {
          label: "1세트 첫 용",
          value: "f_d1",
          home: "",
          away: "",
        },
        {
          label: "최종점수",
          value: "score",
          home: "",
          away: "",
        },
      ];
      break;
  }

  return setArr;
};

const SportsBettingDetailScoreModal = ({ isOpen, close, matchData }: Props) => {
  const initialScoreData: ScoreItem[] = useMemo(() => {
    if (!matchData?.score) return [];

    try {
      const setArr = sportsSet(matchData.sports_name);

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
  }, [matchData]);

  const [scoreData, setScoreData] = useState<ScoreItem[]>([]);

  useEffect(() => {
    setScoreData(initialScoreData);
  }, [initialScoreData]);

  const columns: ColumnsType<ScoreItem> = [
    {
      title: i18next.t("sportsScore.round"),
      dataIndex: "label",
      align: "center",
    },
    {
      title: `홈 [${matchData?.home_name ?? ""}]`,
      dataIndex: "home",
      align: "center",
    },
    {
      title: `원정 [${matchData?.away_name ?? ""}]`,
      dataIndex: "away",
      align: "center",
    },
  ];

  return (
    <Modal
      title={i18next.t("sportsScore.title")}
      open={isOpen}
      onCancel={close}
      width={600}
      footer={null}
    >
      <Table
        rowKey="value"
        columns={columns}
        dataSource={scoreData}
        pagination={false}
        bordered
      />
    </Modal>
  );
};

export default SportsBettingDetailScoreModal;
