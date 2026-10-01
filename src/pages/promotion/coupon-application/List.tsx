import i18next from "@/i18n/i18n";
import { CouponApplicationData } from "@/api/coupon-application/get";
import { ResPostList, SWRType } from "@/api/types";
import DateText from "@/components/DateText";
import DetailBtn from "@/components/DetailBtn";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Button, Modal, notification, Space, Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { KeyedMutator } from "swr";
import BetDetails from "./BetDetails/BetDetails";
import { BetDetailsData, BetTopDetailsData } from "./types";
import { CloseOutlined, HistoryOutlined } from "@ant-design/icons";
import { api } from "@/api/axios";
import useUserStore from "@/store/user.store";
import ColorizeUsername from "@/components/ColorizeUsername";
import BetCouponLog from "./coupon-log/BetCouponLog";

interface Props {
  data: ResPostList['data'];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: KeyedMutator<SWRType<CouponApplicationData[]>>;
}

export interface BetDetailsProp {
  bet_top_details: BetTopDetailsData[];
  bet_details: BetDetailsData[];
}

const List = ({ data, loading, pagination, onHeaderCell, mutate }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [betDetailsOpen, setBetDetailsOpen] = useState<BetDetailsProp | undefined>(undefined);
  const [canelLoading, setCancelLoading]= useState(false);
  const [betId, setBetId]= useState<string | undefined>();

  const handleDetailOpen = (record: CouponApplicationData) => {
    // const {bet_details, bet_top_details} = record;
    const bet_details = JSON.parse(record.bet_details ?? "[]");
    const bet_top_details = JSON.parse(record.bet_top_details ?? "[]");
    if (bet_details && bet_top_details) 
    setBetDetailsOpen({bet_details, bet_top_details})
  };

  const handleCancelApplication = async (id: BetDetailsData['id']) => {
    if (loading) return;
    const {token, userid} = useUserStore.getState();
    setCancelLoading(true);
    try {
      const res = await api.cancelCouponApp({coupon_id: id, userid}, token);
      const {code, message} = res.data;

      if (code == 0) {
        notification.success({message});
        mutate();
      } else {
        notification.error({message});
      }
    } catch (error) {
      console.error();
    } finally {
      setCancelLoading(false);
    }
  };

  const columnsArray: TableProps<CouponApplicationData>["columns"] = [
    // {
    //   title: t("#"),
    //   dataIndex: "id",
    //   key: "id",
    //   align: "center",
    //   render: (value: number) => <CommaNumber value={value} />,
    // },
    {
      title: t("coupon.cp004"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value, record) => (
        <Link to={`/user/${record.user_id}`}><ColorizeUsername username={value} /></Link>
      ),
    },
    {
      title: t("col.name"),
      dataIndex: "user_real_name",
      key: "user_real_name",
      align: "center",
      render: (_, record) => <ColorizeUsername username={record.username} returnRealName />
    },
    {
      title: t("col.eventName"),
      dataIndex: "event_name",
      key: "event_name",
      align: "center",
    },
    {
      title: t("col.betId"),
      dataIndex: "bet_id",
      key: "bet_id",
      align: "center",
    },
    {
      title: t("col.requestDateTime"),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("col.payoutStatus"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value: number) => value === 2 ? i18next.t("moneyType.pay") : i18next.t("moneyType.unpaid"),
    },
    {
      title: t("col.betDetails"),
      dataIndex: "bet_details",
      key: "bet_details",
      align: "center",
      render: (_, record) => <DetailBtn onClick={() => { handleDetailOpen(record) }}
    />,
    },
    {
      title: t("col.manage"),
      key: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space>
          {record.status !== 2 && (
            <>
              <Button size="small" onClick={() => navigate(`/promotion/coupon/create?coupon_name=${record.event_name}&username=${record.username}&system_note=${record.bet_id}&coupon_id=${record.id}`)}>{i18next.t("promotion.couponPay")}</Button>
              <Button 
                size="small" 
                icon={<CloseOutlined />} 
                style={{background: 'var(--ant-color-error)'}}
                onClick={() => handleCancelApplication(record.id)}
                loading={canelLoading}
              />
            </>
          )}
          {record.status === 2 && (
            <Button 
              size="small" 
              icon={<HistoryOutlined />} 
              style={{background: 'var(--ant-color-info)'}}
              onClick={() => setBetId(record.bet_id)}
            />
          )}
        </Space>
      ),
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <>
      <Modal
        open={betDetailsOpen !== undefined}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        centered
        destroyOnClose
        onCancel={() => setBetDetailsOpen(undefined)}
        width={'90%'}
        style={{margin: '1rem auto'}}
      >
        <BetDetails data={betDetailsOpen} />
      </Modal>
      <Modal
        open={betId !== undefined}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        centered
        destroyOnClose
        onCancel={() => setBetId(undefined)}
        width={'90%'}
        style={{margin: '1rem auto'}}
      >
        {betId && (
          <BetCouponLog betId={betId} />
        )}
      </Modal>
      <Table
      sticky
        columns={columns}
        dataSource={data}
        tableLayout="auto"
        rowKey={"id"}
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        loading={loading}
        pagination={pagination}
      />
    </>
  );
};

export default List;
