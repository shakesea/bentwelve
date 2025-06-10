"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateTransactionPage() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products"); // Changed to correct endpoint
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        console.log("Fetched products data:", data); // Debug: Log the full response
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("No products array in response:", data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    }
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: selectedProductId,
        quantity,
        buyer_name: buyerName,
        date: transactionDate,
      }),
    });

    router.push("/dashboard/report");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white p-6">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Add New Transaction</h1>
        <Link
          href="/dashboard/report"
          className="rounded-lg bg-gray-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-gray-700 hover:shadow-lg"
        >
          Back to Report
        </Link>
      </div>

      {/* Create Transaction Form */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Buyer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Buyer Name</label>
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction Date</label>
            <input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              required
            />
          </div>

          {/* Product */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
            >
              <option value="">Select a product</option>
              {products.length > 0 ? (
                products.map((product: any) => (
                  <option key={product.id_produk} value={product.id_produk}>
                    {product.title} - Rp{product.price?.toLocaleString("id-ID")}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No products available
                </option>
              )}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/dashboard/report"
              className="rounded-lg bg-gray-400 px-6 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-gray-500 hover:shadow-lg"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-pink-600 px-6 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-pink-700 hover:shadow-lg"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}