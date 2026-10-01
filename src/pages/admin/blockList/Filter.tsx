import DateRange, { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, Row } from "antd";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  setBody: Dispatch<SetStateAction<any | undefined>>;
}

interface FormData {
  dateRange: DateRangeType;
  ip: string;
}

const Filter = ({ setBody }: Props) => {
  const { t } = useTranslation();

  const handleSubmit = (e: FormData) => {
    setBody((prevData: any) => ({
      ...prevData,
      ip: e.ip ? e.ip : '',
      start_date: e.dateRange ? GF.formatDate(e.dateRange[0]?.tz().format(), false) : null,
      end_date: e.dateRange ? GF.formatDate(e.dateRange[1]?.tz().format(), false) : null, 
    }));
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <DateRange showTime={false} />
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("blockips.bi001")} name={"ip"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col
          {...filterColProps}
          style={{
            alignSelf: "center",
          }}
        >
          <SearchBtn block size="small" />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
