import { WarningFilled } from "@ant-design/icons";
import styles from "./AdminIpAlertBadge.module.css";

/** ⚠ count shown after the 관리자 로그인 로그 menu label while has_alert is true. */
const AdminIpAlertBadge = ({ count }: { count: number }) => (
  <span className={styles.badge}>
    <WarningFilled />
    {count > 99 ? "99+" : count}
  </span>
);

export default AdminIpAlertBadge;
