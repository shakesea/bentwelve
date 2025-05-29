'use client';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function SalesGraph() {
  const { theme } = useTheme();
  const [chartOptions, setChartOptions] = useState<any>({});
  const [series, setSeries] = useState<any[]>([]);

  useEffect(() => {
    setChartOptions({
      chart: { type: 'line', height: 250, toolbar: { show: false } },
      colors: ['#10B981'],
      stroke: { curve: 'smooth', width: 2 },
      dataLabels: { enabled: false },
      grid: { borderColor: '#e0e0e0' },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        axisBorder: { show: false },
      },
      yaxis: { labels: { formatter: (val: number) => `${val}` } },
      tooltip: { theme: theme === 'dark' ? 'dark' : 'light' },
    });
    setSeries([
      { name: 'Sales', data: [50, 70, 40, 80, 60, 90] },
    ]);
  }, [theme]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Sales</h3>
      <Chart options={chartOptions} series={series} type="line" width="100%" height="250px" />
    </div>
  );
}