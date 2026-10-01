import React from "react";
import { useTranslation } from "react-i18next";

interface MemberStatusProps {
  value: string | null | undefined;
}

const MemberStatus: React.FC<MemberStatusProps> = ({ value }) => {
  const { t } = useTranslation();

  if (!value) return <span>-</span>;

  const statusMap: Record<string, React.ReactNode> = {
    ACTIVE: t("memberInfoEdit.mie010"),
    ROYALBLACK: t("memberInfo.royalBlack"),
    DEACTIVATED: t("memberInfoEdit.mie013"),
    UNVERIFIED: t("memberInfoEdit.mie034"),
    SUSPENDED: (
      <span style={{ color: "var(--ant-color-error)" }}>
        {t("memberInfoEdit.mie012")}
      </span>
    ),
    OBSERVATION: (
      <span style={{ color: "blue" }}>
        {t("memberInfo.mi036")}
      </span>
    ),
  };

  return <>{statusMap[value] || value}</>;
};

export default MemberStatus;