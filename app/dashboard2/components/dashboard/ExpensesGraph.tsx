'use client';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ExpensesGraph() {
  const { theme } = useTheme();
  const [chartOptions, setChartOptions] = useState<any>({});
  const [series, setSeries] = useState<any[]>([]);

  useEffect(() => {
    setChartOptions({
      chart: { type: 'line', height: 250, toolbar: { show: false } },
      colors: ['#EF4444'],
      stroke: { curve: 'smooth', width: 2 },
      dataLabels: { enabled: false },
      grid: { borderColor: '#e0e0e0' },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        axisBorder: { show: false },
      },
      yaxis: { labels: { formatter: (val: number) => `$${val}k` } },
      tooltip: { theme: theme === 'dark' ? 'dark' : 'light' },
    });
    setSeries([
      { name: 'Expenses', data: [3, 4, 2, 5, 3, 6] },
    ]);
  }, [theme]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Expenses</h3>
      <Chart options={chartOptions} series={series} type="line" width="100%" height="250px" />
    </div>
  );
}