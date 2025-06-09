// app/customers/flowers/detail/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

type Product = {
  id_produk: string;
  title: string;
  price: number | null;
  img: string;
  category: string;
  description: string;
};

export default function FlowerDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [variant, setVariant] = useState("Round Arrangement");
  const [customRequest, setCustomRequest] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id?: string }; // Ketik eksplisit untuk id

  useEffect(() => {
    if (!id) {
      setError("ID produk tidak ditemukan.");
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/detail/${id}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Gagal mengambil produk");
        }
        setProduct(data);
        setError(null); // Reset error jika sukses
      } catch (error) {
        console.error("Kesalahan saat mengambil produk:", error);
        setError((error as Error).message || "Terjadi kesalahan.");
      }
    };

    fetchProduct();
  }, [id]);

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
        <button
          onClick={() => router.push("/customers/flowers")}
          className="mt-4 bg-pink-100 text-pink-600 px-4 py-2 rounded-md hover:bg-pink-200"
        >
          Kembali ke Daftar Bunga
        </button>
      </div>
    );
  }

  if (!product) {
    return <div className="p-6 text-center">Memuat...</div>;
  }

  return (
    <div className="relative">
      <button
        onClick={() => router.push("/customers/flowers")}
        className="absolute top-4 left-4 bg-pink-100 text-pink-600 px-4 py-2 rounded-md hover:bg-pink-200 font-semibold"
      >
        ←
      </button>

      <div className="flex flex-col lg:flex-row gap-12 p-6 md:p-12 max-w-7xl mx-auto">
        <div className="flex-1">
          <Image
            src={product.img}
            alt={product.title}
            width={600}
            height={600}
            className="rounded-xl shadow-lg w-full h-auto object-cover"
          />
        </div>

        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">{product.title}</h1>
          <h2 className="text-xl text-gray-700 font-semibold">{product.category}</h2>
          <p className="text-lg text-pink-600 font-bold">
            Rp {product.price?.toLocaleString("id-ID") || "Harga tidak tersedia"}
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Varian</label>
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option>Round Arrangement</option>
              <option>Heart Arrangement</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Permintaan Kustomisasi</label>
            <input
              type="text"
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="contoh: Tambah label nama, pilih warna pink"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="border rounded-md w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100"
            >
              −
            </button>
            <span className="px-4">{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="border rounded-md w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100"
            >
              +
            </button>
          </div>

          <button
            onClick={() => alert("Ditambahkan ke keranjang!")}
            className="w-full border border-pink-500 text-pink-600 hover:bg-pink-50 py-2 rounded-md font-semibold"
          >
            Tambah ke Keranjang
          </button>

          <div className="text-sm text-gray-600 mt-6">
            <p>{product.description}</p>
            <div className="mt-4">
              <p className="font-semibold text-gray-800 mb-1">Apa yang Anda dapatkan*</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li><em>Bunga Premium</em></li>
                <li><em>Bunga campuran atau warna pilihan</em></li>
                <li><em>Tema warna buket kami</em></li>
                <li><em>Pembungkus Premium</em></li>
                <li><em>Kartu Ucapan Kustom</em></li>
                <li><em>Kertas URR (minimal 5)</em></li>
              </ul>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              *Foto dan hasil rangkaian mungkin sedikit berbeda karena pencahayaan dan ketersediaan bunga. Kami akan selalu mengonfirmasi dengan pelanggan sebelum mengirim rangkaian.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}