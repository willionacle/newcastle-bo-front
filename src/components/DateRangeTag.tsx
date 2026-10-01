import { DatePicker, Form, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DateRangeType } from "./DateRange";
import { useSearchParams } from "react-router-dom";

interface DateRangeTagProp {
  key: "today" | "this_week" | "this_month" | "prev_month" | "custom";
  title: string;
  dateRange: DateRangeType;
}

const tagData: DateRangeTagProp[] = [
  // {
  //   key: "this_week",
  //   title: "dailyStatistics.ds002",
  //   dateRange: [
  //     dayjs().startOf("week").add(1, "day"),
  //     dayjs().endOf("week").add(1, "day"),
  //   ],
  // },
  {
    key: "this_month",
    title: "dailyStatistics.ds003",
    dateRange: [dayjs().startOf("month"), dayjs().endOf("month")],
  },
  {
    key: "today",
    title: "dailyStatistics.ds018",
    dateRange: [dayjs().startOf("day"), dayjs().endOf("day")],
  },
  {
    key: "prev_month",
    title: "dailyStatistics.ds004",
    dateRange: [
      dayjs().subtract(1, "month").startOf("month"),
      dayjs().subtract(1, "month").endOf("month"),
    ],
  },
];

const DateRangeTag = ({
  showTime,
  hasDefault = true,
}: {
  showTime?: boolean;
  hasDefault?: boolean;
}) => {
  const { t } = useTranslation();
  const [select, setSelect] = useState<DateRangeTagProp["key"]>("this_month");
  const [searchParam, setSearchParam] = useSearchParams();
  const form = Form.useFormInstance();
  const format = showTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD";

  const handleTagChange = (tag: DateRangeTagProp) => {
    setSelect(tag.key);
    form.setFieldValue("dateRange", [...tag.dateRange]);
  };

  const handleDateRangeChange = (
    dateRange: DateRangeTagProp["dateRange"] | null
  ) => {
    let selectKey: DateRangeTagProp["key"] = "custom";

    if (dateRange === null) {
      setSelect(selectKey);
      return;
    }

    const start = dateRange[0];
    let end = dateRange[1];

    if (dayjs.isDayjs(start) && dayjs.isDayjs(end)) {
      end = end.endOf("day");

      tagData.forEach((item) => {
        const [tagStart, tagEnd] = item.dateRange;

        if (start?.isSame(tagStart) && end?.isSame(tagEnd)) {
          selectKey = item.key;
        }
      });

      form.setFieldValue("dateRange", [start, end]);
      setSelect(selectKey);
    }
  };

  useEffect(() => {
    if (hasDefault) {
      const targetTag = tagData.find((item) => {
        const isEqual =
          item.dateRange[0]?.tz().format() ===
            searchParam.get("dateRange[0]") &&
          item.dateRange[1]?.tz().format() === searchParam.get("dateRange[1]");

        if (isEqual) {
          return true;
        }
      });

      let didSetDefault = false;

      if (!searchParam.get("dateRange[0]")) {
        searchParam.set(
          "dateRange[0]",
          tagData[0].dateRange[0]?.tz().format() as string
        );
        didSetDefault = true;
      }

      if (!searchParam.get("dateRange[1]")) {
        searchParam.set(
          "dateRange[1]",
          tagData[0].dateRange[1]?.tz().format() as string
        );
        didSetDefault = true;
      }

      if (targetTag) {
        setSelect(targetTag.key);
      }

      form.setFieldsValue({
        dateRange: [
          searchParam.get("dateRange[0]")
            ? dayjs(searchParam.get("dateRange[0]"))
            : null,
          searchParam.get("dateRange[1]")
            ? dayjs(searchParam.get("dateRange[1]"))
            : null,
        ],
      });

      if (didSetDefault) {
        setSearchParam(searchParam);
      }
    }
  }, [searchParam]);

  return (
    <>
      <Form.Item
        label={t("dailyStatistics.ds001")}
        rules={[
          {
            required: true,
            message: t("dailyStatistics.ds017"),
          },
        ]}
        name={["dateRange"]}
      >
        <DatePicker.RangePicker
          size="small"
          onChange={handleDateRangeChange}
          showTime={showTime}
          format={format}
        />
      </Form.Item>

      {tagData.map((item) => (
        <Tag.CheckableTag
          key={item.key}
          checked={select === item.key}
          onChange={() => handleTagChange(item)}
        >
          {t(item.title)}
        </Tag.CheckableTag>
      ))}
    </>
  );
};

export default DateRangeTag;
