import { Typography } from "antd";
import { BetDetailsProp } from "../List";
import BetDetail from "./tables/BetDetail"
import { breadcrumbTitleWrapperStyle } from "@/components/BreadcrumbStyle";
import BetTopDetail from "./tables/BetTopDetail";


interface Props {
  data?: BetDetailsProp;
}

const BetDetails = ({data}: Props) => {
  return (
    <>
      <Typography.Text strong style={{...breadcrumbTitleWrapperStyle, marginBottom: '1rem'}}>
        세부정보
      </Typography.Text>
      <BetTopDetail data={data?.bet_top_details} />
      <BetDetail data={data?.bet_details}  />
    </>
  );
};

export default BetDetails;