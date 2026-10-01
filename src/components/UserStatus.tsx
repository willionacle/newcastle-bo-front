import { useTranslation } from "react-i18next";

// type Status =
//   | "ACTIVE"
//   | "ROYALBLACK"
//   | "DEACTIVATED"
//   | "SUSPENDED"
//   | "UNVERIFIED"
//   | "OBSERVATION";

type Status =  string;

interface Props {
  status: Status;
}

export default function UserStatus({ status }: Props) {
  const { t } = useTranslation();

  const statusMap: Record<Status, React.ReactNode> = {
    ACTIVE: t("memberInfoEdit.mie010"),
    ROYALBLACK: t("memberInfo.royalBlack"),
    DEACTIVATED: t("memberInfoEdit.mie013"),
    SUSPENDED: (
      <span style={{ color: "var(--ant-color-error)" }}>
        {t("memberInfoEdit.mie012")}
      </span>
    ),
    UNVERIFIED: t("memberInfoEdit.mie034"),
    OBSERVATION: (
      <span style={{ color: "blue" }}>{t("memberInfo.mi036")}</span>
    ),
  };

  return <>{statusMap[status] ?? status}</>;
}