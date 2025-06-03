// app/report/page.tsx
import { fetchFilteredTransactions, fetchTransactionCount } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function ReportPage({
  searchParams,
}: {
  searchParams?: { q?: string; page?: string };
}) {
  const query = searchParams?.q || '';
  const currentPage = Number(searchParams?.page) || 1;
  const ITEMS_PER_PAGE = 10;

  const transactions = await fetchFilteredTransactions(query, currentPage);
  const totalTransactions = await fetchTransactionCount(query);

  if (currentPage < 1 || (!transactions.length && totalTransactions > 0)) {
    notFound();
  }

  const totalPages = Math.ceil(totalTransactions / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Transaction Reports</h1>
      </div>

      {/* Search */}
      <div className="mb-6">
        <form method="GET" className="flex items-center space-x-2">
          <input
            type="text"
            name="q"
            placeholder="Search by buyer name..."
            defaultValue={query}
            className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
          />
          <button
            type="submit"
            className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-pink-700 hover:shadow-lg"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-pink-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">No</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID Transaction</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Buyer Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date Time</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 animate-fade-in">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((r, idx) => (
                <tr
                  key={r.id_transaksi}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {String(idx + 1 + (currentPage - 1) * ITEMS_PER_PAGE).padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {r.id_transaksi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {r.nama_pembeli}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(r.tanggal).toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {'Rp ' + Number(r.total_harga).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <a
              key={i}
              href={`?q=${query}&page=${i + 1}`}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                currentPage === i + 1
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
