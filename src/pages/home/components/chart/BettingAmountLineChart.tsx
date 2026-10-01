import i18next from "@/i18n/i18n";
import { BettingAmountChartData, getLineChartBetingAmount } from '@/api/dashboard/get';
import BarChart from '@/components/BarChart';
import { Empty, Spin } from 'antd';

type ChartKey = keyof Pick<BettingAmountChartData, 'total_sports_bet_today' | 
  'total_live_bet_today' |
  'total_slot_bet_today' |
  'total_minigame_bet_today' |
  'total_fish_bet_today' |
  'total_esports_bet_today'
>;

interface NewBettingAmountChartData {
  'label': string;
  'key': string;
  '3_months_ago': number;
  '2_months_ago': number;
  'this_month': number;
  '3_months_ago_user': number;
  '2_months_ago_user': number;
  'this_month_user': number;
}

const getXLabels = (data: NewBettingAmountChartData[]) => {
  const xLabels = data.flatMap(item => item.label);
  return xLabels;
}

const yOptions = (text: string, position: string, suffix: string) => {
  return {
    type: 'linear' as const,
    position: `${position}` as const,
    title: {
      display: false,
      text,
      font: { size: 14 }
    },
    beginAtZero: true,
    ticks: {
      callback: function(value: any) {
        return value.toLocaleString('ko-KR') + ` ${suffix}`;
      }
    }
  };
}

const yDataSet = (label: string, data: number[], backgroundColor: string, yAxisID?: string,) => {
  return {
    label: label,
    data: data,
    backgroundColor: backgroundColor,
    yAxisID,
  };
}

const chartOptions = (_data: NewBettingAmountChartData[]) => {
  return {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false
    },
    scales: {
      y: yOptions("", 'left', '원'),
      // y1: yOptions("", 'right', '명'),
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { font: { size: 14 } }
      },
      title: {
        display: true,
        // text: `최근 3개월 카테고리별 베팅금 & 인원수`,
        text: i18next.t("chart.titleBetByCategory3m"),
        font: { size: 18 },
      },
    },
  };
}

const chartDataSet = (data: NewBettingAmountChartData[]) => {
  const labels = getXLabels(data);
  const threeMonthsAgo = data.map(item => item['3_months_ago']);
  const twoMonthsAgo = data.map(item => item['2_months_ago']);
  const thisMonth = data.map(item => item['this_month']);
  // const threeMonthsAgoUser = data.map(item => item['3_months_ago_user']);
  // const twoMonthsAgoUser = data.map(item => item['2_months_ago_user']);
  // const thisMonthUser = data.map(item => item['this_month_user']);
  return {
    labels,
    datasets: [
      yDataSet(i18next.t("chart.twoMonthsAgo"), threeMonthsAgo, 'rgb(12, 111, 207)', 'y'),
      yDataSet(i18next.t("chart.oneMonthAgo"), twoMonthsAgo, 'rgb(254, 151, 6)', 'y'),
      yDataSet(i18next.t("header.thisMonth"), thisMonth, 'rgb(60, 167, 63)', 'y'),
      // yDataSet("2개월전 인원수", threeMonthsAgoUser, 'rgba(75, 192, 192, 1)', 'y1'),
      // yDataSet("1개월전 인원수", twoMonthsAgoUser, 'rgba(255, 99, 132, 1)', 'y1'),
      // yDataSet("당월 인원수", thisMonthUser, 'rgba(153, 102, 255, 1)', 'y1'),
    ],
  };
}

const labels: Record<ChartKey, string> = {
  total_sports_bet_today: i18next.t("memberDetail.mis133"),
  total_live_bet_today: i18next.t("gameCat.liveCasino"),
  total_slot_bet_today: i18next.t("memberDetail.mis132"),
  total_minigame_bet_today: i18next.t("memberDetail.mis134"),
  total_fish_bet_today: i18next.t("gameCat.fishing"),
  total_esports_bet_today: i18next.t("title.esports"),
};

const transformedData = (data: BettingAmountChartData[]): NewBettingAmountChartData[] => {
  const keys: ChartKey[] = Object.keys(labels) as ChartKey[];
  const reverseData = [...data].reverse();
  const transformed = keys.map((key) => ({
    label: labels[key],
    key,
    "this_month": Number(reverseData[0]?.[key] ?? 0),
    "2_months_ago": Number(reverseData[1]?.[key] ?? 0),
    "3_months_ago": Number(reverseData[2]?.[key] ?? 0),
    "this_month_user": Number(reverseData[0]?.[key.replace('bet_', 'user_') as keyof BettingAmountChartData] ?? 0),
    "2_months_ago_user": Number(reverseData[1]?.[key.replace('bet_', 'user_') as keyof BettingAmountChartData] ?? 0),
    "3_months_ago_user": Number(reverseData[2]?.[key.replace('bet_', 'user_') as keyof BettingAmountChartData] ?? 0),
  }));
  
  return transformed;
}

const BettingAmountBarChart = () => {
  const {data: chartData, isLoading} = getLineChartBetingAmount();

  if (isLoading) {
    return <Spin />;
  }
  if (!chartData || !chartData.data || chartData.data.length == 0) {
    return <Empty style={{minHeight: 288}} />;
  }

  return isLoading && !chartData 
  ? <Spin /> 
  : <BarChart 
  options={chartOptions(transformedData(chartData?.data))} 
  data={chartDataSet(transformedData(chartData?.data))} 
  />;
}

export default BettingAmountBarChart;