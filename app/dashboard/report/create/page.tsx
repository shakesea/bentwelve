"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createTransaction } from "@/app/lib/actions";

// Definisikan tipe untuk produk berdasarkan respons API
interface Product {
  id_produk: string;
  title: string; // Sesuai dengan 'title' dari API
  price: number | null; // Sesuai dengan 'price' dari API
  category: string;
  img: string;
  description: string | null;
  createdAt: string | undefined;
  total_sold: number;
}

export default function CreateTransactionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        console.log("Fetched products data (raw):", data); // Debug: Log full response
        if (data.products && Array.isArray(data.products)) {
          // Validasi dan mapping data dari API
          const validatedProducts = data.products.map((product: any, index: number) => {
            console.log(`Product ${index}:`, product); // Log setiap produk
            return {
              id_produk: product.id_produk || "",
              title: product.title || `Product ${index + 1}`, // Gunakan 'title' dari API
              price: typeof product.price === "number" ? product.price : 0,
              category: product.category || "",
              img: product.img || "/default-image.jpg",
              description: product.description || null,
              createdAt: product.createdAt || "",
              total_sold: typeof product.total_sold === "number" ? product.total_sold : 0,
            };
          });
          setProducts(validatedProducts);
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
    const formData = new FormData();

    const selectedProduct = products.find((p) => p.id_produk === selectedProductId);
    if (!selectedProduct) {
      alert("Please select a valid product.");
      return;
    }
    const productPrice = typeof selectedProduct.price === "number" ? selectedProduct.price : 0;

    formData.append("productId", selectedProductId);
    formData.append("buyerName", buyerName);
    formData.append("totalPrice", (quantity * productPrice).toString());
    formData.append("date", new Date(transactionDate).toISOString());
    formData.append("userId", "");

    try {
      await createTransaction(null, formData);
      router.push("/dashboard/report");
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert((error as Error).message || "Failed to create transaction");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Add New Transaction</h1>
        <Link
          href="/dashboard/report"
          className="rounded-lg bg-gray-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-gray-700 hover:shadow-lg"
        >
          Back to Report
        </Link>
      </div>

      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
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
                products.map((product) => (
                  <option key={product.id_produk} value={product.id_produk}>
                    {product.title + " - Rp" + (product.price || 0).toLocaleString("id-ID")}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No products available
                </option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => {
                const newValue = parseInt(e.target.value) || 1;
                console.log("New quantity value:", newValue); // Debug
                setQuantity(newValue >= 1 ? newValue : 1);
              }}
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