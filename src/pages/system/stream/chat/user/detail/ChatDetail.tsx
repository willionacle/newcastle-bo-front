import { ChatUser, userChatDetailsAPIStateQuery } from "@/api/stream-community/get";
import Breadcrumb from "@/components/Breadcrumb";
import { Divider } from "antd";
import List from "./List";


export default function ChatDetail({data}:{data:ChatUser}) {
   const { swr, onHeaderCell, paginationProps } = userChatDetailsAPIStateQuery({
    filter_name: data.name,
   });

  return (
    <>
      <Breadcrumb replace={data.name} />
      <Divider />
      <List
        data={swr.data ? swr.data.data : undefined}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
        mutate={swr.mutate}
        chatUser={data}
      />
    </>
  )
}