"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id_produk: string;
  title: string;
  price: number | null;
  img: string;
  category: string;
  description: string;
  discount?: number;
  slug?: string;
  variant?: string;
  features?: string[];
  note?: string;
  createdAt?: string;
};

type Category = {
  name: string;
  count: number;
};

export default function FlowersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("Terbaru");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        if (response.ok) {
          setProducts(data);
          setFilteredProducts(data);

          const categoryCounts: { [key: string]: number } = {};
          data.forEach((product: Product) => {
            categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
          });

          const categoryList = Object.entries(categoryCounts).map(([name, count]) => ({
            name,
            count,
          }));
          setCategories(categoryList);
          setError(null);
        } else {
          throw new Error(data.error || "Gagal mengambil produk");
        }
      } catch (error) {
        console.error("Kesalahan saat mengambil produk:", error);
        setError((error as Error).message || "Terjadi kesalahan saat memuat produk.");
      }
    };

    const timeout = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Filter and sort products
  useEffect(() => {
    let resultProducts = [...products];

    // Apply search filter
    if (searchQuery) {
      resultProducts = resultProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      resultProducts = resultProducts.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "Harga: Rendah ke Tinggi":
        resultProducts.sort((a, b) => {
          const priceA = a.discount || a.price || 0;
          const priceB = b.discount || b.price || 0;
          return priceA - priceB;
        });
        break;
      case "Harga: Tinggi ke Rendah":
        resultProducts.sort((a, b) => {
          const priceA = a.discount || a.price || 0;
          const priceB = b.discount || b.price || 0;
          return priceB - priceA;
        });
        break;
      case "Terbaru":
      default:
        resultProducts.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA; // Newest first
        });
        break;
    }

    setFilteredProducts(resultProducts);
  }, [products, searchQuery, sortOption, selectedCategories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const closeModal = () => setSelectedProduct(null);
  const increaseQty = () => setQuantity((qty) => qty + 1);
  const decreaseQty = () => setQuantity((qty) => (qty > 1 ? qty - 1 : 1));

  const getStaticPathFromSlug = (id_produk: string) => {
    return `/customers/flowers/detail/${id_produk}`;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-white">
        <div className="p-6 text-center text-red-600 bg-white/80 backdrop-blur-md rounded-xl shadow-lg">
          <p className="text-xl font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition duration-300"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white p-4 md:p-10">
      <h1 className="romanesca text-4xl md:text-5xl font-bold text-center text-pink-800 mb-10 animate-fade-in">
        Pilih Bunga Anda
      </h1>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Urutkan berdasarkan:</label>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="w-full p-2 border border-pink-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-400 transition"
            >
              <option value="Terbaru">Terbaru</option>
              <option value="Harga: Rendah ke Tinggi">Harga: Rendah ke Tinggi</option>
              <option value="Harga: Tinggi ke Rendah">Harga: Tinggi ke Rendah</option>
            </select>
          </div>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Cari..."
              className="w-full p-2 border border-pink-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-400 transition"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-pink-700 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              Kategori
            </h2>
            <div className="space-y-3">
              {categories.map((category, index) => (
                <label key={index} className="flex items-center gap-2 text-gray-700 hover:text-pink-600 transition">
                  <input
                    type="checkbox"
                    className="accent-pink-500"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => handleCategoryChange(category.name)}
                  />
                  {category.name} ({category.count})
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1 p-4 md:p-10 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-white to-pink-50"
                >
                  <div className="w-full h-[150px] overflow-hidden rounded-lg">
                    <Image
                      src={product.img}
                      alt={product.title}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">{product.title}</h3>
                    <div className="mb-2">
                      {product.discount ? (
                        <>
                          <span className="line-through text-sm text-gray-500 mr-2">Rp{product.price?.toLocaleString("id-ID")}</span>
                          <span className="text-pink-600 font-bold text-lg">Rp{product.discount.toLocaleString("id-ID")}</span>
                        </>
                      ) : (
                        <span className="font-bold text-gray-900 text-lg">Rp{product.price?.toLocaleString("id-ID")}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition duration-300 font-medium"
                    >
                      Tambah ke Keranjang
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">Tidak ada produk yang ditemukan.</p>
            )}
          </div>
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-pink-600 transition"
            >
              ✕
            </button>

            <div className="w-full h-[220px] overflow-hidden rounded-lg">
              <Image
                src={selectedProduct.img}
                alt={selectedProduct.title}
                width={400}
                height={300}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">{selectedProduct.title}</h2>
            <p className="text-sm text-gray-600 mb-2">Kategori: {selectedProduct.category}</p>
            <p className="text-gray-700 mb-3 line-clamp-3">{selectedProduct.description}</p>
            <div className="mb-3">
              {selectedProduct.discount ? (
                <>
                  <span className="line-through text-sm text-gray-500 mr-2">Rp{product.price?.toLocaleString("id-ID")}</span>
                  <span className="text-pink-600 font-bold text-xl">Rp{selectedProduct.discount.toLocaleString("id-ID")}</span>
                </>
              ) : (
                <span className="text-gray-900 font-bold text-xl">Rp{selectedProduct.price?.toLocaleString("id-ID")}</span>
              )}
            </div>
            <div className="flex items-center mb-4">
              <button
                onClick={decreaseQty}
                className="w-10 h-10 bg-gray-200 rounded-l-full flex items-center justify-center hover:bg-gray-300 transition"
              >
                −
              </button>
              <span className="w-12 text-center py-2 border-t border-b border-gray-300">{quantity}</span>
              <button
                onClick={increaseQty}
                className="w-10 h-10 bg-gray-200 rounded-r-full flex items-center justify-center hover:bg-gray-300 transition"
              >
                +
              </button>
            </div>
            <button
              className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition duration-300 font-semibold"
              onClick={() => alert(`Menambahkan ${quantity} item '${selectedProduct.title}' ke keranjang!`)}
            >
              Tambah ke Keranjang
            </button>

            <Link href={getStaticPathFromSlug(selectedProduct.id_produk)}>
              <button className="w-full mt-4 bg-pink-100 text-pink-600 py-3 rounded-lg hover:bg-pink-200 transition duration-300 font-medium">
                Detail Produk
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}