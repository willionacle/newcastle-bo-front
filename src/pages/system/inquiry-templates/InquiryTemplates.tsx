import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space } from "antd";
import Btn from "@/components/Btn";
import Filter from "./Filter";
import List from "./List";
import FormModal from "./FormModal";
import {
  InquiryTemplate,
  InquiryTemplatesMetaRes,
  inquiryTemplatesListAPI,
  inquiryTemplatesMetaAPI,
} from "@/api/inquiry-templates/get";
import useUserStore from "@/store/user.store";

// Modal open-state doubles as create/edit selection:
// undefined = closed, null = create, an item = edit.
const InquiryTemplates = () => {
  const { token } = useUserStore.getState();
  const { swr, onHeaderCell, paginationProps, setFilters } = inquiryTemplatesListAPI();
  const [meta, setMeta] = useState<InquiryTemplatesMetaRes["data"]>();
  const [editing, setEditing] = useState<InquiryTemplate | null | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const res = await inquiryTemplatesMetaAPI(token);
        setMeta(res.data?.data);
      } catch (error) {
        console.error(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categoryLabel = (key: string) =>
    meta?.categories.find((c) => c.key === key)?.labelKo ?? key;

  return (
    <Card>
      <Space align="center">
        <Breadcrumb />
        <Btn btnType="create" onClick={() => setEditing(null)} />
      </Space>
      <Divider />
      <Filter setFilters={setFilters} categories={meta?.categories ?? []} />
      <Divider />
      <List
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        categoryLabel={categoryLabel}
        pagination={paginationProps(swr.data?.totalitems)}
        onHeaderCell={onHeaderCell}
        onEdit={setEditing}
        mutate={() => swr.mutate()}
      />

      <FormModal
        open={editing !== undefined}
        data={editing ?? undefined}
        meta={meta}
        onClose={() => setEditing(undefined)}
        onSaved={() => {
          setEditing(undefined);
          swr.mutate();
        }}
      />
    </Card>
  );
};

export default InquiryTemplates;
