import { Flex, Spin, Typography } from "antd";
import { breadcrumbTitleWrapperStyle } from "@/components/BreadcrumbStyle";
import { betCouponLogAPI } from "@/api/coupon/post";
import BetCouponDescription from "./BetCouponDescription";


interface Props {
  betId: string;
}

const BetCouponLog = ({betId}: Props) => {
  const { data, isLoading } = betCouponLogAPI({ system_note: betId})
  
  return (
    <>
      <Typography.Text strong style={{...breadcrumbTitleWrapperStyle, marginBottom: '1rem'}}>
        쿠폰지급리스트
      </Typography.Text>
      {isLoading ? (
        <Flex justify="center">
          <Spin />
        </Flex>
      ) : (
        <BetCouponDescription data={data?.data} />
      )}
    </>
  );
};

export default BetCouponLog;