'use client';

export default function StatsCards() {
  const stats = [
    { title: 'Total Views', value: '12,500', change: '+5%', color: 'text-blue-600' },
    { title: 'Total Profit', value: '$15,750', change: '+8%', color: 'text-green-600' },
    { title: 'Total Products', value: '48', change: '+2', color: 'text-purple-600' },
    { title: 'Total Users', value: '3,200', change: '+10%', color: 'text-orange-600' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">{stat.title}</h3>
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className={`flex items-center ${stat.color}`}>
            <span className="mr-1">↑</span>{stat.change}
          </p>
        </div>
      ))}
    </div>
  );
}