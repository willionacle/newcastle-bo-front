import Breadcrumb from "@/components/Breadcrumb";
import CreateBtn from "@/components/CreateBtn";
import { Card, Divider, Space } from "antd";
import List from "./List";
import { useTranslation } from "react-i18next";
import { getChatWordsApi } from "@/api/stream-community/get";

const ChatSettings = ({isTab}:{isTab?: boolean}) => {
   const { t }= useTranslation();
  const { swr, onHeaderCell, paginationProps } = getChatWordsApi();

  return isTab ? (
    <List
      data={swr.data ? swr.data.data : undefined}
      loading={swr.isLoading}
      onHeaderCell={onHeaderCell}
      pagination={paginationProps(swr.data?.totalitems)}
      mutate={swr.mutate}
    />
  ) : (
    <Card>
      <Space align="center">
        <Breadcrumb replace={t("col.chatBannedWordSettings")}/>
        <CreateBtn />
      </Space>
      <Divider />
      <List
        data={swr.data ? swr.data.data : undefined}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
        mutate={swr.mutate}
      />
    </Card>
  );
};

export default ChatSettings;
