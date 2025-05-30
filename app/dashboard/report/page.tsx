import Image from 'next/image';
import { fetchFilteredTransactions, fetchTransactionCount } from 'app/lib/data';
import { notFound } from 'next/navigation';

export default async function ReportPage({ searchParams }: { searchParams?: { q?: string; page?: string } }) {
  const query = searchParams?.q || '';
  const currentPage = Number(searchParams?.page) || 1;
  const ITEMS_PER_PAGE = 10;

  // Fetch data
  const transactions = await fetchFilteredTransactions(query, currentPage);
  const totalTransactions = await fetchTransactionCount(query);

  if (currentPage < 1 || (!transactions.length && totalTransactions > 0)) {
    notFound(); // Optional: if invalid page
  }

  const totalPages = Math.ceil(totalTransactions / ITEMS_PER_PAGE);

  return (
    <div className="p-6 md:p-8 mt-6 min-h-screen bg-pink-50">
      {/* Profile Card */}
      <div className="flex items-center gap-4 p-4 bg-white text-black rounded-2xl shadow-lg w-64 mt-4 md:mt-0 ml-auto">
        <Image
          src="/Kucing.png"
          alt="User Profile"
          width={48}
          height={48}
          className="w-12 h-12 rounded-full border-4 border-green-500"
        />
        <div className="text-right flex-1">
          <p className="font-semibold text-base">Welcome, Monkey</p>
          <p className="text-sm text-gray-500 truncate">monkey@gmail.com</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Transaction Reports</h1>
      </div>

      {/* Filter Bar */}
      <form method="GET" className="flex items-center gap-4 mb-6">
        <input
          type="text"
          name="q"
          placeholder="Search by buyer name"
          defaultValue={query}
          className="px-4 py-2 rounded-md border border-gray-300"
        />
        <button
          type="submit"
          className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-sm text-left border-separate border-spacing-0">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="border border-gray-200 px-4 py-3">NO</th>
              <th className="border border-gray-200 px-4 py-3">ID TRANSACTION</th>
              <th className="border border-gray-200 px-4 py-3">PRODUCT ID</th>
              <th className="border border-gray-200 px-4 py-3">BUYER NAME</th>
              <th className="border border-gray-200 px-4 py-3">DATE TIME</th>
              <th className="border border-gray-200 px-4 py-3">TOTAL PRICE</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-6">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((r, idx) => (
                <tr key={r.id_transaksi} className={idx % 2 === 0 ? 'bg-white' : 'bg-pink-50'}>
                  <td className="border border-gray-200 px-4 py-3 text-center">
                    {String(idx + 1 + (currentPage - 1) * ITEMS_PER_PAGE).padStart(2, '0')}
                  </td>
                  <td className="border border-gray-200 px-4 py-3">{r.id_transaksi}</td>
                  <td className="border border-gray-200 px-4 py-3">{r.id_produk}</td>
                  <td className="border border-gray-200 px-4 py-3">{r.nama_pembeli}</td>
                  <td className="border border-gray-200 px-4 py-3">
                    {new Date(r.tanggal).toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
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
              className={`px-3 py-1 rounded-md ${
                currentPage === i + 1 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'
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
