import postgres from 'postgres';

// Interface untuk products
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

// Interface untuk monthly revenue
export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

// Interface untuk monthly expenses
export interface MonthlyExpense {
  month: string;
  expenses: number;
}

// Interface untuk most sold product
export interface MostSoldProduct {
  id_produk: string;
  nama_produk: string;
  total_sold: number;
}

// Interface untuk invoices
export interface Invoice {
  id: string;
  name: string;
  email: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  image_url: string;
}

export interface Transaction {
  id_transaksi: string;
  id_produk: string;
  nama_pembeli: string;
  tanggal: string;
  total_harga: number;
  status?: string;
}

// Inisialisasi koneksi database
const sql = postgres(process.env.DATABASE_URL || "");

// Update fetchProducts to support pagination
export async function fetchProducts(searchTerm: string = '', currentPage: number = 1) {
  const PAGE_SIZE = 10;
  const offset = (currentPage - 1) * PAGE_SIZE;

  try {
    return await sql`
      SELECT id_produk as id, nama_produk as name, harga as price, kategori as category, gambar as image
      FROM public.products
      WHERE kategori IN ('Bunga Potong', 'Rangkaian Bunga')
        AND nama_produk ILIKE ${'%' + searchTerm + '%'}
      ORDER BY created_at DESC
      LIMIT ${PAGE_SIZE}
      OFFSET ${offset}
    `;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products.');
  }
}

// Add fetchProductCount to get total number of matching products
export async function fetchProductCount(searchTerm: string = '') {
  try {
    const data = await sql`
      SELECT COUNT(*) as total
      FROM public.products
      WHERE kategori IN ('Bunga Potong', 'Rangkaian Bunga')
        AND nama_produk ILIKE ${'%' + searchTerm + '%'}
    `;
    return Number(data[0].total) || 0;
  } catch (error) {
    console.error('Error fetching product count:', error);
    throw new Error('Failed to fetch product count.');
  }
}

export async function fetchTotalUsers() {
  try {
    const data = await sql`
      SELECT COUNT(*) as total
      FROM public.users
    `;
    return Number(data[0].total) || 0;
  } catch (error) {
    console.error('Error fetching total users:', error);
    throw new Error('Failed to fetch total users.');
  }
}

export async function fetchTransactions() {
  try {
    return await sql`
      SELECT id_transaksi, id_produk, nama_pembeli, tanggal, total_harga
      FROM public.transactions
      ORDER BY tanggal DESC
    `;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions.');
  }
}

export async function fetchMonthlyRevenue() {
  try {
    return await sql`
      WITH sales AS (
        SELECT
          TO_CHAR(tanggal, 'YYYY-MM') AS month,
          SUM(total_harga) AS total_sales
        FROM public.transactions
        WHERE tanggal >= '2025-01-01' AND tanggal < '2025-07-01'
        GROUP BY TO_CHAR(tanggal, 'YYYY-MM')
      ),
      expenses AS (
        SELECT
          TO_CHAR(tanggal, 'YYYY-MM') AS month,
          SUM(jumlah_pengeluaran) AS total_expenses
        FROM public.expenses
        WHERE tanggal >= '2025-01-01' AND tanggal < '2025-07-01'
        GROUP BY TO_CHAR(tanggal, 'YYYY-MM')
      )
      SELECT
        COALESCE(sales.month, expenses.month) AS month,
        COALESCE(sales.total_sales, 0) - COALESCE(expenses.total_expenses, 0) AS revenue
      FROM sales
      FULL OUTER JOIN expenses ON sales.month = expenses.month
      ORDER BY month
    `;
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    throw new Error('Failed to fetch monthly revenue.');
  }
}

