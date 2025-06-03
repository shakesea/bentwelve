import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // ini akan otomatis pakai dari .env/.env.development.local
  ssl: {
    rejectUnauthorized: false, // Neon perlu ini biar koneksi SSL tetap aman
  },
});

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT id_produk, nama_produk, harga, kategori FROM products ORDER BY nama_produk');
    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}