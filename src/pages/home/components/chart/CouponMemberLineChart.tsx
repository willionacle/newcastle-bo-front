import i18next from "@/i18n/i18n";
import { CouponMemberChartData, getLineChartCouponMember, } from '@/api/dashboard/get';
import LineChart from '@/components/LineChart';
import { Empty, Spin } from 'antd';
import moment from 'moment';

const getXLabels = (data: CouponMemberChartData[]) => {
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

const chartOptions = (_data: CouponMemberChartData[]) => {
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
        text: i18next.t("chart.titleCouponByDate"),
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
      y: yOptions(i18next.t("storeSetting.ss020"), 'left', '원'),
      y1: yOptions(i18next.t("chart.headcount"), 'right', i18next.t("unit.people")),
    }
  };
}

const chartDataSet = (data: CouponMemberChartData[]) => {
  const labels = getXLabels(data);
  const totalBonus = data.map(item => item.total_bonus);
  const totalAmount = data.map(item => item.coupon_sum);
  const totalUser = data.map(item => item.unique_users);
  return {
    labels,
    datasets: [
      yDataSet(i18next.t("chart.bonusTotal"), totalBonus, 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 0.2)', 'y'),
      yDataSet(i18next.t("storeSetting.ss020"), totalAmount, 'rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.2)'),
      yDataSet(i18next.t("chart.headcount"), totalUser, 'rgba(255, 206, 86, 1)', 'rgba(255, 206, 86, 0.2)', 'y1'),
    ],
  };
}

const CouponMemberLineChart = () => {
  const {data: chartData, isLoading} = getLineChartCouponMember();

  if (isLoading) {
    return <Spin />;
  }
  if (!chartData || !chartData.data || chartData.data.length == 0) {
    return <Empty style={{minHeight: 288}} />;
  }

  return isLoading && !chartData ? <Spin /> : <LineChart options={chartOptions(chartData?.data)} data={chartDataSet(chartData?.data)} />;
}

export default CouponMemberLineChart;