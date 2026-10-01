import i18next from "@/i18n/i18n";
import { BonusChartData, getLineChartBonus } from '@/api/dashboard/get';
import LineChart from '@/components/LineChart';
import { Empty, Spin } from 'antd';
import moment from 'moment';

const getXLabels = (data: BonusChartData[]) => {
  const xLabels = data.flatMap(item => moment(item.regdate).utc().format('MM-DD'))
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

const chartOptions = (_data: BonusChartData[]) => {
  return {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: { font: { size: 14 } }
      },
      title: {
        display: true,
        text: i18next.t("chart.titleRollingDepositCoupon"),
        font: { size: 18 },
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
      y: yOptions(i18next.t("chart.bonusTotalKrw"), 'left', '원'),
      y1: yOptions(i18next.t("chart.couponsCount"), 'right', i18next.t("unit.count")),
    }
  };
}

const chartDataSet = (data: BonusChartData[]) => {
  const labels = getXLabels(data);
  // const totalBonus = data.map(item => item.total_bonus);
  const depositBonus = data.map(item => item.deposit_bonus);
  const rolling = data.map(item => item.rolling);
  const coupon = data.map(item => item.coupon);
  return {
    labels,
    datasets: [
      // yDataSet("보너스총합", depositBonus, 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 0.2)', 'y'),
      // yDataSet("보너스총합", totalBonus, 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 0.2)', 'y'),
      yDataSet(i18next.t("chart.depositBonus"), depositBonus, 'rgba(153, 102, 255, 1)', 'rgba(153, 102, 255, 0.2)', 'y'),
      yDataSet(i18next.t("topNavi.tn030"), coupon, 'rgba(54, 235, 63, 1)', 'rgba(54, 235, 63, 0.2)', 'y1'),
      yDataSet(i18next.t("col.rollingPoint"), rolling, 'rgba(235, 54, 54, 1)', 'rgba(235, 54, 54, 0.2)'),
    ],
  };
}

const BonusLineChart = () => {
  const {data: chartData, isLoading} = getLineChartBonus();

  if (isLoading) {
    return <Spin />;
  }
  if (!chartData || !chartData.data || chartData.data.length == 0) {
    return <Empty style={{minHeight: 288}} />;
  }

  return isLoading && !chartData ? <Spin /> : <LineChart options={chartOptions(chartData?.data)} data={chartDataSet(chartData?.data)} />;
}

export default BonusLineChart;