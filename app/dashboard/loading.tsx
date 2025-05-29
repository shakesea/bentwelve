export default function LoadingDashboard() {
  return (
    <div className="p-6 md:p-8 mt-6 min-h-screen space-y-6">
      <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Produk", valueWidth: "w-16" },
          { label: "Total Pendapatan", valueWidth: "w-24" },
          { label: "Produk Paling Banyak Terjual", valueWidth: "w-32" },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-4 border border-gray-200">
            <div className="text-sm text-gray-500 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="text-xl font-bold text-gray-800 animate-pulse mt-2">
              <div className={`h-6 bg-gray-200 rounded ${item.valueWidth}`}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80 bg-gray-100 rounded-xl animate-pulse"></div>
        <div className="h-80 bg-gray-100 rounded-xl animate-pulse"></div>
      </div>

      <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
    </div>
  );
}