import { withdrawalBetSummaryAPI } from "@/api/withdrawal-detail/post";
import i18next from "@/i18n/i18n";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Button, Col, Form, Modal, Row } from "antd";
import dayjs from "dayjs";
// import { stringify } from "qs";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import List from "./List";
import { ResUser } from "@/api/types";
import DateRangeTagCustom from "./component/DateRangeTagCustom";
import MoneyLog from "../moneyLog/MoneyLog";
import WithdrawalFormulaHeader from "./component/WithdrawFormulaHeader";

interface Props {
  username: string | undefined;
  lastDepositDate?: any;
  lastWithdrawRequestDate?: any;
  endDate?: any;
  id?: number;
  selectedDate?: string;
  user?: ResUser["data"] | undefined;
}

const MoneyInfo = ({
  username,
  user,
  lastDepositDate,
  lastWithdrawRequestDate,
}: Props) => {
  const [form] = Form.useForm();
  const [startDate, setStartDate] = React.useState<string | undefined>();
  const [endDateValue, setEndDateValue] = React.useState<string | undefined>();
  const betSummarySwr = withdrawalBetSummaryAPI(
    username,
    startDate,
    endDateValue,
  );
  const { pathname } = useLocation();
  const [moneyLogModal, setMoneyLogModalOpen] = useState(false);

  const handleSubmit = () => {
    const dateRange = form.getFieldValue("dateRange");
    if (dateRange && dateRange[0] && dateRange[1]) {
      // Format dates as "YYYY-MM-DD HH:mm:ss"
      const start = dayjs(dateRange[0]).format("YYYY-MM-DD HH:mm:ss");
      const end = dayjs(dateRange[1]).format("YYYY-MM-DD HH:mm:ss");
      setStartDate(start);
      setEndDateValue(end);
    } else {
      // Clear dates to fetch all data
      setStartDate(undefined);
      setEndDateValue(undefined);
    }
  };

  return (
    <>
      <Modal
        open={moneyLogModal}
        title={i18next.t("memberDetail.mis027")}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        centered
        destroyOnClose
        onCancel={() => setMoneyLogModalOpen(false)}
        width={1600}
        styles={{
          body: {
            maxHeight: "80vh",
            overflowY: "auto",
            overflowX: "hidden",
          },
        }}
      >
        <MoneyLog
          lastDepositDate={lastDepositDate}
          lastWithdrawRequestDate={lastWithdrawRequestDate}
          user={user}
        />
      </Modal>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col {...filterColProps}>
            <DateRangeTagCustom
              user={user}
              lastDepositDate={lastDepositDate}
              lastWithdrawRequestDate={
                betSummarySwr?.data?.data?.lastWithdrawRequestDate
              }
              showTime
            />
          </Col>

          <Col
            {...filterColProps}
            style={{
              alignSelf: "center",
            }}
          >
            <SearchBtn size="small" />
            {pathname.includes("/payment") && (
              <Button
                size="small"
                htmlType="button"
                style={{
                  marginLeft: "0.2rem",
                }}
                onClick={() => {
                  setMoneyLogModalOpen(true);
                }}
              >
                {i18next.t("memberDetail.mis027")}
              </Button>
            )}
          </Col>
          <Col span={12}>
            <WithdrawalFormulaHeader
              betSummaryData={betSummarySwr.data?.data}
            />
          </Col>
        </Row>
      </Form>
      <List
        betSummaryData={betSummarySwr.data?.data}
        loading={betSummarySwr.isLoading}
      />
    </>
  );
};

export default MoneyInfo;
