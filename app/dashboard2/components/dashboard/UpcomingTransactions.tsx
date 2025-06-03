'use client';

import { UpcomingTransaction } from '@/app/lib/data';

interface UpcomingTransactionsProps {
  transaction: UpcomingTransaction | null;
}

export default function UpcomingTransactions({ transaction }: UpcomingTransactionsProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Latest Upcoming Transaction</h3>
      <div className="space-y-3">
        {!transaction ? (
          <p className="text-sm text-gray-500">No upcoming transactions found.</p>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-700">{transaction.title}</p>
                <p className="text-sm text-gray-700">{transaction.date}</p>
              </div>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  transaction.status === 'Confirmed'
                    ? 'bg-green-100 text-green-700'
                    : transaction.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {transaction.status}
              </span>
            </div>
            <div className="text-sm text-gray-700">
              <p>
                <span className="font-medium">Customer:</span> {transaction.nama_pembeli}
              </p>
              <p>
                <span className="font-medium">Total:</span> Rp {Number(transaction.total_harga).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
