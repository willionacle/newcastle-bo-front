import { BetCouponData } from "@/api/coupon/post"
import CommaNumber from "@/components/CommaNumber";
import DateText from "@/components/DateText";
import TrueFalseStatus from "@/components/TrueFalseStatus";
import { Descriptions, DescriptionsProps } from "antd"
import { useTranslation } from "react-i18next";

interface Props {
  data?: BetCouponData
}

const BetCouponDescription = ({ data }: Props) => {
  const { t } = useTranslation();

  const items: DescriptionsProps['items'] = [
    { key: 1, label: 'ID', children: data?.username ?? "-"},
    { key: 2, label: t("coupon.cp008"), children: data?.coupon_name ?? "-"},
    { key: 3, label: t("coupon.cp012"), children: data?.system_note ?? "-"},
    { key: 4, label: t("coupon.cp010"), children: <CommaNumber value={data?.amount} />},
    { key: 5, label: t("coupon.cp003"), children: (data?.is_used !== undefined || data?.is_used !== null) ? <TrueFalseStatus value={data?.is_used === 1 ? true : false} text /> : "-"},
    { key: 6, label: t("coupon.cp011"), children: data?.expired_date ? <DateText date={data.expired_date} timeStamp /> : "-"},
    { key: 7, label: t("col.payoutDateTime"), children: data?.created_at ? <DateText date={data.created_at} timeStamp /> : "-"},
  ]

  return <Descriptions size="small" layout="vertical" items={items} column={4} />
}

export default BetCouponDescription