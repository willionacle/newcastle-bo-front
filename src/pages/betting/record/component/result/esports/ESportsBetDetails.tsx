import i18next from "@/i18n/i18n";
import { getBetDetails2 } from "@/api/bet-details/get";
import { BetLogData } from "@/api/betting-logs/get";
import {
  Flex,
  Spin,
  Card,
  Descriptions,
  Typography,
  Space,
  Divider,
} from "antd";
import DateText from "@/components/DateText";
import CommaNumber2 from "@/components/CommaNumber2";
import { StatusTag } from "./StatusTag";

const { Text } = Typography;

const ESportsBetDetails = ({ record }: { record: BetLogData }) => {
  const { data, isLoading } = getBetDetails2({
    username: record.username,
    game: record.game_history.toLowerCase(),
    session: record.session,
  });

  if (isLoading) {
    return (
      <Flex justify="center">
        <Spin />
      </Flex>
    );
  }

  const d = data?.data?.data;
  if (!d) return null;

  return (
    <Card style={{ boxShadow: "none", marginBottom: "5px" }}>
      <Descriptions
        size="small"
        column={{ xs: 1, sm: 2, md: 3 }}
        colon
        labelStyle={{ width: "fit-content" }}
      >
        <Descriptions.Item label={i18next.t("col.transactionId")}>
          <Text code copyable>
            {record.transaction_id}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label={i18next.t("betting.orderNumber")}>
          <Text code copyable>
            {d.order_id}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label={i18next.t("betting.user")}>{d.username}</Descriptions.Item>
        <Descriptions.Item label={i18next.t("memberDetail.mis051")}>{d.game_name}</Descriptions.Item>
        <Descriptions.Item label={i18next.t("col.status")}>
          <StatusTag status={d.prize_status} />
        </Descriptions.Item>
        <Descriptions.Item label={i18next.t("col.event2")}>{d.event_name}</Descriptions.Item>
        <Descriptions.Item label={i18next.t("title.betType")}>{d.play_name}</Descriptions.Item>
        <Descriptions.Item label={i18next.t("col.profitLoss")}>
          <Text strong>
            <CommaNumber2 value={d.win_lose} maximumFractionDigits={3} />
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label={i18next.t("col.betAmount")}>
          <Text strong>
            <CommaNumber2 value={d.amount} />
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label={i18next.t("col.odds")}>
          <Text strong>
            <CommaNumber2 value={d.odds} maximumFractionDigits={3} />
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label={i18next.t("betting.matchStart")}>
          <DateText date={d.game_start_time_kst} timeStamp />
        </Descriptions.Item>
        <Descriptions.Item label={i18next.t("col.bet")}>
          <DateText date={d.create_time_kst} timeStamp />
        </Descriptions.Item>
        <Descriptions.Item label={i18next.t("betting.description")}>
          <Text>{d.desc || "-"}</Text>
        </Descriptions.Item>
      </Descriptions>

      {d.team_info_desc?.trim() && (
        <>
          <Divider style={{ margin: "12px 0" }} />
          <Space direction="vertical" size={6} style={{ width: "100%" }}>
            <Text strong>{i18next.t("betting.candidateList")}</Text>
            <Typography.Paragraph>{d.team_info_desc}</Typography.Paragraph>
          </Space>
        </>
      )}
    </Card>
  );
};

export default ESportsBetDetails;
