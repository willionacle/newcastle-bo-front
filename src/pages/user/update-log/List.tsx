import { Table, TableProps, Typography } from "antd";
import i18next from "@/i18n/i18n";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import DateText from "@/components/DateText";
import ColorizeUsername from "@/components/ColorizeUsername";
import { UserUpdateLogItem } from "@/api/user-update-log/get";

const { Text } = Typography;

interface Props {
  data: UserUpdateLogItem[];
  loading: boolean;
  onHeaderCell: any;
  pagination: any;
  hideUserColumns?: boolean;
}

// 컬럼 그룹 한글 매핑 함수
const getColumnGroupKorean = (columnGroup: string): string => {
  const groupMapping: Record<string, string> = {
    'rollingGroup': i18next.t("user.rollingPointSetting"),
    'lossingGroup': i18next.t("user.paybackPointSetting"),
    'levelGroup': i18next.t("sidemenu.sm021"),
    'accountGroup': i18next.t("user.accountInfo"),
    'gradeGroup': i18next.t("memberInfoEdit.mie036"),
    'rollingPaymentGroup': i18next.t("col.rollingDeductionSetting"),
  };

  return groupMapping[columnGroup] || getColumnNameKorean(columnGroup);
};

// 컬럼명 한글 매핑 함수
const getColumnNameKorean = (columnName: string): string => {
  const columnMapping: Record<string, string> = {
    'decodePassword': i18next.t("user.password"),
    'phoneNumber': i18next.t("col.phone"),
    'rollingPointType': i18next.t("memberDetail.mis139"),
    'rollingCasinoPercentage': i18next.t("user.casinoRollingPct"),
    'rollingSlotPercentage': i18next.t("user.slotRollingPct"),
    'rollingMiniGamePercentage': i18next.t("user.minigameRollingPct"),
    'rollingSportsPercentage': i18next.t("user.sportsRollingPct"),
    'lossingPointType': i18next.t("user.paybackSetting"),
    'lossingPointPercentage': i18next.t("col.paybackPercent"),
    'levelType': i18next.t("user.levelSetting"),
    'userLevel': i18next.t("user.userLevel"),
    'agentUsername': i18next.t("col.agent"),
    'wWalletAddress': i18next.t("user.walletAddress"),
    'accountName': i18next.t("user.accountHolderName"),
    'accountNumber': i18next.t("col.accountNumber"),
    'bankName': i18next.t("col.bankName"),
    'localGradeConfig': i18next.t("sidemenu.gradeSettings"),
    'userGrade': i18next.t("col.grade"),
    'referralUsername': i18next.t("col.referrer"),
    'inUse': i18next.t("col.inUse"),
    'rollingPaymentOnoff': i18next.t("col.rollingDeductionSetting"),
    'rollingPaymentLive': i18next.t("user.casinoDeductPct"),
    'rollingPaymentSlot': i18next.t("user.slotDeductPct"),
    'rollingPaymentSports': i18next.t("user.sportsDeductPct"),
    'rollingPaymentMinigame': i18next.t("user.minigameRollingDeductPct"),
    'rollingPaymentFishing': i18next.t("user.fishingDeductPct"),
    'rollingPaymentBoard': i18next.t("user.boardDeductPct"),
    'rollingPaymentEtc': i18next.t("user.etcDeductPct"),
  };

  return columnMapping[columnName] || columnName;
};

const extractTypeFromSource = (source: string): string => {
  if (!source) return "";
  const match = source.match(/type=([^)]*)/);
  return match ? match[1] : "";
};

const extractTitleFromSource = (source: string | null): string => {
  if (!source) return "";
  const match = source.match(/title=['"]([^'"]*)['"]/);
  return match ? match[1] : "";
};

const List = ({ data, loading, onHeaderCell, pagination, hideUserColumns }: Props) => {
  const columnsArray: TableProps<UserUpdateLogItem>["columns"] = [
    {
      title: "No",
      align: "center",
      width: 60,
      render: (_value, _record, index) =>
        (pagination.total ?? 0) -
        ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100) -
        index,
    },
    {
      title: i18next.t("col.username"),
      dataIndex: "username",
      key: "username",
      align: "center",
      width: 120,
      render: (value) => <ColorizeUsername username={value} />,
    },
    {
      title: i18next.t("col.name"),
      dataIndex: "userRealName",
      key: "userRealName",
      align: "center",
      width: 120,
    },
    {
      title: i18next.t("title.categoryName"),
      dataIndex: "columnGroup",
      key: "columnGroup",
      align: "center",
      width: 180,
      render: (value, record) => {
        const groupName = getColumnGroupKorean(value);

        if (record?.source?.startsWith("TRG")) {
          const type = extractTypeFromSource(record.source);
          return type ? `${type} ${groupName}` : groupName;
        }

        return groupName;
      },
    },
    {
      title: i18next.t("title.changeDetails"),
      key: "changes",
      align: "left",
      width: 400,
      render: (_value, record) => {
        if (!record.changes || record.changes.length === 0) {
          return <Text type="secondary">{i18next.t("user.noChanges")}</Text>;
        }

        return (
          <div style={{ padding: "4px 0" }}>
            {record.changes.map((change, index) => {
              const columnNameKorean = getColumnNameKorean(change.columnName);
              const isInUse = change.columnName === "inUse";
              const title = isInUse ? extractTitleFromSource(record.source) : "";

              // Boolean 값 처리 함수
              const renderValue = (value: string | null, showTitle: boolean = false) => {
                if (value === "1") {
                  const icon = <CheckCircleFilled style={{ color: "#52c41a", fontSize: 16, marginLeft: 4 }} />;
                  return showTitle && isInUse && title ? <>{title} {icon}</> : icon;
                }
                if (value === "0") {
                  const icon = <CloseCircleFilled style={{ color: "#f5222d", fontSize: 16, marginLeft: 4 }} />;
                  return showTitle && isInUse && title ? <>{title} {icon}</> : icon;
                }
                return value || "-";
              };

              return (
                <div key={index} style={{ marginBottom: index < record.changes.length - 1 ? 8 : 0 }}>
                  <Text strong>{columnNameKorean}</Text>
                  {": "}
                  <Text type="secondary">{renderValue(change.oldValue, true)}</Text>
                  {" → "}
                  <Text style={{ color: "#1890ff", fontWeight: 500 }}>{renderValue(change.newValue, false)}</Text>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: i18next.t("col.processedBy"),
      dataIndex: "adminUsername",
      key: "adminUsername",
      align: "center",
      width: 120,
    },
    {
      title: i18next.t("title.changeDateTime"),
      dataIndex: "changedAt",
      key: "changedAt",
      align: "center",
      width: 180,
      render: (value) => <DateText date={value} timeStamp />,
    },
  ];

  // 회원 상세 탭처럼 이미 한 회원으로 고정된 화면에서는 아이디/이름 컬럼을 숨긴다
  const visibleColumns = hideUserColumns
    ? columnsArray.filter((item) => !["username", "userRealName"].includes(item.key as string))
    : columnsArray;

  const columns = visibleColumns.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <Table
      sticky
      dataSource={data}
      loading={loading}
      columns={columns}
      rowKey="requestId"
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
