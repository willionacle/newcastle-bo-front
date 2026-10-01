import { CSSProperties } from "react";

interface Props {
  value: string;
  dateRegistered?: string;
  userStatus?: string;
}

const NewColorizeUsername = ({
  value,
  dateRegistered,
  userStatus
}: Props) => {

  if (!value) return <div>-</div>;

  if (!dateRegistered || !userStatus) return <div className="">{value}</div>;

  let registeredDate: Date | null = null;
  try {
    const registeredDateString = dateRegistered
      .replace("T", " ")
      .replace("Z", "")
      .split(".")[0];
    registeredDate = new Date(registeredDateString);
    if (isNaN(registeredDate.getTime())) {
      throw new Error("Invalid date");
    }
  } catch {
    return <div>{value}</div>;
  }

  const now = new Date();
  const diffTime = now.getTime() - registeredDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const isMoreThan30DaysOld = diffDays >= 30;
  const isActive = userStatus === "ACTIVE";
  const isRoyal = userStatus === "ROYALBLACK";

  const style: CSSProperties = {
    color: isMoreThan30DaysOld ? "black" : "var(--ant-purple)",
    fontWeight: isMoreThan30DaysOld ? 'unset' : 700
  };
  const royalStyle: CSSProperties = {
    color: "#793c20",
    fontWeight: 700
  };

  return (
    <div style={isRoyal ? royalStyle : isActive ? style : undefined}>
      {value}
    </div>
  );
};

export default NewColorizeUsername;
