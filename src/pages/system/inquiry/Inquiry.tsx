import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import List from "./List";
import Filter from "./Filter";
import InquiryDetailModal from "./InquiryDetailModal";
import { inquiryListAPI, InquiryItem } from "@/api/inquiry/get";
import { inquiryCategoriesAPI, InquiryCategoryOption } from "@/api/inquiry/categories";
import useUserStore from "@/store/user.store";
import { socket } from "@/api/socket";

const Inquiry = () => {
  const { swr, onHeaderCell, paginationProps, setFilters } = inquiryListAPI();
  const { token } = useUserStore.getState();
  const [categories, setCategories] = useState<InquiryCategoryOption[]>([]);
  const [selected, setSelected] = useState<InquiryItem | undefined>();

  useEffect(() => {
    const handleLiveUpdate = () => swr.mutate();

    socket.on("newInquiry", handleLiveUpdate);
    socket.on("inquiryCount", handleLiveUpdate);

    return () => {
      socket.off("newInquiry", handleLiveUpdate);
      socket.off("inquiryCount", handleLiveUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await inquiryCategoriesAPI(token);
        setCategories(res.data?.data?.categories ?? []);
      } catch (error) {
        console.error(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <Breadcrumb />
      <Divider />
      <Filter setFilters={setFilters} categories={categories} />
      <Divider />
      <List
        data={swr.data ? swr.data.data : []}
        categories={categories}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
        onSelect={setSelected}
      />

      <InquiryDetailModal
        open={!!selected}
        data={selected}
        categories={categories}
        onClose={() => setSelected(undefined)}
        onUpdated={(item) => {
          setSelected(item);
          swr.mutate();
        }}
      />
    </Card>
  );
};

export default Inquiry;
