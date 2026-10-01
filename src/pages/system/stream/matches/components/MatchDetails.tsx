import i18next from "@/i18n/i18n";
import { getStreamApi, MatchData } from "@/api/stream-community/get";
import DateText from "@/components/DateText";
import { Descriptions, Divider, Flex, Spin, Tag } from "antd";
import { useEffect, useState } from "react";

export default function MatchDetails({ matchData }: { matchData?: MatchData }) {
  const [match, setMatch] = useState<MatchData | undefined>(undefined);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchStream = async () => {
      try {
        setLoading(true)
        const res = await getStreamApi(matchData?.id);
        setMatch(res);
      } catch (err) {
        console.log(err);
      }finally{
        setLoading(false)
      }
    };

    fetchStream();
  }, [matchData]);

  if(loading) return <Flex justify="center"><Spin/></Flex>

  return (
    <>
      <Flex justify="center" align="center" gap={20} style={{ width: "100%" }}>
        <Descriptions column={1} bordered size="middle">
          <Descriptions.Item
            style={{ fontSize: "15px" }}
            label={i18next.t("system.homeTeamScore", { score: match?.HomeScore ?? "-" })}
          >
            {match?.Home}
          </Descriptions.Item>
        </Descriptions>
        <span style={{ fontSize: "30px", fontWeight: "bold" }}> VS </span>
        <Descriptions column={1} bordered size="middle">
          <Descriptions.Item
            style={{ fontSize: "15px" }}
            label={i18next.t("system.homeTeamScore", { score: match?.HomeScore ?? "-" })}
          >
            {match?.Home}
          </Descriptions.Item>
        </Descriptions>
      </Flex>
      <Divider />
      <Descriptions column={3} size="small">
        <Descriptions.Item label="Match ID">
          {match?.MatchID}
        </Descriptions.Item>
        <Descriptions.Item label={i18next.t("col.sport")}>{match?.Type}</Descriptions.Item>
        <Descriptions.Item label={i18next.t("col.name")}>{match?.Name}</Descriptions.Item>

        <Descriptions.Item label={i18next.t("col.leagueName")}>{match?.League}</Descriptions.Item>

        <Descriptions.Item label={i18next.t("title.inProgress")}>
          {match?.NowPlaying ? (
            <Tag color="green">{i18next.t("global.true")}</Tag>
          ) : (
            <Tag color="red">{i18next.t("global.false")}</Tag>
          )}
        </Descriptions.Item>

        {/* <Descriptions.Item label="Live">
          {match?.IsLive ? (
            <Tag color="red">● Live</Tag>
          ) : (
            <Tag color="red">Waiting</Tag>
          )}
        </Descriptions.Item> */}

        <Descriptions.Item label={i18next.t("title.startTime")}>
          <DateText date={match?.TimeStart as string} timeStamp />
        </Descriptions.Item>

        <Descriptions.Item label={i18next.t("title.endTime")}>
          <DateText date={match?.TimeStop as string} timeStamp />
        </Descriptions.Item>

        <Descriptions.Item label="State">
          {" "}
          {match?.State === "resume" ? i18next.t("system.resumeMatch") : i18next.t("status.stopped")}
        </Descriptions.Item>
      </Descriptions>
      <iframe
        src={match?.streamlink}
        allowFullScreen
        width={854}
        height={480}
        style={{ width: "100%", border:"none" }}
        allow="autoplay; encrypted-media"
      />
    </>
  );
}
