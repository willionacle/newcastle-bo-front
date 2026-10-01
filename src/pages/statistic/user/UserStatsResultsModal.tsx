import { Alert, Divider, Modal } from "antd";
import { useTranslation } from "react-i18next";
import Total from "./Total";
import List from "./List";
import ModalFilter from "./ModalFilter";
import ModalGameCategoryBtn from "./component/ModalGameCategoryBtn";
import { MAX_USERNAMES_FILTER, useUserDailyStatsModal } from "@/api/cs-statics/user-daily-stats";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Comma-joined usernames whose period stats are shown. */
  usernames: string;
  startDate?: string | null;
  endDate?: string | null;
  /** The drill-down source cut the user list at its cap; stats cover only the first users. */
  truncated?: boolean;
  title?: string;
}

/** 유저기간별통계 restricted to a given set of users, fully local state (no URL params). */
const UserStatsResultsModal = ({ open, onClose, usernames, startDate, endDate, truncated, title }: Props) => {
  const { t } = useTranslation();
  const { swr, onHeaderCell, paginationProps, filters, applyFilters, setGameCategory } =
    useUserDailyStatsModal({ usernames, startDate, endDate });

  const userCount = usernames ? usernames.split(",").length : 0;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="95%"
      title={title ?? t("sidemenu.sm004", "유저기간별통계")}
      destroyOnClose
    >
      {truncated && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 12 }}
          message={t(
            "combinedUsage.truncatedNotice",
            "대상 유저가 너무 많아 상위 {{max}}명까지만 표시됩니다.",
            { max: MAX_USERNAMES_FILTER.toLocaleString() }
          )}
          description={t("combinedUsage.userCountShown", "표시 대상: {{n}}명", {
            n: userCount.toLocaleString(),
          })}
        />
      )}
      <ModalFilter applyFilters={applyFilters} startDate={startDate} endDate={endDate} />
      <Divider />
      <ModalGameCategoryBtn
        value={filters.game_category}
        onChange={setGameCategory}
        loading={swr.isLoading}
      />
      <Total total={swr.data?.totals} loading={swr.isLoading} gameCategory={filters.game_category} />
      <Divider />
      <List
        data={swr.data?.data ?? []}
        loading={swr.isLoading}
        totalItems={swr.data?.totalitems || 0}
        onHeaderCell={onHeaderCell}
        pagination={paginationProps(swr.data?.totalitems)}
        gameCategory={filters.game_category}
      />
    </Modal>
  );
};

export default UserStatsResultsModal;
