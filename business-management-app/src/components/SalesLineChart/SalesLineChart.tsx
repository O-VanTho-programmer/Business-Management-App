import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

type Props = {
  chartData: Record<string, {type: string, total_price: Number}[]>;
};

export default function SalesLineChart({ chartData }: Props) {

  const labels = Object.keys(chartData);

  const orderData = labels.map(date => {
    const entry = chartData[date].find(item => item.type === 'ORDER');
    return entry ? entry.total_price : 0;
  });
  const sellData = labels.map(date => {
    const entry = chartData[date].find(item => item.type === 'SELL');
    return entry ? entry.total_price : 0;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Orders',
        data: orderData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: 'Sales',
        data: sellData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#374151',
          font: { size: 14, weight: 700 },
        },
      },
      title: {
        display: true,
        text: 'Monthly Orders vs. Sales',
        color: '#111827',
        font: {
          size: 18,
          weight: 700,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${ctx.formattedValue}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#6b7280' },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#6b7280' },
        grid: { color: '#e5e7eb' },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md min-h-[450px] w-full">
      <Line data={data} options={options} />
    </div>
  );
}
