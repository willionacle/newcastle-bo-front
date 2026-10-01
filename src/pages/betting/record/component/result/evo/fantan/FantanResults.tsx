import { Typography } from "antd";
// import styles from "@/pages/betting/record/component/result/cards.module.css";
// import { EvoGameInfoData } from "./Baccarat";
import { NewEvoBetData } from "@/api/bet-details/get";

// const resultColor: Record<string, string> = {
//   Player: "blue",
//   Tie: "green",
//   Banker: "red",
// };

const FantanResults = ({
  data,
}: {
  data?: NewEvoBetData["raw"]["data"]["result"];
}) => {
  console.log(data);
  if (!data) return;
  return (
    <Typography.Title
      style={{
        color: "var(--ant-black)",
        textAlign: "center",
        marginTop: "10px",
        fontSize: 60,
        fontWeight: 900,
      }}
    >
      <span style={{ fontSize: 30, fontWeight: 700 }}>
        Buttons Count <br />
      </span>
      {data.buttonsCount}
    </Typography.Title>
  );
};

export default FantanResults;
