import { deleteDepositBonusV2 } from "@/api/deposit-bonuses-v2/delete";
import i18next from "@/i18n/i18n";
import {
  DepositBonusV2Data,
  DepositBonusV2ListResponse,
} from "@/api/deposit-bonuses-v2/get";
import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import DeleteBtn from "@/components/DeleteBtn";
import EditBtn from "@/components/EditBtn";
import TrueFalseStatus from "@/components/TrueFalseStatus";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps, Tag } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface Props {
  data: DepositBonusV2ListResponse | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: KeyedMutator<DepositBonusV2ListResponse>;
}

const GRADE_LABELS: Record<number, string> = {
  1: i18next.t("grade.bronze"),
  2: i18next.t("grade.silver"),
  3: i18next.t("grade.gold"),
  4: i18next.t("grade.emerald"),
  5: i18next.t("grade.ruby"),
  6: i18next.t("grade.diamond"),
  7: i18next.t("grade.blackDiamond"),
};

const BONUS_TYPE_LABELS: Record<0 | 1 | 2, string> = {
  0: i18next.t("col.level"),
  1: i18next.t("col.grade"),
  2: i18next.t("promotion.levelPlusGrade"),
};

const ListV2 = ({ data, loading, onHeaderCell, pagination, mutate }: Props) => {
  const { t } = useTranslation();

  const handleDelete = async (id: number) => {
    if (await deleteDepositBonusV2(id)) {
      mutate();
    }
  };

  const columnsArray: TableProps<DepositBonusV2Data>["columns"] = [
    {
      title: "No",
      align: "center",
      width: 60,
      render: (_value, _record, index) => {
        const total = data?.data?.pagination?.totalItems ?? 0;
        const current = pagination.current ?? 1;
        const pageSize = pagination.pageSize ?? 20;
        return total - (current - 1) * pageSize - index;
      },
    },
    {
      title: i18next.t("depositBonus.db010"),
      dataIndex: "bonusGroup",
      key: "bonusGroup",
      align: "center",
      width: 120,
    },
    {
      title: t("depositBonus.db002"),
      dataIndex: "bonusName",
      key: "bonusName",
      align: "center",
      width: 150,
    },
    {
      // "Once ever" (welcome) vs "once a day" (첫충) isn't visible from the
      // name alone — badge it. See
      // WELCOME_BONUS_AND_MAINTENANCE_FRONTEND_INTEGRATION.md §16.
      title: t("col.welcomeBonus"),
      dataIndex: "isWelcome",
      key: "isWelcome",
      align: "center",
      width: 90,
      render: (value: boolean | 0 | 1 | null | undefined) =>
        value ? <Tag color="gold">{t("col.welcomeBonus")}</Tag> : "-",
    },
    {
      title: t("depositBonus.db003"),
      dataIndex: "bonusPercentage",
      key: "bonusPercentage",
      align: "center",
      width: 100,
      render: (value: number) => `${value}%`,
    },
    {
      title: t("depositBonus.db004"),
      dataIndex: "minDeposit",
      key: "minDeposit",
      align: "center",
      width: 120,
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: t("depositBonus.db005"),
      dataIndex: "maxAmount",
      key: "maxAmount",
      align: "center",
      width: 120,
      render: (value: number) => <CommaNumber value={value} />,
    },
    {
      title: t("depositBonus.db006"),
      dataIndex: "withdrawalRolling",
      key: "withdrawalRolling",
      align: "center",
      width: 100,
      render: (value: number) => `${value}배`,
    },
    {
      title: i18next.t("title.appliedType"),
      dataIndex: "bonusType",
      key: "bonusType",
      align: "center",
      width: 100,
      render: (value: 0 | 1 | 2) => (
        <Tag color={value === 0 ? "blue" : value === 1 ? "green" : "purple"}>
          {BONUS_TYPE_LABELS[value]}
        </Tag>
      ),
    },
    {
      title: i18next.t("depositBonus.db008"),
      dataIndex: "availableLevels",
      key: "availableLevels",
      align: "center",
      width: 150,
      render: (value: number[]) => {
        if (!value || value.length === 0) return "-";
        return value.sort((a, b) => a - b).join(", ");
      },
    },
    {
      title: i18next.t("title.appliedGrade"),
      dataIndex: "availableGrades",
      key: "availableGrades",
      align: "center",
      width: 200,
      render: (value: number[]) => {
        if (!value || value.length === 0) return "-";
        return value
          .sort((a, b) => a - b)
          .map((grade) => GRADE_LABELS[grade] || grade)
          .join(", ");
      },
    },
    {
      title: t("col.remarks"),
      dataIndex: "systemNote",
      key: "systemNote",
      align: "center",
      width: 150,
      render: (value: string | null) => value ?? "-",
    },
    {
      title: t("depositBonus.db009"),
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      width: 180,
      render: (value) => <DateText date={value} timeStamp />,
    },
    {
      title: t("col.inUse"),
      dataIndex: "inUse",
      key: "inUse",
      align: "center",
      width: 100,
      render: (value: 0 | 1) => <TrueFalseStatus value={value} />,
    },
    {
      title: t("col.displayOrder"),
      dataIndex: "tempOrder",
      key: "tempOrder",
      align: "center",
      width: 100,
    },
    {
      title: t("col.exposureTimeRange"),
      dataIndex: "exposurePeriods",
      key: "exposurePeriods",
      align: "center",
      width: 220,
      render: (value: string | null) => {
        if (!value) return "-";

        try {
          const parsed =
            typeof value === "string" ? JSON.parse(value) : value;

          if (!Array.isArray(parsed) || parsed.length === 0) {
            return "-";
          }

          return parsed.map(
            (item: any) => `${item.startTime} ~ ${item.endTime}`
          ).join(" / ");
        } catch (error) {
          console.error("Invalid exposurePeriods:", error);
          return "-";
        }
      },
    },
    {
      title: t("col.dailyPayoutCount"),
      dataIndex: "dailyLimit",
      key: "dailyLimit",
      align: "center",
      width: 120,
      render: (value: number | null) => value ?? i18next.t("promotion.noLimit"),
    },
    {
      title: t("global.action"),
      align: "center",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            gap: "0.2rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <EditBtn link={`/promotion/deposit-bonus-v2/edit/${record.id}`} />
          <DeleteBtn handleDelete={() => handleDelete(record.id)} />
        </div>
      ),
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <Table
      sticky
      dataSource={data?.data?.items}
      columns={columns}
      loading={loading}
      rowKey="id"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={{
        ...pagination,
        total: data?.data?.pagination?.totalItems ?? 0,
        current: data?.data?.pagination?.currentPage ?? 1,
        pageSize: data?.data?.pagination?.itemsPerPage ?? 20,
      }}
    />
  );
};

export default ListV2;
