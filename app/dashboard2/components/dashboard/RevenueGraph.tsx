'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// Load Chart only on client-side
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function RevenueGraph() {
  const { theme } = useTheme();

  const [chartOptions, setChartOptions] = useState<any>({});
  const [series, setSeries] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/monthly-metrics');
        const data = await res.json(); // <-- penting!

        console.log('Revenue API data:', data);

        const monthLabels = data.map((d: any) => d.month);
        const salesData = data.map((d: any) => Number(d.sales) / 1000);

        console.log('Categories:', monthLabels);
        console.log('Series:', salesData);

        setCategories(monthLabels);
        setSeries([{ name: 'Revenue', data: salesData }]);
      } catch (error) {
        console.error('Failed to fetch revenue data:', error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    setChartOptions({
      chart: {
        type: 'line',
        height: 250,
        toolbar: { show: false },
      },
      colors: ['#3B82F6'],
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: '#e0e0e0',
      },
      xaxis: {
        categories,
        axisBorder: { show: false },
      },
      yaxis: {
        labels: {
          formatter: (val: number) => `$${val}k`,
        },
      },
      tooltip: {
        theme: theme === 'dark' ? 'dark' : 'light',
      },
    });
  }, [theme, categories]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Revenue</h3>

      {/* Hanya render chart jika datanya sudah tersedia */}
      {series.length > 0 && categories.length > 0 ? (
        <Chart
          options={chartOptions}
          series={series}
          type="line"
          width="100%"
          height="250px"
        />
      ) : (
        <p className="text-sm text-gray-500">Loading chart data...</p>
      )}
    </div>
  );
}
