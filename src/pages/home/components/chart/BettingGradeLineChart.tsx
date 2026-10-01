import i18next from "@/i18n/i18n";
import { BettingGradeChartData, getLineChartBettingGrade } from '@/api/dashboard/get';
import LineChart from '@/components/LineChart';
import { Empty, Spin } from 'antd';
import moment from 'moment';
import { useRef } from 'react';

const getXLabels = (data: BettingGradeChartData[]) => {
  const xLabels = data.flatMap(item => moment(item.regdate).utc().format('MM-DD'))
  return xLabels;
}

const yOptions = (text: string, position: string, suffix?: string) => {
  return {
    type: 'linear' as const,
    position: `${position}` as const,
    beginAtZero: true,
    title: {
      display: false,
      text,
      font: { size: 14 }
    },
    ticks: {
      callback: function(value: any) {
        return value.toLocaleString('ko-KR') + ` ${suffix}`;
      },
    },
  };
}

const yDataSet = (label: string, data: number[], borderColor: string, backgroundColor: string, yAxisID?: string, hidden?: boolean) => {
  return {
    label: label,
    data: data,
    borderColor: borderColor,
    backgroundColor: backgroundColor,
    yAxisID,
    fill: true,
    pointRadius: 3,
    pointHoverRadius: 5,
    hidden
  };
}

const chartOptions = (_data: BettingGradeChartData[]) => {
  return {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { font: { size: 14 } }
      },
      title: {
        display: true,
        text: i18next.t("chart.titleMonthlyUsersByGrade"),
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const ds = ctx.chart.data.datasets[ctx.datasetIndex];
            const i = ctx.dataIndex;
            const prev = i > 0 ? ds.data[i - 1] : undefined;
            return i18next.t("chart.yesterdayTooltip", { label: ds.label, value: ctx.formattedValue, prev: prev ?? '-' });
          },
        },
      },
    },
    tension: 0.3,
    scales: {
      x: {
        title: {
          display: true,
          text: i18next.t("chart.dateMmDd"),
          font: { size: 14 }
        }
      },
      // y: {
      //   ticks: {
      //     callback: function(value: any) {
      //       return value.toLocaleString('ko-KR') + ` 원`;
      //     }
      //   }
      // },
      y: yOptions(i18next.t("chart.paybackTotalKrw"), 'left', i18next.t("unit.people")),
      // y1: yOptions("페이백 지급 인원 (명)", 'right', '명'),
    }
  };
}

const chartDataSet = (data: BettingGradeChartData[]) => {
  const labels = getXLabels(data);
  // const totalAmount = data.map(item => item.total_bet_amount);
  // const totalUser = data.map(item => item.total_user);
  const blackDiamond = data.map(item => item.black_diamond);
  const diamond = data.map(item => item.diamond);
  const ruby = data.map(item => item.ruby);
  const emerald = data.map(item => item.emerald);
  const gold = data.map(item => item.gold);
  const silver = data.map(item => item.silver);
  const bronze = data.map(item => item.bronze);
  // const blackDiamondBetting = data.map(item => item.black_diamond_amount);
  // const diamondBetting = data.map(item => item.diamond_amount);
  // const rubyBetting = data.map(item => item.ruby_amount);
  // const emeraldBetting = data.map(item => item.emerald_amount);
  // const goldBetting = data.map(item => item.gold_amount);
  // const silverBetting = data.map(item => item.silver_amount);
  // const bronzeBetting = data.map(item => item.bronze_amount);
  return {
    labels,
    datasets: [
      // yDataSet("페이백 지급 총액 (원)", totalAmount, 'rgba(75, 192, 192, 1)', 'rgba(75, 192, 192, 0.2)', 'y'),
      // yDataSet("페이백 지급 인원 (명)", totalUser, 'rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.2)', 'y1'),
      // yDataSet("블랙다이아 Bet", blackDiamondBetting, 'transparent', 'rgba(0, 0, 0, 0.2)', 'y'),
      // yDataSet("다이아몬드 Bet", diamondBetting, 'transparent', 'rgb(0, 103, 187, 0.2)', 'y'),
      // yDataSet("루비 Bet", rubyBetting, 'transparent', 'rgb(255, 0, 0, 0.2)', 'y'),
      // yDataSet("에메랄드 Bet", emeraldBetting, 'transparent', 'rgb(2, 187, 18, 0.2)', 'y'),
      // yDataSet("골드 Bet", goldBetting, 'transparent', 'rgb(233, 190, 0, 0.2)', 'y'),
      // yDataSet("실버 Bet", silverBetting, 'transparent', 'rgb(136, 136, 136, 0.2)', 'y'),
      // yDataSet("브론즈 Bet", bronzeBetting, 'transparent', 'rgb(148, 91, 58, 0.2)', 'y'),
      yDataSet(i18next.t("grade.blackDiamond"), blackDiamond, 'rgb(0, 0, 0)', 'transparent'),
      yDataSet(i18next.t("grade.diamond"), diamond, 'rgb(0, 103, 187)', 'transparent'),
      yDataSet(i18next.t("grade.ruby"), ruby, 'rgb(255, 0, 0)', 'transparent'),
      yDataSet(i18next.t("grade.emerald"), emerald, 'rgb(2, 187, 18)', 'transparent'),
      yDataSet(i18next.t("grade.gold"), gold, 'rgb(233, 190, 0)', 'transparent'),
      yDataSet(i18next.t("grade.silver"), silver, 'rgb(136, 136, 136)', 'transparent'),
      yDataSet(i18next.t("grade.bronze"), bronze, 'rgb(148, 91, 58)', 'transparent'),
    ],
  };
}

const BettingGradeLineChart = () => {
  const {data: chartData, isLoading} = getLineChartBettingGrade();
  const parentRef = useRef<any>(null);

  if (isLoading) {
    return <Spin />;
  }
  if (!chartData || !chartData.data || chartData.data.length == 0) {
    return <Empty style={{minHeight: 288}} />;
  }

  return isLoading && !chartData ? <Spin /> : <LineChart ref={parentRef} options={chartOptions(chartData?.data)} data={chartDataSet(chartData?.data)} />;
}

export default BettingGradeLineChart;