import { User } from "@/api/users/get";
import AdjustmentTypeRadio from "@/components/AdjustmentTypeRadio";
import DateRange, { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row } from "antd";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

// const types = [
//   "DEPOSIT",
//   "WITHDRAW",
//   "MANUAL",
//   "COUPON",
//   "DEBIT",
//   "CREDIT",
//   "BET",
//   "CANCEL",
// ];

interface Props {
  setFilter: Dispatch<SetStateAction<any | undefined>>;
  username: User["username"];
}

interface FormData {
  dateRange: DateRangeType;
  adminId: string;
  type: string;
  systemNote: string;
}

const Filter = ({ setFilter, username }: Props) => {
  const { t } = useTranslation();

  const handleSubmit = (e: FormData) => {
    setFilter({
      username: {
        $eq: username,
      },
      createdAt: e.dateRange
        ? {
            $gt: e.dateRange[0]?.tz().format(),
            $lt: e.dateRange[1]?.tz().format(),
          }
        : undefined,
      adminId:
        e.adminId !== ""
          ? {
              $contains: e.adminId,
            }
          : undefined,
      type:
        e.type !== ""
          ? {
              $eq: e.type,
            }
          : undefined,

      systemNote:
        e.systemNote !== ""
          ? {
              $contains: e.systemNote,
            }
          : undefined,
    });
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        {/* <Col {...filterColProps}>
          <Form.Item label={t("memberDetail.mis029")} name={["type"]}>
            <Select
              size="small"
              options={types.map((item, index) => ({
                label: t(
                  `memberDetail.mis${String(30 + index).padStart(3, "0")}`
                ),
                value: item,
              }))}
              allowClear
              mode="multiple"
            />
          </Form.Item>
        </Col> */}

        <Col {...filterColProps}>
          <DateRange />
        </Col>

        <Col {...filterColProps}>
          <Form.Item
            label={t("memberDetail.mis029")}
            name={"adminId"}
            initialValue={""}
          >
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <AdjustmentTypeRadio />
        </Col>

        <Col {...filterColProps}>
          <Form.Item
            label={t("memberDetail.mis042")}
            name={"systemNote"}
            initialValue={""}
          >
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps} style={{ alignSelf: "center" }}>
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
