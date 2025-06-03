'use client';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ExpensesGraph() {
  const { theme } = useTheme();
  const [chartOptions, setChartOptions] = useState<any>({});
  const [series, setSeries] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/monthly-expenses');
        const data = await res.json();

        console.log('Expenses API data:', data); // debug

        const monthLabels = data.map((d: any) => d.month);
        const expenseData = data.map((d: any) => Number(d.expenses) / 1000); // jika expenses dalam rupiah

        setChartOptions({
          chart: { type: 'line', height: 250, toolbar: { show: false } },
          colors: ['#EF4444'],
          stroke: { curve: 'smooth', width: 2 },
          dataLabels: { enabled: false },
          grid: { borderColor: '#e0e0e0' },
          xaxis: {
            categories: monthLabels,
            axisBorder: { show: false },
          },
          yaxis: {
            labels: {
              formatter: (val: number) => `${val.toLocaleString('id-ID')}k`,
            },
          },
          tooltip: { theme: theme === 'dark' ? 'dark' : 'light' },
        });

        setSeries([{ name: 'Expenses', data: expenseData }]);
      } catch (error) {
        console.error('Error loading expenses data:', error);
      }
    }

    fetchData();
  }, [theme]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Expenses</h3>
      <Chart options={chartOptions} series={series} type="line" width="100%" height="250px" />
    </div>
  );
}
