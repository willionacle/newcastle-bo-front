import { GF } from "@/utils/GlobalFunctions";
import dayjs from "dayjs";

interface Props {
  date: string | null;
  timeStamp?: boolean;
  convertToLocal?: boolean;
  format?: string;
}

const DateText = ({
  date,
  timeStamp = false,
  format,
  convertToLocal = false,
}: Props) => {
  const convertDate =
    date === null || date === undefined
      ? "-"
      : format
      ? dayjs(date).format(format)
      : GF.cleanDateString(date, timeStamp, convertToLocal);

  return <>{convertDate}</>;
};

export default DateText;
