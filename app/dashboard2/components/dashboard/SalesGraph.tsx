'use client';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function SalesGraph() {
  const { theme } = useTheme();
  const [chartOptions, setChartOptions] = useState<any>({});
  const [series, setSeries] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/monthly-metrics');
        const data = await res.json();

        console.log('Sales API data:', data); // debug

        const monthLabels = data.map((d: any) => d.month);
        const salesData = data.map((d: any) => Number(d.sales));

        setChartOptions({
          chart: { type: 'line', height: 250, toolbar: { show: false } },
          colors: ['#10B981'],
          stroke: { curve: 'smooth', width: 2 },
          dataLabels: { enabled: false },
          grid: { borderColor: '#e0e0e0' },
          xaxis: {
            categories: monthLabels,
            axisBorder: { show: false },
          },
          yaxis: {
            labels: {
              formatter: (val: number) => `${val.toLocaleString('id-ID')}`,
            },
          },
          tooltip: { theme: theme === 'dark' ? 'dark' : 'light' },
        });

        setSeries([{ name: 'Sales', data: salesData }]);
      } catch (error) {
        console.error('Error loading sales data:', error);
      }
    }

    fetchData();
  }, [theme]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Sales</h3>
      <Chart options={chartOptions} series={series} type="line" width="100%" height="250px" />
    </div>
  );
}
