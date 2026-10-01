import { formatDateKR } from "@/utils/DateFormatter";

interface Props {
  date: string | null;
  timeStamp?: boolean;
}

const DateTextKR = ({ date, timeStamp = false }: Props) => {
  const convertDate =
    date === null || date === undefined
      ? "-"
      : formatDateKR(date, timeStamp)

  return <>{convertDate}</>;
};

export default DateTextKR;
