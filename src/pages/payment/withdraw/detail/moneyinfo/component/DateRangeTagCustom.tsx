import { DatePicker, Flex, Form, Tag } from "antd";
import i18next from "@/i18n/i18n";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ResUser } from "@/api/types";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type DateRangeKey = "option_1" | "option_2" | "custom";

interface DateRangeTagProp {
  key: DateRangeKey;
  title: string;
  dateRange: [dayjs.Dayjs | null | any, dayjs.Dayjs | null | any];
}

const DateRangeTagCustom = ({
  showTime,
  required = true,
  user,
  lastWithdrawRequestDate,
  lastDepositDate,
}: {
  showTime?: boolean;
  required?: boolean;
  user: ResUser["data"] | undefined;
  lastWithdrawRequestDate?: string;
  lastDepositDate?: string;
}) => {
  const { t } = useTranslation();
  const [select, setSelect] = useState<DateRangeKey>("option_1");
  const form = Form.useFormInstance();
  const format = showTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD";
  const precision = showTime ? "second" : "day";

  const parse = (date?: string) => (date ? dayjs(date) : null);

  const tagData: DateRangeTagProp[] = useMemo(() => {
    const now = dayjs();
    const endDate =
    parse(lastWithdrawRequestDate) ?? dayjs().endOf("day");
    return [
      {
        key: "option_1",
        title: i18next.t("title.depositToWithdrawTime"),
        dateRange: [parse(lastDepositDate) ?? now, endDate],
      },
      {
        key: "option_2",
        title: i18next.t("title.prevWithdrawToRequest"),
        dateRange: [parse(user?.previous_withdraw_date) ?? now, endDate],
      },
    ];
  }, [user,lastWithdrawRequestDate]);

  const handleDateRangeChange = (values: any) => {
    if (!values || !values[0] || !values[1]) {
      setSelect("custom");
      return;
    }

    let start = dayjs.utc(values[0]);
    let end = dayjs.utc(values[1]);

    // VALIDATION: Swap if start date is after end date
    if (start.isAfter(end)) {
      const temp = start;
      start = end;
      end = temp;
      form.setFieldValue("dateRange", [start, end]);
    }

    const matchedTag = tagData.find((item) => {
      const [tagStart, tagEnd] = item.dateRange;
      return (
        tagStart && tagEnd &&
        start.isSame(tagStart, precision) &&
        end.isSame(tagEnd, precision)
      );
    });
    setSelect(matchedTag ? matchedTag.key : "custom");
  };

  const handleTagChange = (tag: DateRangeTagProp) => {
    let [start, end] = tag.dateRange;

    // VALIDATION: Ensure the range is valid even for preset tags
    if (start && end && start.isAfter(end)) {
      [start, end] = [end, start];
    }

    setSelect(tag.key);
    form.setFieldValue("dateRange", [start, end]);
  };

  // useEffect(() => {
  //   if (user) {
  //     const option1 = tagData.find(t => t.key === "option_1");
  //     let [start, end] = option1?.dateRange || [null, null];

  //     if (start) {
  //       // Apply validation to initial load
  //       if (end && start.isAfter(end)) {
  //           [start, end] = [end, start];
  //       }
        
  //       form.setFieldValue("dateRange", [start, end]);
  //       setSelect("option_1");
  //       form.submit(); 
  //     }
  //   }
  // }, [user, tagData, form]); 

    useEffect(() => {
      const currentVal = form.getFieldValue("dateRange");
      
      if (user && (!currentVal || !currentVal[0])) {
        const option1 = tagData.find(t => t.key === "option_1");
        let [start, end] = option1?.dateRange || [null, null];

        if (start) {
          if (end && start.isAfter(end)) {
              [start, end] = [end, start];
          }
          
          form.setFieldsValue({ dateRange: [start, end] });
          setSelect("option_1");
          form.submit(); 
        }
      }
    }, [user, form]);

  if (!user) return null;

  return (
    <div>
      <Flex align="center" wrap="nowrap" style={{ marginBottom: "7px" }}>
        <span style={{whiteSpace:"nowrap"}}>{t("dailyStatistics.ds001")}</span>
        <Flex style={{ marginLeft: "10px" }}>
          {tagData.map((item) => (
            <Tag.CheckableTag
              key={item.key}
              checked={select === item.key}
              onChange={() => handleTagChange(item)}
            >
              {t(item.title)}
            </Tag.CheckableTag>
          ))}
        </Flex>
      </Flex>

      <Form.Item
        name="dateRange"
        rules={[{ required, message: t("dailyStatistics.ds017") }]}
        style={{ marginBottom: "25px" }}
        key={lastDepositDate}
      >
        <DatePicker.RangePicker
          size="small"
          showTime={showTime}
          format={format}
          onChange={handleDateRangeChange}
        />
      </Form.Item>
    </div>
  );
};

export default DateRangeTagCustom;