import i18next from "@/i18n/i18n";
import { DepostiBettingChartData, getBarChartDepositBetting } from '@/api/dashboard/get';
import BarChart from '@/components/BarChart';
import { Empty, Spin } from 'antd';

type ChartKey = keyof Omit<DepostiBettingChartData, 'regdate'>;

interface NewDepostiBettingChartData {
  'label': string;
  'key': string;
  '3_months_ago': number;
  '2_months_ago': number;
  'this_month': number;
}

const getXLabels = (data: NewDepostiBettingChartData[]) => {
  const xLabels = data.flatMap(item => item.label);
  return xLabels;
}

const yDataSet = (label: string, data: number[], backgroundColor: string) => {
  return {
    label: label,
    data: data,
    backgroundColor: backgroundColor,
  };
}

const chartOptions = (_data: NewDepostiBettingChartData[]) => {
  return {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false
    },
    scales: {
      y: {
        ticks: {
          callback: function (value: number) {
            return value.toLocaleString('ko-KR') + ' 원'; // or any other suffix
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { 
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: i18next.t("chart.titleSameTime3m"),
        font: { size: 18 },
      },
    },
    layout: {
      maxHeight: 400
    }
  };
}

const chartDataSet = (data: NewDepostiBettingChartData[]) => {
  const labels = getXLabels(data);
  const threeMonthsAgo = data.map(item => item['3_months_ago']);
  const twoMonthsAgo = data.map(item => item['2_months_ago']);
  const thisMonth = data.map(item => item['this_month']);
  return {
    labels,
    datasets: [
      yDataSet(i18next.t("chart.twoMonthsAgo"), threeMonthsAgo, 'rgb(12, 111, 207)'),
      yDataSet(i18next.t("chart.oneMonthAgo"), twoMonthsAgo, 'rgb(254, 151, 6)'),
      yDataSet(i18next.t("header.thisMonth"), thisMonth, 'rgb(60, 167, 63)'),
    ],
  };
}

const labels: Record<ChartKey, string> = {
  deposit: i18next.t("col.depositAmount"),
  deposit_withdrawal: i18next.t("col.netDeposit"),
  betting_amount: i18next.t("chart.betSum"),
  betting_winlose: i18next.t("col.betProfitLoss"),
};

const transformedData = (data: DepostiBettingChartData[]): NewDepostiBettingChartData[] => {
  const keys: ChartKey[] = Object.keys(labels) as ChartKey[];
  const reverseData = [...data].reverse();
  const transformed = keys.map((key) => ({
    label: labels[key],
    key,
    "this_month":reverseData[0] ? reverseData[0][key] : 0,
    "2_months_ago": reverseData[1] ? reverseData[1][key] : 0,
    "3_months_ago": reverseData[2] ? reverseData[2][key] : 0,
  }));

  return transformed;
}


const DepositBettingBarChart = () => {
  const {data: chartData, isLoading} = getBarChartDepositBetting();

  if (isLoading) {
    return <Spin />;
  }
  if (!chartData || !chartData.data || chartData.data.length == 0) {
    return <Empty style={{minHeight: 288}} />;
  }

  return isLoading && !chartData ? <Spin /> : <BarChart options={chartOptions(transformedData(chartData?.data.reverse()))} data={chartDataSet(transformedData(chartData?.data.reverse()))} />;
}

export default DepositBettingBarChart;