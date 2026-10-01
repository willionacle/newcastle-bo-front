import i18next from "@/i18n/i18n";
import {
  getBarChartUserBettorGrade,
  UserBettorChartData,
} from "@/api/dashboard/get";
import BarLineChart from "@/components/MixedChart";
import { Empty, Spin } from "antd";

type ChartKey = keyof {
  grade_1: number;
  grade_2: number;
  grade_3: number;
  grade_4: number;
  grade_5: number;
  grade_6: number;
  grade_7: number;
};

interface NewUserBettorChartData {
  label: string;
  key: ChartKey;
  total_users: number;
  user_bettors: number;
  percentage: string;
}

const getXLabels = (data: NewUserBettorChartData[]) => {
  const xLabels = data.flatMap((item) => item.label);
  return xLabels;
};

const yDataSet = (
  type: string,
  label: string,
  data: string[] | number[],
  backgroundColor: string,
  borderColor: string,
  yAxisID: string
) => {
  return {
    type,
    label,
    data,
    backgroundColor,
    borderColor,
    yAxisID,
    ...(type === "line"
      ? {
          fill: false,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 3,
          datalabels: {
            display: true,
            align: "top",
            anchor: "end",
            formatter: (v: number) => `${Number(v).toFixed(2)}%`,
            font: { weight: "bold" },
          },
        }
      : { borderWidth: 1 }),
  };
};

const chartOptions = (_data: NewUserBettorChartData[]) => {
  return {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: i18next.t("chart.membersCount"),
        },
        // ticks: {
        //   callback: function (value: number) {
        //     return value.toLocaleString('ko-KR') + ' 원'; // or any other suffix
        //   },
        // },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: i18next.t("chart.usageRatePct"),
        },
        grid: {
          drawOnChartArea: false,
        },
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: i18next.t("chart.titleMemberStatusByGrade"),
        font: { size: 18 },
      },
      datalabels: {
        display: false,
      },
    },
    layout: {
      maxHeight: 400,
    },
  };
};

const chartDataSet = (data: NewUserBettorChartData[]) => {
  const labels = getXLabels(data);
  const totalUsers = data.map((item) => item["total_users"]);
  const userBettors = data.map((item) => item["user_bettors"]);
  const percentages = data.map((item) => item["percentage"]);

  return {
    labels,
    datasets: [
      yDataSet(
        "bar",
        i18next.t("chart.totalMembers"),
        totalUsers,
        "rgba(135, 206, 250, 0.8)",
        "rgba(135, 206, 250, 1)",
        "y"
      ),
      yDataSet(
        "bar",
        i18next.t("chart.todayUsers"),
        userBettors,
        "rgba(255, 165, 0, 0.8)",
        "rgba(255, 165, 0, 1)",
        "y"
      ),
      yDataSet(
        "line",
        i18next.t("chart.usageRatePct"),
        percentages,
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 99, 132, 1)",
        "y1"
      ),
    ],
  };
};

const labels: Record<string, string> = {
  grade_1: i18next.t("grade.bronze"),
  grade_2: i18next.t("grade.silver"),
  grade_3: i18next.t("grade.gold"),
  grade_4: i18next.t("grade.emerald"),
  grade_5: i18next.t("grade.ruby"),
  grade_6: i18next.t("grade.diamond"),
  grade_7: i18next.t("grade.blackDiamond"),
};

const transformedData = (
  data: UserBettorChartData
): NewUserBettorChartData[] => {
  const keys: ChartKey[] = Object.keys(labels) as ChartKey[];

  const transformed = keys.map((key) => {
    const userBettors =
      (data[`${key}_with_bet` as keyof UserBettorChartData] as number) || 0;
    const userNoBet = data[
      `${key}_no_bet` as keyof UserBettorChartData
    ] as number;
    const totalUsers = (userBettors || 0) + (userNoBet || 0);
    const percentage = (userBettors / totalUsers) * 100;

    return {
      label: labels[key],
      key,
      total_users: totalUsers,
      user_bettors: userBettors,
      percentage: (percentage || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    };
  });

  console.log(transformed);

  return transformed;
};

const UserBettorGradeBarChart = () => {
  const { data: chartData, isLoading } = getBarChartUserBettorGrade();

  if (isLoading) {
    return <Spin />;
  }
  if (!chartData || !chartData.data || chartData.data.length == 0) {
    return <Empty style={{ minHeight: 288 }} />;
  }

  return isLoading && !chartData ? (
    <Spin />
  ) : (
    <BarLineChart
      options={chartOptions(transformedData(chartData?.data[0]))}
      data={chartDataSet(transformedData(chartData?.data[0]))}
    />
  );
};

export default UserBettorGradeBarChart;
