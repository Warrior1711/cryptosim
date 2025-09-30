import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function CryptoChart({ history, coin }) {
  const data = {
    labels: history.map((_, i) => `T${i}`),
    datasets: [
      {
        label: `${coin.symbol} Price`,
        data: history,
        borderColor: '#00b894',
        backgroundColor: 'rgba(0,184,148,0.1)',
        tension: 0.2,
      }
    ]
  };
  const options = {
    plugins: {
      legend: { labels: { color: '#f5f6fa' } }
    },
    scales: {
      x: { ticks: { color: '#f5f6fa' }, grid: { color: '#282c34' } },
      y: { ticks: { color: '#f5f6fa' }, grid: { color: '#282c34' } }
    }
  };
  return <Line data={data} options={options} />;
}
