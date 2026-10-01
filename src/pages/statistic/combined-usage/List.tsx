import i18next from "@/i18n/i18n";
import { Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";
import CommaNumber from "@/components/CommaNumber";
import { OnHeaderCellType } from "@/hooks/useSort";
import { PaginationProps } from "antd/lib";
import { CombinedUsageData } from "@/api/cs-statics/combined-usage";
import { GF } from "@/utils/GlobalFunctions";

interface Props {
  loading: boolean;
  data: CombinedUsageData[] | undefined;
  onHeaderCell: OnHeaderCellType;
  pagination: PaginationProps;
  totals: any;
}

const List = ({ data, loading, onHeaderCell, pagination, totals }: Props) => {
  const { t } = useTranslation();

  const newDataSource =
    data && data.length > 0
      ? data.map((item: CombinedUsageData) => {
          if (item.type === "wheel") {
            return {
              ...item,
              name: GF.handleGradeStrVal(item.grade),
            };
          }
          return item;
        }).filter((item: CombinedUsageData) => {
          // 페이백/추천포인트는 항상 표시 (합계 행)
          if (item.type === "lossing-point-total" || item.type === "referral-point-total") {
            return true;
          }

          if (item.type === "coupon" || item.type === "wheel") {
            const amount = item.amount || 0;
            const usageCount =
              item.type === "wheel" ? item.usage_count : item.usageCount;
            const userCount =
              item.type === "wheel" ? item.user_count : item.userCount;

            if (amount !== 0 || usageCount !== 0 || userCount !== 0) {
              return true;
            }
          } else if (item.type === "bonus") {
            if (
              item.bonusAmount !== 0 ||
              item.depositAmount !== 0 ||
              item.bonusCountApplication !== 0 ||
              item.bonusCountUsed !== 0
            ) {
              return true;
            }
          }
          return false;
        })
      : [];

  const columnsArray: TableProps<CombinedUsageData>["columns"] = [
    {
      title: "No",
      align: "center",
      render: (_value, _record, index) =>
        (newDataSource?.length ?? 0) + 1 - (index + 1),
    },
    {
      title: t("col.category"),
      align: "center",
      render: (_value, record) => {
        if (record.type === "wheel") return i18next.t("storeSetting.ss007");
        if (record.type === "coupon") return i18next.t("topNavi.tn030");
        if (record.type === "bonus") return i18next.t("sidemenu.bonus");
        if (record.type === "lossing-point-total") return i18next.t("sidemenu.payback");
        if (record.type === "referral-point-total") return i18next.t("col.referralPoint");
        return "-";
      },
    },
    {
      title: t("col.couponNameGrade"),
      align: "center",
      render: (_value, record) => {
        if (record.type === "wheel") {
          return GF.handleGradeStrVal(record.grade);
        }
        if (record.type === "coupon") {
          return record.name ?? "-";
        }
        if (record.type === "bonus") {
          return record.bonusName ?? "-";
        }
        if (record.type === "lossing-point-total") {
          return i18next.t("stat.paybackPayout");
        }
        if (record.type === "referral-point-total") {
          return i18next.t("stat.referralPointPayout");
        }
        return "-";
      },
    },
    {
      title: t("col.couponContent"),
      align: "center",
      render: (_value, record) => {
        if (record.type === "coupon") {
          return record.couponContent ?? "-";
        }
        return "-";
      },
    },
    {
      title: t("col.usedBonusAmount"),
      align: "center",
      render: (_value, record) => {
        if (record.type === "coupon" || record.type === "wheel") {
          return <CommaNumber value={record.amount} onlyNumber />;
        }
        if (record.type === "bonus") {
          return <CommaNumber value={record.bonusAmount} onlyNumber />;
        }
        if (record.type === "lossing-point-total" || record.type === "referral-point-total") {
          return <CommaNumber value={record.amount} onlyNumber />;
        }
        return "-";
      },
    },
    {
      title: t("col.depositAmount"),
      align: "center",
      render: (_value, record) => {
        if (record.type === "bonus") {
          return <CommaNumber value={record.depositAmount} onlyNumber />;
        }
        return "-";
      },
    },
    {
      title: t("col.usageCount"),
      align: "center",
      render: (_value, record) => {
        if (record.type === "coupon") {
          return <CommaNumber value={record.usageCount} onlyNumber />;
        }
        if (record.type === "wheel") {
          return <CommaNumber value={record.usage_count} onlyNumber />;
        }
        if (record.type === "bonus") {
          return <CommaNumber value={record.bonusCountApplication} onlyNumber />;
        }
        if (record.type === "lossing-point-total" || record.type === "referral-point-total") {
          return <CommaNumber value={record.usageCount} onlyNumber />;
        }
        return "-";
      },
    },
    {
      title: t("col.usersUsed"),
      align: "center",
      render: (_value, record) => {
        if (record.type === "coupon") {
          return <CommaNumber value={record.userCount} onlyNumber />;
        }
        if (record.type === "wheel") {
          return <CommaNumber value={record.user_count} onlyNumber />;
        }
        if (record.type === "bonus") {
          return <CommaNumber value={record.bonusCountUsed} onlyNumber />;
        }
        if (record.type === "lossing-point-total" || record.type === "referral-point-total") {
          return <CommaNumber value={record.userCount} onlyNumber />;
        }
        return "-";
      },
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <Table
      sticky
      columns={columns}
      dataSource={newDataSource}
      loading={loading}
      rowKey={(record) => {
        if (record.type === "coupon") return `coupon-${record.id}`;
        if (record.type === "wheel") return `wheel-${record.grade}`;
        if (record.type === "bonus") return `bonus-${record.bonusName}`;
        return `unknown-${Math.random()}`;
      }}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
      summary={(_data) => {
        // 표시된 데이터의 카테고리 확인
        const displayedTypes = new Set(newDataSource.map(item => item.type));
        const isSingleCategory = displayedTypes.size === 1;
        const categoryType = isSingleCategory ? Array.from(displayedTypes)[0] : null;

        // 사용유저수 값 결정
        let userCountValue: number | string = "-";
        if (isSingleCategory) {
          if (categoryType === 'coupon' || categoryType === 'wheel') {
            userCountValue = totals?.userCount || 0;
          } else if (categoryType === 'bonus') {
            userCountValue = totals?.bonusCountUsed || 0;
          } else if (categoryType === 'lossing-point-total') {
            userCountValue = totals?.lossingPointUser || 0;
          } else if (categoryType === 'referral-point-total') {
            userCountValue = totals?.referralPointUser || 0;
          }
        }

        return (
          <Table.Summary.Row>
            <Table.Summary.Cell
              index={0}
              colSpan={4}
              align="right"
              className="font-bold"
            >
              {i18next.t("col.total")}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="center">
              <CommaNumber value={
                (totals?.amount || 0) +
                (totals?.bonusAmount || 0) +
                (totals?.lossingPointAmount || 0) +
                (totals?.referralPointAmount || 0)
              } onlyNumber />
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2} align="center">
              <CommaNumber value={totals?.depositAmount || 0} onlyNumber />
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3} align="center">
              <CommaNumber value={
                (totals?.usageCount || 0) +
                (totals?.bonusCountApplication || 0) +
                (totals?.lossingPointCount || 0) +
                (totals?.referralPointCount || 0)
              } onlyNumber />
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4} align="center">
              {typeof userCountValue === 'number' ? (
                <CommaNumber value={userCountValue} onlyNumber />
              ) : (
                userCountValue
              )}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        );
      }}
    />
  );
};

export default List;
