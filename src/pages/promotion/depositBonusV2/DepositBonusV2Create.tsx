import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import DepositBonusV2Form from "./DepositBonusV2Form";
import { useParams } from "react-router-dom";
import { findDepositBonusV2API } from "@/api/deposit-bonuses-v2/get";

const DepositBonusV2Create = () => {
  const { id } = useParams();
  const { data, isLoading } = findDepositBonusV2API(id);

  return (
    <Card>
      <Breadcrumb
        replace={
          id
            ? i18next.t("promotion.depositBonusV2Edit")
            : i18next.t("promotion.depositBonusV2Create")
        }
      />
      <Divider />
      {isLoading && id ? (
        <div style={{ textAlign: "center", padding: "50px" }}>{i18next.t("promotion.loading")}</div>
      ) : (
        <DepositBonusV2Form data={data} />
      )}
    </Card>
  );
};

export default DepositBonusV2Create;
