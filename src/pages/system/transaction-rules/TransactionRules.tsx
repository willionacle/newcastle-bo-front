import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space } from "antd";
import Btn from "@/components/Btn";
import Filter from "./Filter";
import List from "./List";
import FormModal from "./FormModal";
import { transactionRulesListAPI, transactionRulesMetaAPI } from "@/api/transaction-rules/get";
import { TransactionRule, TransactionRuleMetaData } from "@/api/transaction-rules/types";
import useUserStore from "@/store/user.store";

// Modal open-state doubles as create/edit selection:
// undefined = closed, null = create, an item = edit.
const TransactionRules = () => {
  const { token } = useUserStore.getState();
  const { swr, onHeaderCell, paginationProps, setFilters } = transactionRulesListAPI();
  const [meta, setMeta] = useState<TransactionRuleMetaData>();
  const [editing, setEditing] = useState<TransactionRule | null | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const res = await transactionRulesMetaAPI(token);
        setMeta(res.data?.data);
      } catch (error) {
        console.error(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <Space align="center">
        <Breadcrumb />
        <Btn btnType="create" onClick={() => setEditing(null)} />
      </Space>
      <Divider />
      <Filter setFilters={setFilters} targets={meta?.targets ?? []} />
      <Divider />
      <List
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        meta={meta}
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

export default TransactionRules;
