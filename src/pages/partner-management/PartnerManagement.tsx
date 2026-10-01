import Breadcrumb from "@/components/Breadcrumb";
import { usePartnerEarningsAPI, usePartnerMembersAPI, usePartnerSummaryAPI, usePartnerTreeAPI } from "@/api/partners/get";
import { PartnerScope, PartnerTreeNode } from "@/api/partners/types";
import { Alert, Card, Col, DatePicker, Divider, Empty, Row, Spin, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PartnerTree from "./Tree";
import PartnerSummary from "./Summary";
import MemberList from "./MemberList";
import PartnerEarnings from "./Earnings";

const findFirstNode = (nodes: PartnerTreeNode[]): PartnerTreeNode | null =>
  nodes[0] ?? null;

const PartnerManagement = () => {
  const { t } = useTranslation();

  const [selected, setSelected] = useState<PartnerTreeNode | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs().startOf("month"), dayjs().endOf("month")]);
  const [memberScope, setMemberScope] = useState<PartnerScope>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const treeSWR = usePartnerTreeAPI();

  // §2 to is INCLUSIVE — from == to is a valid single-day range, no +1 day adjustment needed.
  // Format with dayjs directly rather than GF.formatDate: that helper parses via moment(),
  // which doesn't recognize a Dayjs instance and silently falls back to "now" for every
  // unit it can't read — from/to would both collapse to today regardless of the picked range.
  const range = useMemo(
    () => ({ from: dateRange[0].format("YYYY-MM-DD"), to: dateRange[1].format("YYYY-MM-DD") }),
    [dateRange]
  );

  useEffect(() => {
    if (!selected && treeSWR.data?.data?.tree?.length) {
      setSelected(findFirstNode(treeSWR.data.data.tree));
    }
  }, [treeSWR.data, selected]);

  useEffect(() => {
    setPage(1);
  }, [selected?.id, memberScope, range.from, range.to]);

  const summarySWR = usePartnerSummaryAPI(selected?.id, range);
  const membersSWR = usePartnerMembersAPI(selected?.id, range, memberScope, page, limit);
  const earningsSWR = usePartnerEarningsAPI(selected?.id, range);

  // All three detail endpoints report an unknown id the same way: code 1 with no data.
  const notFound = summarySWR.data?.code === 1 || earningsSWR.data?.code === 1 || membersSWR.data?.code === 1;

  return (
    <Card>
      <Breadcrumb />
      <Divider />
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small" title={t("partnerManagement.orgTree")} loading={treeSWR.isLoading}>
            {treeSWR.data?.data?.tree?.length ? (
              <PartnerTree data={treeSWR.data.data.tree} selectedId={selected?.id} onSelect={setSelected} />
            ) : (
              !treeSWR.isLoading && <Empty description={false} />
            )}
          </Card>
        </Col>

        <Col span={18}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
            <Col>
              <Typography.Text strong>
                {selected ? `${selected.displayName} (${selected.roleKo})` : t("partnerManagement.selectPrompt")}
              </Typography.Text>
            </Col>
            <Col>
              <DatePicker.RangePicker
                size="small"
                value={dateRange}
                allowClear={false}
                onChange={(dates) => {
                  if (dates?.[0] && dates?.[1]) setDateRange([dates[0], dates[1]]);
                }}
              />
            </Col>
          </Row>

          {!selected && !treeSWR.isLoading && <Empty description={t("partnerManagement.selectPrompt")} />}

          {selected && notFound && (
            <Alert type="error" showIcon message={t("partnerManagement.notFound")} style={{ marginBottom: 16 }} />
          )}

          {selected && !notFound && (
            <Spin spinning={summarySWR.isLoading}>
              <PartnerSummary data={summarySWR.data?.data} loading={summarySWR.isLoading} />

              <Divider />

              <Card size="small" title={t("partnerManagement.memberList")}>
                <MemberList
                  data={membersSWR.data?.data}
                  loading={membersSWR.isLoading}
                  scope={memberScope}
                  onScopeChange={setMemberScope}
                  page={membersSWR.data?.page ?? page}
                  limit={limit}
                  total={membersSWR.data?.totalitems ?? 0}
                  onPageChange={(nextPage, nextLimit) => {
                    setPage(nextPage);
                    setLimit(nextLimit);
                  }}
                />
              </Card>

              <Divider />

              <PartnerEarnings data={earningsSWR.data?.data} loading={earningsSWR.isLoading} />
            </Spin>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default PartnerManagement;
