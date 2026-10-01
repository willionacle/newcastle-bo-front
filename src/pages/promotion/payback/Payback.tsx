import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider } from "antd";
import PaybackForm from "./PaybackForm";
// import List from "./List";

const Payback = () => {
  return (
    <Card>
      <Breadcrumb />
      <Divider />
      {/* <List /> */}
      <PaybackForm />

      <Divider />

      <div style={{ marginTop: "20px" }}>
        <h2>{i18next.t("promotion.paybackGuide")}</h2>

        <p>{i18next.t("promotion.paybackGuide1")}</p>

        <p>
          타입 : 입금-출금 ( 매주 월요일 00:00:00 부터 일요일 23:59:59 사이의
          입출금 차액)
        </p>

        <p>
          지급형식 : 매주 월요일 00시10분에 지난주 페이백지급리스트가
          자동업로드됨, 여기서 자동/수동 지급 선택하면됨
        </p>

        <p>{i18next.t("promotion.paybackGuide2")}</p>

        <p>
          지급방식 : 페이백포인트로 지급 또는 쿠폰으로 지급 두가지 선택가능 (
          유저페이지에서만 구분되는데 페이백포인트는 내역없이 그냥 적립만 됨 ;
          쿠폰은 쿠폰상세에 내역이 뜸)
        </p>

        <p>
          회원선택 : 선택된 레벨만 레벨설정에 따라 지급됨 (여기서 1레벨이 체크가
          안된경우 레벨설정에서 페이백%가 설정되어도 지급되지 않음)
        </p>
      </div>
    </Card>
  );
};

export default Payback;
