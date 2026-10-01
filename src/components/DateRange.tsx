import { DatePicker, Form } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import dayjs, { Dayjs } from "dayjs";
import { CSSProperties, useRef } from "react";
import { useTranslation } from "react-i18next";

export type DateRangeType = [start: Dayjs | null, end: Dayjs | null];

interface Props {
  required?: boolean;
  initialValue?: DateRangeType;
  label?: string;
  showTime?: any;
  size?: SizeType;
  disablePast?: boolean;
  disabled?: boolean;
}

const dateRangeStyle: CSSProperties = {
  width: "100%",
};

const DateRange = ({
  required = false,
  initialValue = [null, null],
  label = "dailyStatistics.ds001",
  showTime,
  size = "small",
  disablePast = false,
  disabled = false
}: Props) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const format = showTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD";
  
  const calendarRange = useRef<DateRangeType>([null, null]);

  const disabledDate = disablePast
    ? (current: Dayjs) => current && current < dayjs().startOf("day")
    : undefined;

  const disabledTime =
    disablePast && showTime
      ? (date: Dayjs | null) => {
          if (date && date.isSame(dayjs(), "day")) {
            const currentHour = dayjs().hour();
            const currentMinute = dayjs().minute();
            const currentSecond = dayjs().second();

            return {
              disabledHours: () =>
                Array.from({ length: 24 }, (_, i) => i).filter(
                  (i) => i < currentHour
                ),
              disabledMinutes: (selectedHour: number) =>
                selectedHour === currentHour
                  ? Array.from({ length: 60 }, (_, i) => i).filter(
                      (i) => i < currentMinute
                    )
                  : [],
              disabledSeconds: (selectedHour: number, selectedMinute: number) =>
                selectedHour === currentHour && selectedMinute === currentMinute
                  ? Array.from({ length: 60 }, (_, i) => i).filter(
                      (i) => i < currentSecond
                    )
                  : [],
            };
          }

          return {};
        }
      : undefined;

  return (
    <Form.Item
      label={t(label)}
      rules={[
        {
          required: required,
          message: t("dailyStatistics.ds017"),
        },
      ]}
      name={["dateRange"]}
      initialValue={initialValue}
      style={dateRangeStyle}
    >
      <DatePicker.RangePicker
        size={size}
        showTime={showTime}
        format={format}
        style={dateRangeStyle}
        disabledDate={disabledDate}
        disabledTime={disabledTime}
        disabled={disabled}
        onCalendarChange={(dates) => {
          calendarRange.current = dates;
        }}
        onOk={() => {
          const [start, end] = calendarRange.current;
          if (start && end) {
            form.setFieldValue("dateRange", [
              start,
              showTime ? end : end.endOf("day"),
            ]);
          }
        }}
      />
    </Form.Item>
  );
};

export default DateRange;
