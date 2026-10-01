import { Divider } from "antd";
import Filter from "./Filter";
import List from "./List";
import { getChatUsersApi } from "@/api/stream-community/get";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ChatUserList = () => {
  const { swr, onHeaderCell, paginationProps, setFilters } = getChatUsersApi();
  const navigate = useNavigate();
    const { pathname,search  } = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(search);
    params.set("tab", "user-list"); 
    navigate(`${pathname}?${params.toString()}`, { replace: true });
  }, []);

  return (
    <>
      <Filter setFilters={setFilters} />
      <Divider />
      <List
        data={swr.data ? swr.data.data : undefined}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
        mutate={swr.mutate}
      />
    </>
  );
};

export default ChatUserList;
