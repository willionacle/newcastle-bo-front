import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, 
} from 'chart.js';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  options?: any; 
  data?: any; 
}

const LineChart = forwardRef<any, Props>(({options, data}, ref) => {
  const chartRef = useRef<any>(null);

  useImperativeHandle(ref, () => chartRef.current)

  const showLastTooltip = () => {
    const chart = chartRef.current as ChartJS | null;
    if (!chart) return;

    const labelsLen = chart.data.labels?.length ?? 0;
    const ds0Len = chart.data.datasets?.[0]?.data?.length ?? 0;
    const lastIndex = Math.max(0, (labelsLen || ds0Len || 1) - 1);

    const active =
      (chart.data.datasets ?? []).map((_, di) => ({
        datasetIndex: di,
        index: lastIndex,
      })) || [];

    chart.setActiveElements(active);
    chart.tooltip?.setActiveElements?.(active, { x: 0, y: 0 });
    chart.update("none");
  };

  useEffect(() => {
    if (!ref || !chartRef.current) return;

    showLastTooltip();

    const canvas: HTMLCanvasElement | undefined = chartRef.current.canvas;
    if (!canvas) return;

    const handleLeave = () => {
      requestAnimationFrame(() => {
        showLastTooltip();
      });
    };

    canvas.addEventListener("mouseleave", handleLeave);
    canvas.addEventListener("touchend", handleLeave);
    canvas.addEventListener("touchcancel", handleLeave);
    canvas.addEventListener("pointerleave", handleLeave);

    return () => {
      canvas.removeEventListener("mouseleave", handleLeave);
      canvas.removeEventListener("touchend", handleLeave);
      canvas.removeEventListener("touchcancel", handleLeave);
      canvas.removeEventListener("pointerleave", handleLeave);
    };
  }, [data, options]);

  return (
    // Chart.js's ResizeObserver needs a parent with a real, stable box to
    // read width/height from. Handing the canvas straight to the antd
    // Card body (whose own height is `100%` against an auto-height Row/Col
    // — resolves to `auto`, i.e. no definite box) worked most of the time
    // on desktop but was unreliable through the mobile flex/SimpleBar
    // reflow chain, sometimes locking the canvas at a ~0 size. An explicit
    // sized wrapper + maintainAspectRatio:false makes sizing deterministic
    // regardless of the ancestor chain.
    <div style={{ position: "relative", width: "100%", height: 288 }}>
      <Line
        ref={chartRef}
        options={{ maintainAspectRatio: false, ...options }}
        data={data}
      />
    </div>
  );
})

export default LineChart;