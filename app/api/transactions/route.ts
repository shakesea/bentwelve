// /app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, quantity, buyer_name, date } = body;

    if (!buyer_name || !date || !product_id || !quantity) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const client = await pool.connect();

    // Dapatkan harga produk
    const productResult = await client.query(
      'SELECT harga FROM products WHERE id_produk = $1',
      [product_id]
    );

    if (productResult.rowCount === 0) {
      client.release();
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const harga = productResult.rows[0].harga;
    const total_harga = harga * quantity;

    // Simpan transaksi
    await client.query(
      `INSERT INTO transactions (id_produk, nama_pembeli, total_harga, tanggal)
       VALUES ($1, $2, $3, $4)`,
      [product_id, buyer_name, total_harga, date]
    );

    client.release();

    return NextResponse.json({ message: 'Transaction saved' }, { status: 201 });
  } catch (error) {
    console.error('Error saving transaction:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
