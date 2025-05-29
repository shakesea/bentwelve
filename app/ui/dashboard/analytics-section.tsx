import { MonthlySales, fetchTotalProducts, fetchTotalRevenue, fetchMostSoldProduct } from '../../lib/data';

const AnalyticsSection = async ({ monthlySales }: { monthlySales: MonthlySales[] }) => {
  try {
    const [totalProducts, totalRevenue, mostSoldProduct] = await Promise.all([
      fetchTotalProducts(),
      fetchTotalRevenue(),
      fetchMostSoldProduct(),
    ]);

    const formatCurrency = (value: number): string => {
      return `Rp ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    };

    return (
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Analitik Bisnis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Total Produk</h3>
            <p className="text-xl font-bold text-gray-800">{totalProducts}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Total Pendapatan</h3>
            <p className="text-xl font-bold text-gray-800">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Produk Terlaris</h3>
            <p className="text-xl font-bold text-gray-800">
              {mostSoldProduct ? mostSoldProduct.nama_produk : 'N/A'} 
              {mostSoldProduct && ` (${mostSoldProduct.total_sold} terjual)`}
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return (
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Analitik Bisnis</h2>
        <p className="text-red-500">Gagal memuat data analitik. Silakan coba lagi nanti.</p>
      </div>
    );
  }
};

export default AnalyticsSection;