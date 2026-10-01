import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  options?: any; 
  data?: any; 
}

const BarChart = ({options, data,}: Props) => {
  // See LineChart.tsx for why this needs an explicit sized wrapper +
  // maintainAspectRatio:false (mobile flex/SimpleBar reflow chain left
  // the canvas with no definite box to size against).
  return (
    <div style={{ position: "relative", width: "100%", height: 288 }}>
      <Bar options={{ maintainAspectRatio: false, ...options }} data={data} />
    </div>
  );
}

export default BarChart;