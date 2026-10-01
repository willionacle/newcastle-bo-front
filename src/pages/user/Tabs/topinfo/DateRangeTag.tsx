import { DateRangeType } from "@/components/DateRange";
import { DatePicker, Form, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

interface DateRangeTagProp {
  key: "today" | "this_week" | "this_month" | "prev_month" | "custom";
  title: string;
  dateRangeT: DateRangeType;
}

interface Props {
  showTime?: any;
}

const tagData: DateRangeTagProp[] = [
  // {
  //   key: "this_week",
  //   title: "dailyStatistics.ds002",
  //   dateRangeT: [
  //     dayjs().startOf("week").add(1, "day"),
  //     dayjs().endOf("week").add(1, "day"),
  //   ],
  // },
  {
    key: "this_month",
    title: "dailyStatistics.ds003",
    dateRangeT: [dayjs().startOf("month"), dayjs().endOf("month")],
  },
  {
    key: "today",
    title: "dailyStatistics.ds018",
    dateRangeT: [dayjs().startOf("day"), dayjs().endOf("day")],
  },
  {
    key: "prev_month",
    title: "dailyStatistics.ds004",
    dateRangeT: [
      dayjs().subtract(1, "month").startOf("month"),
      dayjs().subtract(1, "month").endOf("month"),
    ],
  },
];

const DateRangeTag = ({showTime}: Props) => {
  const { t } = useTranslation();
  const [select, setSelect] = useState<DateRangeTagProp["key"]>("this_month");
  const [searchParam, setSearchParam] = useSearchParams();
  const form = Form.useFormInstance();

  const handleTagChange = (tag: DateRangeTagProp) => {
    setSelect(tag.key);
    form.setFieldValue("dateRange", [...tag.dateRangeT]);
  };

  const handleDateRangeChange = (
    dateRangeT: DateRangeTagProp["dateRangeT"] | null
  ) => {
    let selectKey: DateRangeTagProp["key"] = "custom";

    if (dateRangeT === null) {
      setSelect(selectKey);
      return;
    }

    const [start, end] = dateRangeT;

    if (dayjs.isDayjs(start) && dayjs.isDayjs(end)) {
    //   end = end.endOf("day");

      tagData.forEach((item) => {
        const [tagStart, tagEnd] = item.dateRangeT;

        if (start?.isSame(tagStart) && end?.isSame(tagEnd)) {
          selectKey = item.key;
        }
      });

      form.setFieldValue("dateRange", [start, end]);
      setSelect(selectKey);
    }
  };

  useEffect(() => {
    const targetTag = tagData.find((item) => {
      const isEqual =
        item.dateRangeT[0]?.tz().format() === searchParam.get("dateRangeT[0]") &&
        item.dateRangeT[1]?.tz().format() === searchParam.get("dateRangeT[1]");

      if (isEqual) {
        return true;
      }
    });

    let didSetDefault = false;

    if (!searchParam.get("dateRangeT[0]")) {
      searchParam.set(
        "dateRangeT[0]",
        tagData[0].dateRangeT[0]?.tz().format() as string
      );
      didSetDefault = true;
    }

    if (!searchParam.get("dateRangeT[1]")) {
      searchParam.set(
        "dateRangeT[1]",
        tagData[0].dateRangeT[1]?.tz().format() as string
      );
      didSetDefault = true;
    }

    if (targetTag) {
      setSelect(targetTag.key);
    }

    form.setFieldsValue({
      dateRangeT: [
        searchParam.get("dateRangeT[0]")
          ? dayjs(searchParam.get("dateRangeT[0]"))
          : null,
        searchParam.get("dateRangeT[1]")
          ? dayjs(searchParam.get("dateRangeT[1]"))
          : null,
      ],
    });

    if (didSetDefault) {
      setSearchParam(searchParam);
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
        <DatePicker.RangePicker showTime={showTime} size="small" onChange={handleDateRangeChange} />
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
