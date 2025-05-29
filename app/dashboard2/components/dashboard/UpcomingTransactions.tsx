'use client';

export default function UpcomingTransactions() {
  const transactions = [
    { title: 'Rose Bouquet Order', date: 'May 25, 2025', status: 'Pending' },
    { title: 'Tulip Arrangement', date: 'May 26, 2025', status: 'Processing' },
    { title: 'Lily Order', date: 'May 28, 2025', status: 'Confirmed' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Upcoming Transactions</h3>
      <div className="space-y-3">
        {transactions.map((transaction, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
            <div>
              <p className="font-medium">{transaction.title}</p>
              <p className="text-sm text-gray-500">{transaction.date}</p>
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
        ))}
      </div>
    </div>
  );
}