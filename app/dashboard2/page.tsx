import { fetchBestSellingProducts, fetchUpcomingTransactions } from '@/app/lib/data';
import StatsCards from '@/app/dashboard2/components/dashboard/StatsCards';
import RevenueGraph from '@/app/dashboard2/components/dashboard/RevenueGraph';
import ExpensesGraph from '@/app/dashboard2/components/dashboard/ExpensesGraph';
import SalesGraph from '@/app/dashboard2/components/dashboard/SalesGraph';
import UpcomingTransactions from '@/app/dashboard2/components/dashboard/UpcomingTransactions';
import BestSellingProducts from '@/app/dashboard2/components/dashboard/BestSellingProducts';

export default async function Dashboard() {
  const bestSellingProducts = await fetchBestSellingProducts();
  const latestTransaction = await fetchUpcomingTransactions();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Flowerscotch Dashboard</h1>
        {/* Four Cards */}
        <StatsCards />
        {/* Three-Grid Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <RevenueGraph />
          <ExpensesGraph />
          <SalesGraph />
        </div>
        {/* Two-Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UpcomingTransactions transaction={latestTransaction} />
          <BestSellingProducts products={bestSellingProducts} />
        </div>
      </main>
    </div>
  );
}