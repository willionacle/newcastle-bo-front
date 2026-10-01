import i18next from "@/i18n/i18n";
import { deleteCoupons } from "@/api/coupon/delete";
import { CouponData, CouponListType } from "@/api/coupon/get";
import { ResPostList } from "@/api/types";
import ColorizeUsername from "@/components/ColorizeUsername";
import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import DeleteBtn from "@/components/DeleteBtn";
import DetailBtn from "@/components/DetailBtn";
import TrueFalseStatus from "@/components/TrueFalseStatus";
import { OnHeaderCellType } from "@/hooks/useSort";
import { GF } from "@/utils/GlobalFunctions";
import { Space, Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { KeyedMutator } from "swr";

interface Props {
  data: ResPostList["data"];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: KeyedMutator<CouponListType>;
  totals?: any
}

const List = ({ data, loading, pagination, onHeaderCell, mutate, totals }: Props) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isUserTab = pathname.includes("user");

  const columnsArray: TableProps<CouponData>["columns"] = [
    // {
    //   title: t("#"),
    //   dataIndex: "id",
    //   key: "id",
    //   align: "center",
    //   render: (value: number) => <CommaNumber value={value} />,
    // },
    {
      title: "No",
      align: "center",
      render: (_value, _record, index) =>
        (pagination.total ?? 0) -
        ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100) -
        index,
    },
    {
      title: t("coupon.cp004"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value, record) => (
        <Link to={`/user/${record.user_id}`}><ColorizeUsername username={value} /></Link>
      ),
      hidden:isUserTab
    },
    {
      title: t("memberInfo.mi035"),
      dataIndex: "user_grade",
      key: "user_grade",
      align: "center",
      render: (value) => GF.handleGradeStrVal(value),
      hidden:isUserTab
    },
    {
      title: t("coupon.cp008"),
      dataIndex: "coupon_name",
      key: "coupon_name",
      align: "center",
    },
    {
      title: t("coupon.cp003"),
      dataIndex: "is_used",
      key: "is_used",
      align: "center",
      render: (value: boolean) => <TrueFalseStatus value={value} text />,
    },
    {
      title: t("coupon.cp009"),
      dataIndex: "system_note",
      key: "system_note",
      align: "center",
      width:"300px",
      render: (value: string) => <span>{value}</span>,
    },
    {
      title: t("coupon.cp010"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: t("coupon.cp011"),
      dataIndex: "expired_date",
      key: "expired_date",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("col.payoutDateTime"),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("col.usedDateTime"),
      dataIndex: "updated_at",
      key: "updated_at",
      align: "center",
      render: (value: string, record) =>
        record.is_used ? <DateText date={value} timeStamp /> : "",
    },
    {
      title: t("coupon.cp014"),
      dataIndex: "created_by",
      key: "created_by",
      align: "center",
      hidden: isUserTab
    },
    {
      title: t("global.action"),
      key: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space>
          {!isUserTab && (
            <DetailBtn link={`/user/${record.user_id}`} />
          )}
          {!record.is_used && (
            <DeleteBtn
              handleDelete={async () => {
                if (await deleteCoupons(record.id)) {
                  mutate();
                }
              }}
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
    <Table
      sticky
      columns={columns}
      dataSource={data}
      tableLayout="auto"
      rowKey={"id"}
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      loading={loading}
      pagination={pagination}
      summary={() => {
        return totals && (
          <Table.Summary fixed='top'>
            <Table.Summary.Row className="font-bold" style={{backgroundColor: '#f0f1f7'}}>
              <Table.Summary.Cell index={0} colSpan={6} align="right">{i18next.t("col.total")}</Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="center">
                <CommaNumber value={totals?.total} onlyNumber />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} colSpan={5}></Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )
      }}
    />
  );
};

export default List;
