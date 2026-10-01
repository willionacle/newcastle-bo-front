import i18next from "@/i18n/i18n";
import {
  WithdrawDetailTopinfoData,
  WithdrawalDetailTopInfoBody,
} from "@/api/withdrawal-detail/post";
import CommaNumber from "@/components/CommaNumber";
import DateRange from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Button, Col, Flex, Form, Row, Spin } from "antd";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useEffect } from "react";

interface Props {
  startDate: undefined | string | null;
  endDate: null | string | undefined;
  lastDepositDate: null | string | undefined;
  data: WithdrawDetailTopinfoData | undefined;
  loading: boolean;
  setFilter: Dispatch<SetStateAction<WithdrawalDetailTopInfoBody>>;
}

const TopInfo = ({
  startDate,
  endDate,
  data,
  setFilter,
  lastDepositDate,
}: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      dateRange: [
        startDate ? dayjs(startDate) : null,
        endDate ? dayjs(endDate) : null,
      ],
    });
  }, [startDate, endDate]);

  const handleSubmit = (e: any) => {
    setFilter((old) => ({
      ...old,
      gte: e.dateRange ? e.dateRange[0]?.tz().format() : undefined,
      lte: e.dateRange ? e.dateRange[1]?.tz().format() : undefined,
    }));

    console.log("submit");
  };

  return (
    <>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col {...filterColProps}>
            <DateRange showTime />
          </Col>

          <Col
            {...filterColProps}
            style={{
              alignSelf: "center",
            }}
          >
            <SearchBtn size="small" />

            <Button
              size="small"
              htmlType="button"
              style={{
                marginLeft: "0.2rem",
              }}
              onClick={() => {
                form.setFieldsValue({
                  dateRange: [
                    lastDepositDate ? dayjs(lastDepositDate) : null,
                    endDate ? dayjs(endDate) : null,
                  ],
                });

                form.submit();
              }}
            >
              최근입금완료일
            </Button>
          </Col>
        </Row>
      </Form>

      {data ? (
        <Flex gap={16} wrap="wrap">
          <Flex style={{ width: "16%" }} vertical>
            <p>{i18next.t("payment.casinoBet")}</p>
            <p>{data.C.sum.toLocaleString()}</p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>{i18next.t("payment.slotBet")}</p>
            <p>{data.S.sum.toLocaleString()}</p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>{i18next.t("payment.sportsBet")}</p>
            <p>{data.SP.sum.toLocaleString()}</p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>{i18next.t("payment.minigameBet")}</p>
            <p>{data.M.sum.toLocaleString()}</p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>{i18next.t("payment.totalBet")}</p>
            <p>
              {(
                data.C.sum +
                data.S.sum +
                data.SP.sum +
                data.M.sum
              ).toLocaleString()}
            </p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>{i18next.t("payment.casinoWin")}</p>
            <p>
              <CommaNumber value={data.C.win} onlyNumber />
            </p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>{i18next.t("payment.slotWin")}</p>
            <p>
              <CommaNumber value={data.S.win} onlyNumber />
            </p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>{i18next.t("payment.sportsWin")}</p>
            <p>
              <CommaNumber value={data.SP.win} onlyNumber />
            </p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>{i18next.t("payment.minigameWin")}</p>
            <p>
              <CommaNumber value={data.M.win} onlyNumber />
            </p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>{i18next.t("payment.totalWin")}</p>
            <CommaNumber
              value={data.C.win + data.S.win + data.SP.win + data.M.win}
              onlyNumber
            />
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>{i18next.t("payment.casinoBetCount")}</p>
            <p>{data.C.count.toLocaleString()}</p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>{i18next.t("payment.slotBetCount")}</p>
            <p>{data.S.count.toLocaleString()}</p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>{i18next.t("payment.sportsBetCount")}</p>
            <p>{data.SP.count.toLocaleString()}</p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>{i18next.t("payment.minigameBetCount")}</p>
            <p>{data.M.count.toLocaleString()}</p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>{i18next.t("payment.totalGameCount")}</p>
            <p>
              {(
                data.C.count +
                data.S.count +
                data.SP.count +
                data.M.count
              ).toLocaleString()}
            </p>
          </Flex>
        </Flex>
      ) : (
        <Spin />
      )}
    </>
  );
};

export default TopInfo;
