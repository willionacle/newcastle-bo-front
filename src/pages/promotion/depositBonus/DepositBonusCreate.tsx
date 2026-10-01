import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import { useTranslation } from "react-i18next";
import DepositBonusForm from "./DepositBonusForm";
import { useParams } from "react-router-dom";
import useGetItemData from "@/hooks/useGetItemData";
import { useEffect } from "react";

const DepositBonusCreate = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  // const { data } = findDepositBonusesAPI(id);

  const {data, getItem} = useGetItemData({
    id: id
  }, 'getDepositBonus')

  useEffect(() => {
    getItem()
  }, [])

  return (
    <Card>
      <Breadcrumb
        replace={
          id
            ? t("depositBonusDetail.dbe000-2")
            : t("depositBonusDetail.dbe000-1")
        }
      />
      <Divider />
      <DepositBonusForm data={data} />
    </Card>
  );
};

export default DepositBonusCreate;
