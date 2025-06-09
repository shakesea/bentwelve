// app/api/products/route.ts
import { NextResponse } from "next/server";
import { Pool } from "pg";

// Konfigurasi koneksi database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT id_produk, nama_produk, harga, gambar, kategori, deskripsi FROM products"
    );
    await client.release();

    const products = result.rows.map((row) => ({
      id_produk: row.id_produk,
      title: row.nama_produk,
      price: row.harga ? Number(row.harga) : null,
      img: row.gambar || "/default-image.jpg",
      category: row.kategori,
      description: row.deskripsi || "Deskripsi tidak tersedia.",
    }));

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Kesalahan saat mengambil daftar produk:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar produk" }, { status: 500 });
  }
}