import Image from 'next/image';
import { fetchTransactions } from '../../lib/data';

export default async function ReportPage() {
  const transactions = await fetchTransactions();

  return (
    <div className="p-6 md:p-8 mt-6 min-h-screen">
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 relative">
        <h1 className="text-3xl font-bold text-gray-800">Transaction Reports</h1>
      </div>

      {/* Filter Button */}
      <div className="flex justify-end mb-6">
        <button className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors">
          Filter
        </button>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-sm text-left border-separate border-spacing-0">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="border-t border-b border-l border-gray-200 px-4 py-3 first:rounded-tl-lg">NO</th>
              <th className="border-t border-b border-gray-200 px-4 py-3">ID TRANSACTION</th>
              <th className="border-t border-b border-gray-200 px-4 py-3">PRODUCT ID</th>
              <th className="border-t border-b border-gray-200 px-4 py-3">BUYER NAME</th>
              <th className="border-t border-b border-gray-200 px-4 py-3">DATE TIME</th>
              <th className="border-t border-b border-r border-gray-200 px-4 py-3 last:rounded-tr-lg">TOTAL PRICE</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="border-t border-b border-x border-gray-200 px-4 py-3 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((r, idx) => (
                <tr key={r.id_transaksi} className={idx % 2 === 0 ? "bg-white" : "bg-pink-50"}>
                  <td className="border-t border-b border-l border-gray-200 px-4 py-3 text-center">{String(idx + 1).padStart(2, '0')}</td>
                  <td className="border-t border-b border-gray-200 px-4 py-3">{r.id_transaksi}</td>
                  <td className="border-t border-b border-gray-200 px-4 py-3">{r.id_produk}</td>
                  <td className="border-t border-b border-gray-200 px-4 py-3">{r.nama_pembeli}</td>
                  <td className="border-t border-b border-gray-200 px-4 py-3">
                    {new Date(r.tanggal).toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="border-t border-b border-r border-gray-200 px-4 py-3">
                    {r.total_harga.replace('Rp', 'Rp ').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {transactions.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan={6} className="border-b border-x border-gray-200 first:rounded-bl-lg last:rounded-br-lg"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
