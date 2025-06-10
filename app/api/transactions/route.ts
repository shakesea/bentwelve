import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
  ssl: { rejectUnauthorized: false },
});

export async function POST(request: Request) {
  try {
    const { nama_pembeli, tanggal, total_harga, id_user, status, items } = await request.json();

    console.log("Received Transaction Data:", { nama_pembeli, tanggal, total_harga, id_user, status, items });

    if (!id_user) {
      return NextResponse.json({ success: false, error: "ID pengguna tidak ditemukan" }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Item transaksi tidak valid" }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Get the first product ID to use as the main transaction's product ID
      const main_id_produk = items[0]?.id_produk || null;
      
      const transactionQuery = `
        INSERT INTO transactions (id_transaksi, nama_pembeli, tanggal, total_harga, created_at, id_user, status, id_produk)
        VALUES (gen_random_uuid(), $1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6)
        RETURNING id_transaksi;
      `;
      const transactionValues = [nama_pembeli, tanggal, total_harga, id_user, status, main_id_produk];
      console.log("Executing Transaction Query with values:", transactionValues);
      const transactionResult = await client.query(transactionQuery, transactionValues);
      const id_transaksi = transactionResult.rows[0].id_transaksi;

      // Validate all items first
      for (const item of items) {
        if (!item.id_produk || !item.jumlah) {
          throw new Error(`Item invalid: ${JSON.stringify(item)}`);
        }
      }

      // Use parameterized queries for transaction_items to prevent SQL injection
      for (const item of items) {
        if (!item.id_produk) {
          throw new Error(`Missing id_produk in item: ${JSON.stringify(item)}`);
        }
        
        // Log the item being processed
        console.log(`Processing item with id_produk: ${item.id_produk}, quantity: ${item.jumlah}`);
        
        // Insert into transaction_items with explicit id_produk
        await client.query(
          'INSERT INTO transaction_items (id_transaksi, id_produk, jumlah) VALUES ($1, $2, $3)',
          [id_transaksi, item.id_produk, item.jumlah]
        );
      }
      
      // Update products table with parameterized queries
      for (const item of items) {
        console.log(`Updating product ${item.id_produk} with quantity ${item.jumlah}`);
        const updateResult = await client.query(
          'UPDATE products SET total_sold = COALESCE(total_sold, 0) + $1 WHERE id_produk = $2 RETURNING id_produk',
          [item.jumlah, item.id_produk]
        );
        
        if (updateResult.rowCount === 0) {
          console.error(`Product with id ${item.id_produk} not found`);
        }
      }

      await client.query("COMMIT");

      return NextResponse.json({ success: true, id_transaksi });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Transaction error:", error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}