export async function fetchMostSoldProduct() {
  try {
    const data = await sql`
      SELECT t.id_produk, p.nama_produk, COUNT(t.id_produk) as total_sold
      FROM public.transactions t
      JOIN public.products p ON t.id_produk = p.id_produk
      GROUP BY t.id_produk, p.nama_produk
      ORDER BY total_sold DESC
      LIMIT 1
    `;
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching most sold product:', error);
    throw new Error('Failed to fetch most sold product.');
  }
}

export async function fetchFilteredInvoices(query: string = '', currentPage: number = 1) {
  const PAGE_SIZE = 10;
  const offset = (currentPage - 1) * PAGE_SIZE;

  try {
    return await sql`
      SELECT id, customer_id as name, email, amount, date, status, image_url
      FROM public.invoices
      WHERE customer_id ILIKE ${'%' + query + '%'}
      ORDER BY date DESC
      LIMIT ${PAGE_SIZE}
      OFFSET ${offset}
    `;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchFilteredTransactions(query: string = '', currentPage: number = 1) {
  const PAGE_SIZE = 10;
  const offset = (currentPage - 1) * PAGE_SIZE;

  try {
    return await sql`
      SELECT id_transaksi, id_produk, nama_pembeli, tanggal, total_harga
      FROM public.transactions
      WHERE nama_pembeli ILIKE ${'%' + query + '%'}
      ORDER BY tanggal DESC
      LIMIT ${PAGE_SIZE}
      OFFSET ${offset}
    `;
  } catch (error) {
    console.error('Error fetching filtered transactions:', error);
    throw new Error('Failed to fetch filtered transactions.');
  }
}

export async function fetchTransactionCount(query: string = '') {
  try {
    const data = await sql`
      SELECT COUNT(*) as total
      FROM public.transactions
      WHERE nama_pembeli ILIKE ${'%' + query + '%'}
    `;
    return Number(data[0].total) || 0;
  } catch (error) {
    console.error('Error fetching transaction count:', error);
    throw new Error('Failed to fetch transaction count.');
  }
}

export async function fetchMonthlyExpenses() {
  try {
    return await sql`
      SELECT
        TO_CHAR(tanggal, 'YYYY-MM') AS month,
        SUM(jumlah_pengeluaran) AS expenses
      FROM public.expenses
      WHERE tanggal >= '2025-01-01' AND tanggal < '2025-07-01'
      GROUP BY TO_CHAR(tanggal, 'YYYY-MM')
      ORDER BY TO_CHAR(tanggal, 'YYYY-MM')
    `;
  } catch (error) {
    console.error('Error fetching monthly expenses:', error);
    throw new Error('Failed to fetch monthly expenses.');
  }
}

export interface MonthlySales {
  month: string;
  sales: number;
}

export async function fetchMonthlySales() {
  try {
    return await sql`
      SELECT
        TO_CHAR(tanggal, 'Mon') AS month,
        SUM(total_harga) AS sales
      FROM public.transactions
      GROUP BY TO_CHAR(tanggal, 'Mon'), EXTRACT(MONTH FROM tanggal)
      ORDER BY EXTRACT(MONTH FROM tanggal)
    `;
  } catch (error) {
    console.error('Error fetching monthly sales:', error);
    throw new Error('Failed to fetch monthly sales.');
  }
}

export async function fetchCardData() {
  try {
    const [productsResult, usersResult, revenueResult] = await Promise.all([
      sql`
        SELECT COUNT(*) as total
        FROM public.products
        WHERE kategori IN ('Bunga Potong', 'Rangkaian Bunga')
          AND created_at <= NOW()
      `,
      sql`SELECT COUNT(*) as total FROM public.users`,
      sql`
        WITH sales AS (
          SELECT SUM(t.total_harga) AS total_sales
          FROM public.transactions t
          JOIN public.transaction_items ti ON t.id_transaksi = ti.id_transaksi
          JOIN public.products p ON ti.id_produk = p.id_produk
          WHERE p.kategori IN ('Bunga Potong', 'Rangkaian Bunga')
            AND t.tanggal >= '2025-01-01' AND t.tanggal <= NOW()
        ),
        expenses AS (
          SELECT SUM(jumlah_pengeluaran) AS total_expenses
          FROM public.expenses
          WHERE tanggal >= '2025-01-01' AND tanggal <= NOW()
        )
        SELECT
          COALESCE(sales.total_sales, 0) AS total_sales,
          COALESCE(expenses.total_expenses, 0) AS total_expenses,
          COALESCE(sales.total_sales, 0) - COALESCE(expenses.total_expenses, 0) AS revenue
        FROM sales, expenses
      `,
    ]);

    const totalProducts = Number(productsResult[0].total) || 0;
    const totalUsers = Number(usersResult[0].total) || 0;
    const totalProfit = Number(revenueResult[0].revenue) || 0;

    const [prevProductsResult, prevUsersResult, prevRevenueResult] = await Promise.all([
      sql`
        SELECT COUNT(*) as total
        FROM product_history
        WHERE kategori IN ('Bunga Potong', 'Rangkaian Bunga')
          AND snapshot_date = '2025-05-31 23:59:59'
      `,
      sql`SELECT COUNT(*) as total FROM user_history`,
      sql`
        WITH sales AS (
          SELECT SUM(total_harga) AS total_sales
          FROM transaction_history
          WHERE snapshot_date = '2025-05-31 23:59:59'
        ),
        expenses AS (
          SELECT SUM(jumlah_pengeluaran) AS total_expenses
          FROM expense_history
          WHERE snapshot_date = '2025-05-31 23:59:59'
        )
        SELECT
          COALESCE(sales.total_sales, 0) AS total_sales,
          COALESCE(expenses.total_expenses, 0) AS total_expenses,
          COALESCE(sales.total_sales, 0) - COALESCE(expenses.total_expenses, 0) AS revenue
        FROM sales, expenses
      `,
    ]);

    const prevProducts = Number(prevProductsResult[0].total) || 0;
    const prevUsers = Number(prevUsersResult[0].total) || 0;
    const prevProfit = Number(prevRevenueResult[0].revenue) || 0;

    const productChange = totalProducts - prevProducts;
    const userChange = totalUsers - prevUsers;
    const profitChange = prevProfit > 0 ? ((totalProfit - prevProfit) / prevProfit) * 100 : 0;

    return {
      totalProducts,
      totalUsers,
      totalProfit,
      productChange,
      userChange,
      profitChange,
    };
  } catch (error) {
    console.error('Error fetching card data:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export interface BestSellingProduct {
  name: string;
  sales: number;
  price: number;
}

export async function fetchBestSellingProducts() {
  return await sql`
    SELECT 
      p.nama_produk AS name,
      COUNT(t.id_transaksi) AS sales,
      p.harga AS price
    FROM public.transactions t
    JOIN public.products p ON t.id_produk = p.id_produk
    WHERE t.status = 'Confirmed'
    GROUP BY p.id_produk, p.nama_produk, p.harga
    ORDER BY sales DESC
    LIMIT 5
  `;
} 

export interface LatestTransaction {
  title: string; // id_transaksi
  date: string;
  status: string;
  total_harga: number;
}

export async function fetchLatestTransactions(): Promise<LatestTransaction[]> {
  try {
    const result = await sql<LatestTransaction[]>`
      SELECT 
        nama_pembeli AS title, 
        tanggal AS date, 
        status, 
        total_harga
      FROM public.transactions
      ORDER BY tanggal DESC
      LIMIT 3
    `;
    return result;
  } catch (error) {
    console.error('Error fetching latest transactions:', error);
    throw new Error('Failed to fetch latest transactions.');
  }
}
export async function fetchProductById(id: string) {
  try {
    const data = await sql`
      SELECT id_produk as id, nama_produk as name, harga as price, kategori as category, gambar as image
      FROM public.products
      WHERE id_produk = ${id}
      LIMIT 1
    `;
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw new Error('Failed to fetch product by ID.');
  }
}