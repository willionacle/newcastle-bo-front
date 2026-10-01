import { WithdrawalDetailBetBody } from "@/api/withdrawal-detail/post";
import DateRange, { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import gameList from "@/pages/betting/record/gameList";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Row } from "antd";
import { SelectProps } from "antd/lib";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useEffect } from "react";
// import { useTranslation } from "react-i18next";

interface Props {
  setFilter: Dispatch<SetStateAction<WithdrawalDetailBetBody>>;
  startDate: undefined | string | null;
  endDate: null | string | undefined;
}

interface FormData {
  dateRange: DateRangeType;
  vendorKey?: string;
  gameKey?: string;
  betId?: string;
}

const BettingFitler = ({ startDate, endDate, setFilter }: Props) => {
  // const { t } = useTranslation();
  const vendorOptions: SelectProps["options"] = [];
  const [form] = Form.useForm<FormData>();

  for (const key in gameList) {
    vendorOptions.push({
      label: gameList[key],
      value: key,
    });
  }

  useEffect(() => {
    form.setFieldsValue({
      dateRange: [
        startDate ? dayjs(startDate) : null,
        endDate ? dayjs(endDate) : null,
      ],
    });
  }, [startDate, endDate]);

  const handleSubmit = (e: FormData) => {
    setFilter((old) => ({
      ...old,
      gte: e.dateRange ? e.dateRange[0]?.tz().format() : undefined,
      lte: e.dateRange ? e.dateRange[1]?.tz().format() : undefined,
      betId: e.betId,
      gameKey: e.gameKey,
      vendorKey: e.vendorKey,
    }));
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <DateRange showTime />
        </Col>

        {/* <Col {...filterColProps}>
          <Form.Item
            label={t("memberDetail.mis053")}
            name={"vendorKey"}
            initialValue={""}
          >
            <Select size="small" options={vendorOptions} allowClear />
          </Form.Item>
        </Col> */}

        {/* <Col {...filterColProps}>
          <Form.Item label="게임" name="gameKey">
            <Input size="small" allowClear />
          </Form.Item>
        </Col> */}

        {/* <Col {...filterColProps}>
          <Form.Item label="ID" name={"betId"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col> */}

        <Col {...filterColProps} style={{ alignSelf: "center" }}>
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default BettingFitler;
