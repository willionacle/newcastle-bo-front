import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space, Tabs } from "antd";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ChatUserList from "./ChatUserList";
import ChatSettings from "../ChatSettings";
import CreateBtn from "@/components/CreateBtn";
import { getScdCommentCountApi } from "@/api/stream-community/get";
import ChatRepliesList from "./chat-replies/ChatUserList";

export default function ChatUserTab() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const { swr: countSwr } = getScdCommentCountApi();

  const breadcrumbTitles: Record<string, string> = {
    "user-list": i18next.t("system.chatUserList"),
    "forbidder-words": i18next.t("col.chatBannedWordSettings"),
    "chat-replies": i18next.t("system.commentList"),
  };

  const items = [
    {
      key: "user-list",
      label: i18next.t("system.chatUserList"),
      children: <ChatUserList />,
    },
    {
      key: "forbidder-words",
      label: i18next.t("col.chatBannedWordSettings"),
      children: <ChatSettings isTab />,
    },
    {
      key: "chat-replies",
      label: i18next.t("system.commentList"),
      children: <ChatRepliesList />,
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space align="center">
          <Breadcrumb
            replace={breadcrumbTitles[searchParams.get("tab") ?? "user-list"] ?? ""}
          />
          {searchParams.get("tab") == "forbidder-words" && (
            <CreateBtn url="/stream/chat-user-list/create?tab=forbidder-words" />
          )}
        </Space>
        {searchParams.get("tab") === "user-list" && (
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', textAlign: 'right' }}>
            <span>당일 채팅참여유저수: {countSwr.data?.data?.daily_count ?? 0}{i18next.t("unit.people")}</span>
            <span>누적 채팅참여유저수: {countSwr.data?.data?.total_count ?? 0}{i18next.t("unit.people")}</span>
          </div>
        )}
      </div>
      <Divider />
      <Tabs
        type="card"
        items={items}
        onChange={(key) => navigate(`${pathname}?tab=${key}`)}
        defaultActiveKey={searchParams.get("tab") ?? "user-list"}
        activeKey={searchParams.get("tab") ?? "user-list"}
      />
    </Card>
  );
}
