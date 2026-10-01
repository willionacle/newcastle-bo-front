import useUserListStore from "@/store/userlist.store";
import { CSSProperties } from "react";

const ColorizeUsername = ({
  username,
  returnRealName = false,
}: {
  username: string;
  returnRealName?: boolean;
}) => {
  const userList = useUserListStore((state) => state.userList);

  if (!username) return <div>-</div>;

  const user = userList?.find((item) => item.username === username);
  const dateRegistered = user?.created_at;

  if (!userList || !user) return <div>{username}</div>;
  if (!dateRegistered) return <div>{username}</div>;

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
    return <div>{username}</div>;
  }

  const now = new Date();
  const diffTime = now.getTime() - registeredDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const isMoreThan30DaysOld = diffDays >= 30;
  const isActive = user.user_status === "ACTIVE";
  const isRoyal = user.user_status === "ROYALBLACK";

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
      {!returnRealName ? username : user.user_real_name || "-"}
    </div>
  );
};

export default ColorizeUsername;
