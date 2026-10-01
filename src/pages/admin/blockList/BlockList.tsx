import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { Button, Card, Col, Divider, Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import List from "./List";
import { blockIpsAPI } from "@/api/block-ips/get";
import Filter from "./Filter";
import AddModal from "./AddModal";
import IpDetailModal from "./IpDetailModal";

const BlockList = () => {
  const { t } = useTranslation();
  const { swr, paginationProps, onHeaderCell, setFilters } = blockIpsAPI();
  const [addOpen, setAddOpen] = useState(false);
  const [detailIp, setDetailIp] = useState<string | null>(null);

  return (
    <Card>
      <Breadcrumb />
      <Divider />
      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddOpen(true)}>
            {t("blockips.addButton")}
          </Button>
        </Col>
      </Row>
      <Filter setBody={setFilters} />
      <Divider />
      <List
        data={swr.data?.data ?? []}
        pagination={paginationProps(swr.data?.totalitems)}
        loading={swr.isLoading}
        onHeaderCell={onHeaderCell}
        mutate={swr.mutate}
        onOpenDetail={setDetailIp}
      />

      <AddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSaved={() => {
          setAddOpen(false);
          swr.mutate();
        }}
      />
      <IpDetailModal ip={detailIp} onClose={() => setDetailIp(null)} />
    </Card>
  );
};

export default BlockList;
