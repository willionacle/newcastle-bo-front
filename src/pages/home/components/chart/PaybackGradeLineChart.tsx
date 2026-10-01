import i18next from "@/i18n/i18n";
import { PaybackGradeChartData, getLineChartPaybackGrade } from '@/api/dashboard/get';
import LineChart from '@/components/LineChart';
import { Empty, Spin } from 'antd';
import moment from 'moment';

const getXLabels = (data: PaybackGradeChartData[]) => {
  const xLabels = data.flatMap(item => moment(item.date).utc().format('MM-DD'))
  return xLabels;
}

// const yOptions = (text: string, position: string, suffix = '원') => {
//   return {
//     type: 'linear' as const,
//     position: `${position}` as const,
//     title: {
//       display: false,
//       text,
//       font: { size: 14 }
//     },
//     ticks: {
//       callback: function(value: any) {
//         return value.toLocaleString('ko-KR') + ` ${suffix}`;
//       }
//     }
//   };
// }

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

const chartOptions = (_data: PaybackGradeChartData[]) => {
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
        text: i18next.t("chart.titlePaybackByDateGrade"),
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
      y: {
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString('ko-KR') + ` 원`;
          }
        }
      }
      // y: yOptions("페이백 지급 총액 (원)", 'left', '원'),
      // y1: yOptions("페이백 지급 인원 (명)", 'right', '명'),
    }
  };
}

const chartDataSet = (data: PaybackGradeChartData[]) => {
  const labels = getXLabels(data);
  // const totalAmount = data.map(item => item.avg_black_diamond + item.avg_diamond + item.avg_ruby + item.avg_emerald + item.avg_gold + item.avg_silver + item.avg_bronze);
  // const totalAmount = data.map(item => item.total_amount);
  // const totalUser = data.map(item => item.black_diamond + item.diamond + item.ruby + item.emerald + item.gold + item.silver + item.bronze);
  const blackDiamond = data.map(item => item.avg_black_diamond);
  const diamond = data.map(item => item.avg_diamond);
  const ruby = data.map(item => item.avg_ruby);
  const emerald = data.map(item => item.avg_emerald);
  const gold = data.map(item => item.avg_gold);
  const silver = data.map(item => item.avg_silver);
  const bronze = data.map(item => item.avg_bronze);
  return {
    labels,
    datasets: [
      // yDataSet("페이백 지급 총액 (원)", totalAmount, 'rgba(75, 192, 192, 1)', 'rgba(75, 192, 192, 0.2)', 'y', true),
      // yDataSet("페이백 지급 인원 (명)", totalUser, 'rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.2)', 'y1'),
      yDataSet(i18next.t("grade.blackDiamond"), blackDiamond, 'rgb(0, 0, 0)', 'transparent',),
      yDataSet(i18next.t("grade.diamond"), diamond, 'rgb(0, 103, 187)', 'transparent',),
      yDataSet(i18next.t("grade.ruby"), ruby, 'rgb(255, 0, 0)', 'transparent',),
      yDataSet(i18next.t("grade.emerald"), emerald, 'rgb(2, 187, 18)', 'transparent',),
      yDataSet(i18next.t("grade.gold"), gold, 'rgb(233, 190, 0)', 'transparent',),
      yDataSet(i18next.t("grade.silver"), silver, 'rgb(136, 136, 136)', 'transparent',),
      yDataSet(i18next.t("grade.bronze"), bronze, 'rgb(148, 91, 58)', 'transparent',),
    ],
  };
}

const PaybackGradeLineChart = () => {
  const {data: chartData, isLoading} = getLineChartPaybackGrade();

  if (isLoading) {
    return <Spin />;
  }
  if (!chartData || !chartData.data || chartData.data.length == 0) {
    return <Empty style={{minHeight: 288}} />;
  }

  return isLoading && !chartData ? <Spin /> : <LineChart options={chartOptions(chartData?.data)} data={chartDataSet(chartData?.data)} />;
}

export default PaybackGradeLineChart;