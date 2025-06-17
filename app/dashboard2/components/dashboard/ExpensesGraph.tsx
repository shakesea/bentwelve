'use client';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useEffect, useState, useMemo } from 'react';

// Import with proper type definition
const Chart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => <p className="text-sm text-gray-500">Loading chart...</p>
});

type ExpenseData = {
  month: string;
  expenses: number;
};

export default function ExpensesGraph() {
  const { theme } = useTheme();
  const [chartData, setChartData] = useState<{
    labels: string[];
    values: number[];
    isLoading: boolean;
  }>({
    labels: [],
    values: [],
    isLoading: true
  });

  // Memoize chart options to prevent unnecessary recalculations
  const chartOptions = useMemo(() => ({
    chart: { 
      type: "line" as const, 
      height: 250, 
      toolbar: { show: false },
      background: 'transparent'
    },
    colors: ['#EF4444'],
    stroke: { curve: "smooth" as "smooth", width: 2 },
    dataLabels: { enabled: false },
    grid: { 
      borderColor: theme === 'dark' ? '#374151' : '#e0e0e0',
      strokeDashArray: 5,
    },
    legend: {
      show: true,
      position: 'top' as 'top',
      horizontalAlign: 'right' as 'right',
      labels: {
        colors: theme === 'dark' ? '#fff' : '#000'
      }
    },
    markers: { size: 4, hover: { size: 6 } },
    xaxis: {
      categories: chartData.labels,
      axisBorder: { show: false },
      labels: {
        style: {
          colors: theme === 'dark' ? '#fff' : '#000'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `Rp ${val.toLocaleString('id-ID')}`,
        style: {
          colors: theme === 'dark' ? '#fff' : '#000'
        }
      },
    },
    tooltip: { 
      enabled: true,
      shared: true,
      intersect: false,
      theme: theme === 'dark' ? 'dark' : 'light',
      y: {
        formatter: (val: number) => `Rp ${val.toLocaleString('id-ID')}`,
        title: { formatter: () => 'Expenses: ' },
      },
    },
  }), [chartData.labels, theme]);

  // Memoize series data
  const series = useMemo(() => [{
    name: "Expenses",
    data: chartData.values
  }], [chartData.values]);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      try {
        const res = await fetch('/api/monthly-expenses');
        const data: ExpenseData[] = await res.json();

        if (!isMounted) return;

        const labels = data.map(d => {
          const [year, month] = d.month.split('-');
          return new Date(+year, +month - 1).toLocaleDateString('id-ID', { 
            month: 'short', 
            year: 'numeric' 
          });
        });
        
        const values = data.map(d => Number(d.expenses));

        setChartData({
          labels,
          values,
          isLoading: false
        });
      } catch (error) {
        console.error('Error loading expenses data:', error);
        if (isMounted) {
          setChartData(prev => ({ ...prev, isLoading: false }));
        }
      }
    }

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-4 rounded-lg shadow`}>
      <h3 className="text-lg font-semibold mb-4">Expenses</h3>
      {!chartData.isLoading && chartData.values.length > 0 ? (
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