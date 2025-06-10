"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

type CartItem = {
  id_produk: string;
  title: string;
  price: number | null;
  img: string;
  description: string;
  variant: string;
  customRequest: string;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(storedCart);
    }
  }, []);

  const updateCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    if (typeof window !== 'undefined') {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const updateItemQuantity = (id_produk: string, variant: string, customRequest: string, action: 'increase' | 'decrease' | 'remove') => {
    const updatedCart = action === 'remove' 
      ? cart.filter(item => !(item.id_produk === id_produk && item.variant === variant && item.customRequest === customRequest))
      : cart.map(item => {
          if (item.id_produk === id_produk && item.variant === variant && item.customRequest === customRequest) {
            if (action === 'increase') return { ...item, quantity: item.quantity + 1 };
            if (action === 'decrease' && item.quantity > 1) return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        });
    updateCart(updatedCart);
  };
  
  const increaseQty = (id_produk: string, variant: string, customRequest: string) => 
    updateItemQuantity(id_produk, variant, customRequest, 'increase');
  
  const decreaseQty = (id_produk: string, variant: string, customRequest: string) => 
    updateItemQuantity(id_produk, variant, customRequest, 'decrease');
  
  const removeItem = (id_produk: string, variant: string, customRequest: string) => 
    updateItemQuantity(id_produk, variant, customRequest, 'remove');

  const clearCart = () => {
    updateCart([]);
  };

  const calculateTotal = React.useMemo(() => {
    return cart.reduce((total, item) => {
      const price = item.price || 0;
      return total + price * item.quantity;
    }, 0);
  }, [cart]);

  const handleCheckout = async () => {
    if (status === "loading") return;
    if (!session || !session.user?.id) {
      alert("Anda harus login terlebih dahulu!");
      return;
    }
    if (cart.length === 0) {
      alert("Keranjang belanja Anda kosong!");
      return;
    }

    setLoading(true);
    try {
      const transactionData = {
        nama_pembeli: session.user?.name || (session.user?.email ? session.user.email.split("@")[0] : "Guest"),
        tanggal: new Date().toISOString(),
        total_harga: calculateTotal,
        id_user: session.user?.id,
        status: "Pending",
        items: cart.map((item) => ({
          id_produk: item.id_produk,
          jumlah: item.quantity,
        })),
      };
      
      // Log the transaction data to verify id_produk is included
      console.log("Transaction items:", transactionData.items);

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`Gagal membuat transaksi: ${responseData.error || "Unknown error"}`);
      }

      clearCart();
      alert("Checkout berhasil! Transaksi telah dibuat.");
    } catch (error: any) {
      console.error("Kesalahan saat checkout:", error);
      alert(`Terjadi kesalahan saat checkout: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white p-4 md:p-10">
      <h1 className="romanesca text-4xl md:text-5xl font-bold text-center text-pink-800 mb-10 animate-fade-in">
        Keranjang Belanja
      </h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="text-xl mb-4">Keranjang Anda kosong.</p>
          <Link href="/customers/flowers">
            <button className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition duration-300">
              Belanja Sekarang
            </button>
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {cart.map((item, index) => (
              <div
                key={`${item.id_produk}-${item.variant}-${item.customRequest}-${index}`}
                className="bg-white rounded-xl p-4 shadow-md flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-br from-white to-pink-50"
              >
                <div className="w-24 h-24 overflow-hidden rounded-lg">
                  <Image
                    src={item.img}
                    alt={item.title}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                  <p className="text-sm text-gray-700">Varian: {item.variant}</p>
                  {item.customRequest && (
                    <p className="text-sm text-gray-700">Kustomisasi: {item.customRequest}</p>
                  )}
                  <div className="mb-2">
                    <span className="font-bold text-gray-900">
                      Rp{(item.price || 0).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(item.id_produk, item.variant, item.customRequest)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                    >
                      −
                    </button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.id_produk, item.variant, item.customRequest)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id_produk, item.variant, item.customRequest)}
                      className="ml-4 text-red-600 hover:text-red-800 transition"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900">
                    Rp{((item.price || 0) * item.quantity).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={clearCart}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Kosongkan Keranjang
            </button>
            <div className="text-xl font-bold text-gray-900">
              Total: Rp{calculateTotal.toLocaleString("id-ID")}
            </div>
          </div>

          <button
            className="w-full mt-6 bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition duration-300 font-semibold"
            onClick={handleCheckout}
            disabled={loading || status === "loading" || !session}
          >
            {loading ? "Memproses..." : "Lanjut ke Checkout"}
          </button>
        </div>
      )}
    </div>
  );
}