import i18next from "@/i18n/i18n";
import DateText from "@/components/DateText";
import EditBtn from "@/components/EditBtn";
import { OnHeaderCellType } from "@/hooks/useSort";
import { notification, Space, Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import CommaNumber from "@/components/CommaNumber";
// import { updateMissionCouponAPI } from "@/api/daily-mission/mission-coupon/put";
import { useParams } from "react-router-dom";
import { MissionCouponItem } from "@/api/daily-mission/mission-coupon/get";
// import TrueFalseStatus from "@/components/TrueFalseStatus";
import DeleteBtn from "@/components/DeleteBtn";
import { deleteCoupon } from "@/api/daily-mission/delete";

interface Props {
  data: MissionCouponItem[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: any
}

const List = ({ data, loading, pagination, onHeaderCell, mutate }: Props) => {
  const { t } = useTranslation();
  const {type} = useParams();

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteCoupon(id, type)
      if (res.data.code == 0) {
        notification.success({
          message: res.data.message,
          duration: 1,
          type: "success",
        });
        mutate();
      } else {
        notification.success({
          message: res.data.message,
          duration: 1,
          type: "error",
        });
      }
    } catch (error) {}
  }

  // const handleChange = async (e: boolean, record: MissionCouponItem) => {
  //   try {
  //     const reqBody = {
  //       ...record,
  //       is_active: e ? 1 : 0,
  //       created_at: undefined,
  //       updated_at: undefined,
  //       function_name: type === 'coupon' ? undefined : record.function_name,
  //       mission_type: type === 'coupon' ? undefined : record.mission_type
  //     }

  //     console.log(reqBody)

  //     const res = await updateMissionCouponAPI(type, reqBody);
  //     const { data: { code }} = res
  //     if (code === 0) {
  //       notification.success({
  //         message: t("global.success"),
  //         duration: 1,
  //         type: "success",
  //       });
  //       mutate();
  //     } else {
  //       notification.error({
  //         message: t("global.error"),
  //         duration: 1,
  //         type: "success",
  //       });
  //     }
  //   } catch (error) {
  //     notification.error({
  //       message: t("global.fail"),
  //     });
  //   }
  // };

  const columnsArray: TableProps<MissionCouponItem>["columns"] = [
    {
      title: 'No',
      align: "center",
      render: (_value, _record, index) => (pagination.total ?? 0) - (((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100)) - index
    },
    {
      title: t("event.name"),
      dataIndex: type === "mission" ? "name" : "coupon_name",
      key: type === "mission" ? "name" : "coupon_name",
      align: "center",
    },
    {
      title: t("event.missionType"),
      dataIndex: "mission_type",
      key: "mission_type",
      align: "center",
      render: (value) => {
        if(value == "Live Betting") return i18next.t("mission.liveBet")
        if(value == "Slot Betting") return i18next.t("mission.slotBet")
        if(value == "Sports Betting") return i18next.t("mission.sportsBet")
        if(value == "Minigame Betting") return i18next.t("mission.minigameBet")
        return value
      },
    },
    {
      title: t("event.missionClearAmountOrAction"),
      dataIndex: type === "mission" ? "amount" : "coupon_amount",
      key: type === "mission" ? "amount" : "coupon_amount",
      align: "center",
      render: (value) => <CommaNumber value={value} />,
    },
    // {
    //   title: t("백분율"),
    //   dataIndex: type === "mission" ? "percentage" : "coupon_percentage",
    //   key: type === "mission" ? "percentage" : "coupon_percentage",
    //   align: "center",
    //   render: (value) => <CommaNumber value={value} isPercentage />,
    // },
    // {
    //   title: t("col.inUse"),
    //   dataIndex: "is_used",
    //   key: "is_used",
    //   align: "center",
    //   render: (value: boolean) => <TrueFalseStatus value={value} text />,
    // },
    {
      title: t("event.registeredDate"),
      dataIndex: "created_at",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("event.couponContent"),
      dataIndex: "coupon_content",
      key: "coupon_content",
      align:"center",
      render: (value: string) => <>{value ?? "-"}</>,
      hidden:type === 'mission',
    },
    {
      title: t("global.action"),
      key: "action",
      align: "center",
      fixed: "right",
      render: (_value, record) => (
        <Space>
          {/* {type === 'mission' && (
            <Switch
              value={record.is_active as unknown as boolean}
              onChange={(e) => handleChange(e, record)}
            />
          )} */}
          <EditBtn link={`/event/mission-coupon-setting/${type}/edit/${record.id}`} />
          
          <DeleteBtn
            handleDelete={() => handleDelete(record.id ?? 0)}
          />
        </Space>
      ),
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  const newColumns = type === 'coupon' ? 
    columns.filter(item =>  item.key !== 'mission_type') : 
    columns.filter(item =>  item.key !== 'is_used')

  return (
    <div>
      <Table
        sticky
        columns={newColumns}
        dataSource={data}
        loading={loading}
        rowKey={"id"}
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        tableLayout="auto"
        pagination={pagination}
      />
    </div>
  );
};

export default List;
