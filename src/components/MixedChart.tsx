import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);
ChartJS.defaults.set('plugins.datalabels', {
  display: false,
});

interface Props {
  options?: any; 
  data?: any; 
}

const BarLineChart = ({options, data,}: Props) => {
  
  return <Chart type='bar' options={options} data={data} style={{maxHeight: 400}} />;
}

export default BarLineChart;