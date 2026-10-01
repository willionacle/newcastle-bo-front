import i18next from "@/i18n/i18n";
import { DailyUserUniqueChartData, getLineChartDailyUserUnique } from '@/api/dashboard/get';
import LineChart from '@/components/LineChart';
import { Empty, Spin } from 'antd';
import moment from 'moment';
import { useRef } from 'react';

const getXLabels = (data: DailyUserUniqueChartData[]) => {
  const xLabels = data.flatMap(item => moment(item.date).utc().format('MM-DD'))
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


const yDataSet = (label: string, data: number[], borderColor: string, backgroundColor: string, yAxisID?: string) => {
  return {
    label: label,
    data: data,
    borderColor: borderColor,
    backgroundColor: backgroundColor,
    yAxisID,
    fill: true,
    pointRadius: 3,
    pointHoverRadius: 5
  };
}

const chartOptions = (_data: DailyUserUniqueChartData[]) => {
  return {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false
    },
    plugins: {
      legend: {
        // display: false,
        position: 'top' as const,
        labels: { font: { size: 14 } }
      },
      title: {
        display: true,
        text: i18next.t("chart.titleMonthlyUserStats"),
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const ds = ctx.chart.data.datasets[ctx.datasetIndex];
            const i = ctx.dataIndex;
            const prev = i > 0 ? ds.data[i - 1] : undefined;
            return `${ds.label}: ${ctx.formattedValue} (어제: ${prev ?? '-'})`;
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
      y: yOptions(i18next.t("chart.depositBonusAmount"), 'left', i18next.t("unit.people")),
      // y1: yOptions("인원수", 'right', ''),
    }
  };
}

const chartDataSet = (data: DailyUserUniqueChartData[]) => {
  const labels = getXLabels(data);
  const uniqueUsers = data.map(item => item.unique_users);
  const todayDepositors = data.map(item => item.today_deposit_users);
  const todayBettors = data.map(item => item.today_betting_users);
  const todayNewUsers = data.map(item => item.new_user_count);
  return {
    labels,
    datasets: [
      yDataSet(i18next.t("chart.users"), uniqueUsers, 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 0.2)', 'y'),
      yDataSet(i18next.t("chart.depositors"), todayDepositors, 'rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.2)',),
      yDataSet(i18next.t("chart.bets"), todayBettors, 'rgba(255, 206, 86, 1)', 'rgba(255, 206, 86, 0.2)'),
      yDataSet(i18next.t("chart.newMembers"), todayNewUsers, 'rgba(54, 235, 63, 1)', 'rgba(54, 235, 63, 0.2)'),
    ],
  };
}

const DailyUserUniqueLineChart = () => {
  const {data: chartData, isLoading} = getLineChartDailyUserUnique();
  const parentRef = useRef<any>(null);

  if (isLoading) {
    return <Spin />;
  }
  if (!chartData || !chartData.data || chartData.data.length == 0) {
    return <Empty style={{minHeight: 288}} />;
  }

  return isLoading && !chartData ? <Spin /> : <LineChart ref={parentRef} options={chartOptions(chartData?.data)} data={chartDataSet(chartData?.data)} />;
}

export default DailyUserUniqueLineChart;