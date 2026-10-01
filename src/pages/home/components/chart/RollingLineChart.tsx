import i18next from "@/i18n/i18n";
import { RollingChartData, getLineChartRolling } from '@/api/dashboard/get';
import LineChart from '@/components/LineChart';
import { Empty, Spin } from 'antd';
import moment from 'moment';

const getXLabels = (data: RollingChartData[]) => {
  const xLabels = data.flatMap(item => moment(item.regdate).utc().format('MM-DD'))
  return xLabels;
}

const yOptions = (text: string, position: string) => {
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
        return value.toLocaleString('ko-KR') + ' 원';
      }
    }
  };
}

const yDataSet = (label: string, data: number[], borderColor: string, backgroundColor: string) => {
  return {
    label: label,
    data: data,
    borderColor: borderColor,
    backgroundColor: backgroundColor,
    fill: true,
    pointRadius: 3,
    pointHoverRadius: 5
  };
}

const chartOptions = (_data: RollingChartData[]) => {
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
        text: i18next.t("chart.titleRollingByDate"),
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
      y: yOptions(i18next.t("chart.rollingPointsKrw"), 'left'),
    }
  };
}

const chartDataSet = (data: RollingChartData[]) => {
  const labels = getXLabels(data);
  const totalAmount = data.map(item => item.total_rolling);
  const totalBonus = data.map(item => item.total_bonus);
  return {
    labels,
    datasets: [
      yDataSet(i18next.t("chart.bonusTotal"), totalBonus, 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 0.2)'),
      yDataSet(i18next.t("col.rollingPoint"), totalAmount, 'rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.2)'),
    ],
  };
}

const RollingLineChart = () => {
  const {data: chartData, isLoading} = getLineChartRolling();

  if (isLoading) {
    return <Spin />;
  }
  if (!chartData || !chartData.data || chartData.data.length == 0) {
    return <Empty style={{minHeight: 288}} />;
  }

  return isLoading && !chartData ? <Spin /> : <LineChart options={chartOptions(chartData?.data)} data={chartDataSet(chartData?.data)} />;
}

export default RollingLineChart;