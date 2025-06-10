import { NextResponse } from "next/server";
import { Pool } from "pg";

// Konfigurasi koneksi database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.max(1, Number(searchParams.get("limit")) || 10);
  const offset = (page - 1) * limit;

  let client;
  try {
    client = await pool.connect();

    // Verify table existence and columns
    const tableCheck = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'products'
    `);
    const columns = tableCheck.rows.map((row) => row.column_name);
    const requiredColumns = [
      "id_produk",
      "nama_produk",
      "harga",
      "kategori",
      "gambar",
      "deskripsi",
      "created_at",
      "total_sold",
    ];
    const missingColumns = requiredColumns.filter((col) => !columns.includes(col));
    if (missingColumns.length > 0) {
      throw new Error(`Missing columns in products table: ${missingColumns.join(", ")}`);
    }

    const [productsResult, countResult] = await Promise.all([
      client.query(
        `
        SELECT 
          id_produk, 
          nama_produk, 
          harga, 
          kategori, 
          gambar, 
          deskripsi, 
          created_at, 
          total_sold
        FROM products
        WHERE kategori IN ('Bunga Potong', 'Rangkaian Bunga')
          AND nama_produk ILIKE $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
        `,
        [`%${query}%`, limit, offset]
      ),
      client.query(
        `
        SELECT COUNT(*) as total
        FROM products
        WHERE kategori IN ('Bunga Potong', 'Rangkaian Bunga')
          AND nama_produk ILIKE $1
        `,
        [`%${query}%`]
      ),
    ]);

    const products = productsResult.rows.map((row) => ({
      id_produk: row.id_produk,
      title: row.nama_produk,
      price: row.harga ? Number(row.harga) : null,
      img: row.gambar || "/default-image.jpg",
      category: row.kategori,
      description: row.deskripsi || "Deskripsi tidak tersedia.",
      discount: undefined, // No diskon column
      slug: undefined,
      variant: undefined,
      features: undefined,
      note: undefined,
      createdAt: row.created_at ? row.created_at.toISOString() : undefined,
      total_sold: row.total_sold || 0,
    }));

    const totalCount = Number(countResult.rows[0].total) || 0;

    return NextResponse.json(
      {
        products,
        totalCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Kesalahan saat mengambil daftar produk:", error);
    return NextResponse.json(
      {
        error: `Gagal mengambil daftar produk: ${(error as Error).message}`,
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.release();
    }
  }
}