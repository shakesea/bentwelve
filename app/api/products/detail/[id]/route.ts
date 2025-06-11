import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

type Params = {
  id: string; // UUID sebagai string
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> } // Menangani params sebagai Promise
) {
  try {
    const params = await context.params; // Tunggu resolusi params
    const id = params.id;
    console.log("Mengambil produk dengan ID:", id);
    const client = await pool.connect();

    try {
      const result = await client.query(
        "SELECT id_produk, nama_produk, harga, kategori, gambar, deskripsi, created_at, total_sold, image FROM products WHERE id_produk = $1",
        [id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
      }

      const product = {
        id_produk: result.rows[0].id_produk,
        title: result.rows[0].nama_produk,
        price: result.rows[0].harga ? Number(result.rows[0].harga) : null,
        category: result.rows[0].kategori,
        img: result.rows[0].gambar || "/default-image.jpg",
        description: result.rows[0].deskripsi || "Deskripsi tidak tersedia.",
        created_at: result.rows[0].created_at,
        total_sold: result.rows[0].total_sold || 0,
        image: result.rows[0].image || null,
      };

      return NextResponse.json(product);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Kesalahan saat mengambil produk:", error);
    return NextResponse.json(
      { error: "Gagal mengambil produk", details: error.message },
      { status: 500 }
    );
  }
}