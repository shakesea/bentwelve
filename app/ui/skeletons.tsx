export function AnalyticsSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8 animate-pulse">
      <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 bg-gray-100 rounded-lg h-20" />
        ))}
      </div>
    </div>
  );
}

export function RevenueChartSkeleton() {
  return (
    <div className="h-64 bg-white rounded-xl shadow p-6 animate-pulse" />
  );
}
