// app/dashboard2/components/dashboard/StatsCards.tsx
import { fetchCardData } from '@/app/lib/data';

export default async function StatsCards() {
  const { totalProducts, totalUsers, totalProfit, productChange, userChange, profitChange } = await fetchCardData();
  const totalViews = 12500; // Tetap statis karena belum ada tabel views

  // Format change untuk ditampilkan
  const formatChange = (value: number, isPercentage: boolean = false) => {
    if (isPercentage) {
      return `${value > 0 ? '+' : value < 0 ? '-' : ''}${Math.abs(value).toFixed(1)}${isPercentage ? '%' : ''}`;
    }
    return `${value > 0 ? '+' : value < 0 ? '-' : ''}${Math.abs(value)}`;
  };

  const stats = [
    {
      title: 'Total Views',
      value: totalViews.toLocaleString(),
      change: '+10%', // Tetap statis karena belum ada data historis untuk views
      color: 'text-blue-600',
    },
    {
      title: 'Total Profit',
      value: `Rp ${totalProfit.toLocaleString('id-ID')}`,
      change: formatChange(profitChange, true), // Perubahan dalam persen
      color: 'text-green-600',
    },
    {
      title: 'Total Products',
      value: totalProducts.toString(),
      change: formatChange(productChange),
      color: 'text-purple-600',
    },
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      change: formatChange(userChange),
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            {stat.title}
          </h3>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          <p className={`flex items-center font-medium ${stat.color}`}>
            <span className="mr-1">{stat.change !== '0' && stat.change !== '0%' ? (stat.change.startsWith('+') ? '↑' : '↓') : ''}</span>
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
}