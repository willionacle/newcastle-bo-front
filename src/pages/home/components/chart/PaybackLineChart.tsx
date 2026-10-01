import i18next from "@/i18n/i18n";
import { PaybackChartData, getLineChartPayback } from '@/api/dashboard/get';
import LineChart from '@/components/LineChart';
import { Empty, Spin } from 'antd';
import moment from 'moment';

const getXLabels = (data: PaybackChartData[]) => {
  const xLabels = data.flatMap(item => moment(item.date).utc().format('MM-DD'))
  return xLabels;
}

const yOptions = (text: string, position: string, suffix?: string) => {
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

const yDataSet = (label: string, data: number[], borderColor: string, backgroundColor: string, yAxisID: string) => {
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

const chartOptions = (_data: PaybackChartData[]) => {
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
        text: i18next.t("chart.titlePaybackByDateUserCount"),
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
      y: yOptions(i18next.t("chart.paybackTotalKrw"), 'left', '원'),
      y1: yOptions(i18next.t("chart.paybackRecipients"), 'right', i18next.t("unit.people")),
    }
  };
}

const chartDataSet = (data: PaybackChartData[]) => {
  const labels = getXLabels(data);
  const totalAmount = data.map(item => item.total_amount);
  const totalUser = data.map(item => item.total_user);
  return {
    labels,
    datasets: [
      yDataSet(i18next.t("chart.paybackTotalKrw"), totalAmount, 'rgba(75, 192, 192, 1)', 'rgba(75, 192, 192, 0.2)', 'y'),
      yDataSet(i18next.t("chart.paybackRecipients"), totalUser, 'rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.2)', 'y1'),
    ],
  };
}

const PaybackLineChart = () => {
  const {data: chartData, isLoading} = getLineChartPayback();

  if (isLoading) {
    return <Spin />;
  }
  if (!chartData || !chartData.data || chartData.data.length == 0) {
    return <Empty style={{minHeight: 288}} />;
  }

  return isLoading && !chartData ? <Spin /> : <LineChart options={chartOptions(chartData?.data)} data={chartDataSet(chartData?.data)} />;
}

export default PaybackLineChart;