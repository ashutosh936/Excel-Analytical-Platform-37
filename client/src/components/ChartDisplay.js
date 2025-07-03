import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartDisplay = ({ data, xKey, yKey, type = 'bar' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || !xKey || !yKey) return;
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type,
      data: {
        labels: data.map(row => row[xKey]),
        datasets: [
          {
            label: `${yKey} vs ${xKey}`,
            data: data.map(row => row[yKey]),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
      },
    });
    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [data, xKey, yKey, type]);

  return <canvas ref={chartRef} />;
};

export default ChartDisplay; 