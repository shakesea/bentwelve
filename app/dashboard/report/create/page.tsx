'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTransactionPage() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch('/api/productslagi'); // Ganti sesuai endpoint produk kamu
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: selectedProductId,
        quantity,
        buyer_name: buyerName,
        date: transactionDate,
      }),
    });

    router.push('/dashboard/report');
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-xl font-bold mb-4">Add New Transaction</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Buyer Name */}
        <div>
          <label className="block mb-1 font-medium">Buyer Name</label>
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 font-medium">Transaction Date</label>
          <input
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        {/* Product */}
        <div>
          <label className="block mb-1 font-medium">Product</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            required
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">Select a product</option>
            {products.map((product: any) => (
              <option key={product.id_produk} value={product.id_produk}>
                {product.nama_produk} - Rp{product.harga}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block mb-1 font-medium">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded"
        >
          Save Transaction
        </button>
      </form>
    </div>
  );
}
