// app/api/products/detail/[id]/route.ts
import { NextResponse } from "next/server";
import { Pool } from "pg";

// Konfigurasi koneksi database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      "SELECT id_produk, nama_produk, harga, gambar, kategori, deskripsi FROM products WHERE id_produk = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    const product = {
      id_produk: result.rows[0].id_produk,
      title: result.rows[0].nama_produk,
      price: result.rows[0].harga ? Number(result.rows[0].harga) : null,
      img: result.rows[0].gambar || "/default-image.jpg",
      category: result.rows[0].kategori,
      description: result.rows[0].deskripsi || "Deskripsi tidak tersedia.",
    };

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Kesalahan saat mengambil produk:", error);
    return NextResponse.json(
      { error: "Gagal mengambil produk", details: (error as Error).message },
      { status: 500 }
    );
  } finally {
    if (client) client.release(); // Pastikan koneksi ditutup
  }
}