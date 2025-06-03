import { neon } from '@neondatabase/serverless';

// Interface untuk products
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

// Interface untuk monthly revenue
type MonthlyRevenue = {
  month: string;
  revenue: number;
};

// Interface untuk monthly expenses
export interface MonthlyExpense {
  month: string;
  expenses: number;
};

// Interface untuk most sold product
export interface MostSoldProduct {
  id_produk: string;
  nama_produk: string;
  total_sold: number;
};

// Interface untuk invoices
export interface Invoice {
  id: string;
  name: string;
  email: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  image_url: string;
};

export interface Transaction {
  id_transaksi: string;
  id_produk: string;
  nama_pembeli: string;
  tanggal: string;
  total_harga: number;
  status?: string; // Optional karena tidak semua query mengandung status
}

// Inisialisasi koneksi database
function getDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(process.env.DATABASE_URL);
}

export async function fetchProducts(searchTerm: string = ''): Promise<Product[]> {
  const sql = getDatabase();
  try {
    const products = await sql`
      SELECT id_produk as id, nama_produk as name, harga as price, kategori as category, gambar as image
      FROM public.products
      WHERE kategori IN ('Bunga Potong', 'Rangkaian Bunga')
        AND nama_produk ILIKE ${'%' + searchTerm + '%'}
      ORDER BY created_at DESC
    ` as Product[];
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products.');
  }
}

// Fetch total number of users
export async function fetchTotalUsers(): Promise<number> {
  const sql = getDatabase();
  try {
    const result = await sql`
      SELECT COUNT(*) as total
      FROM public.users
    `;
    return Number(result[0].total) || 0;
  } catch (error) {
    console.error('Error fetching total users:', error);
    throw new Error('Failed to fetch total users.');
  }
}

// Fetch transactions
export async function fetchTransactions(): Promise<Transaction[]> {
  const sql = getDatabase();
  try {
    const transactions = await sql`
      SELECT id_transaksi, id_produk, nama_pembeli, tanggal, total_harga
      FROM public.transactions
      ORDER BY tanggal DESC
    ` as Transaction[];
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions.');
  }
}

// Fetch monthly revenue
export async function fetchMonthlyRevenue(): Promise<MonthlyRevenue[]> {
  const sql = getDatabase();
  try {
    const result = await sql`
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
      ORDER BY month;
    `;
    return result as MonthlyRevenue[];
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    throw new Error('Failed to fetch monthly revenue.');
  }
}

// Fetch most sold product
export async function fetchMostSoldProduct(): Promise<MostSoldProduct | null> {
  const sql = getDatabase();
  try {
    const result = await sql`
      SELECT t.id_produk, p.nama_produk, COUNT(t.id_produk) as total_sold
      FROM public.transactions t
      JOIN public.products p ON t.id_produk = p.id_produk
      GROUP BY t.id_produk, p.nama_produk
      ORDER BY total_sold DESC
      LIMIT 1
    ` as MostSoldProduct[];
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching most sold product:', error);
    throw new Error('Failed to fetch most sold product.');
  }
}

// Fetch filtered invoices with pagination
export async function fetchFilteredInvoices(
  query: string = '',
  currentPage: number = 1
): Promise<Invoice[]> {
  const sql = getDatabase();
  const PAGE_SIZE = 10;
  const offset = (currentPage - 1) * PAGE_SIZE;

  try {
    const invoices = await sql`
      SELECT id, customer_id as name, email, amount, date, status, image_url
      FROM public.invoices
      WHERE customer_id ILIKE ${'%' + query + '%'}
      ORDER BY date DESC
      LIMIT ${PAGE_SIZE}
      OFFSET ${offset}
    ` as Invoice[];
    return invoices;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

// Fetch filtered transactions with pagination
export async function fetchFilteredTransactions(
  query: string = '',
  currentPage: number = 1
): Promise<Transaction[]> {
  const sql = getDatabase();
  const PAGE_SIZE = 10;
  const offset = (currentPage - 1) * PAGE_SIZE;

  try {
    const transactions = await sql`
      SELECT id_transaksi, id_produk, nama_pembeli, tanggal, total_harga
      FROM public.transactions
      WHERE nama_pembeli ILIKE ${'%' + query + '%'}
      ORDER BY tanggal DESC
      LIMIT ${PAGE_SIZE}
      OFFSET ${offset}
    ` as Transaction[];
    return transactions;
  } catch (error) {
    console.error('Error fetching filtered transactions:', error);
    throw new Error('Failed to fetch filtered transactions.');
  }
}

// Count total filtered transactions (for pagination)
export async function fetchTransactionCount(query: string = ''): Promise<number> {
  const sql = getDatabase();
  try {
    const result = await sql`
      SELECT COUNT(*) as total
      FROM public.transactions
      WHERE nama_pembeli ILIKE ${'%' + query + '%'}
    `;
    return Number(result[0].total) || 0;
  } catch (error) {
    console.error('Error fetching transaction count:', error);
    throw new Error('Failed to fetch transaction count.');
  }
}

export async function fetchMonthlyExpenses(): Promise<MonthlyExpense[]> {
  const sql = getDatabase();
  try {
    const result = await sql`
      SELECT
        TO_CHAR(tanggal, 'YYYY-MM') AS month,
        SUM(jumlah_pengeluaran) AS expenses
      FROM public.expenses
      WHERE tanggal >= '2025-01-01' AND tanggal < '2025-07-01'
      GROUP BY TO_CHAR(tanggal, 'YYYY-MM')
      ORDER BY TO_CHAR(tanggal, 'YYYY-MM')
    `;
    return result as MonthlyExpense[];
  } catch (error) {
    console.error('Error fetching monthly expenses:', error);
    throw new Error('Failed to fetch monthly expenses.');
  }
}

export interface MonthlySales {
  month: string;
  sales: number;
}

export async function fetchMonthlySales(): Promise<MonthlySales[]> {
  const sql = getDatabase();
  try {
    const result = await sql`
      SELECT
        TO_CHAR(tanggal, 'Mon') AS month,
        SUM(total_harga) AS sales
      FROM public.transactions
      GROUP BY TO_CHAR(tanggal, 'Mon'), EXTRACT(MONTH FROM tanggal)
      ORDER BY EXTRACT(MONTH FROM tanggal)
    `;
    return result as MonthlySales[];
  } catch (error) {
    console.error('Error fetching monthly sales:', error);
    throw new Error('Failed to fetch monthly sales.');
  }
}

export async function fetchCardData(): Promise<{
  totalProducts: number;
  totalUsers: number;
  totalProfit: number;
  productChange: number;
  userChange: number;
  profitChange: number;
}> {
  const sql = getDatabase();
  try {
    // Data saat ini (hanya produk yang relevan untuk toko bunga)
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
        FROM sales, expenses;
      `,
    ]);

    console.log('Debug - totalProducts:', productsResult[0].total);
    console.log('Debug - totalUsers:', usersResult[0].total);
    console.log('Debug - totalProfit:', revenueResult[0].revenue);
    console.log('Debug - Sales:', revenueResult[0].total_sales);
    console.log('Debug - Expenses:', revenueResult[0].total_expenses);

    const totalProducts = Number(productsResult[0].total) || 0;
    const totalUsers = Number(usersResult[0].total) || 0;
    const totalProfit = Number(revenueResult[0].revenue) || 0;

    // Data historis (hingga 31 Mei 2025 dari tabel historis)
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
        FROM sales, expenses;
      `,
    ]);

    console.log('Debug - prevProfit:', prevRevenueResult[0].revenue);

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

// Add to app/lib/data.ts
export interface BestSellingProduct {
  name: string;
  sales: number;
  price: number;
}

export async function fetchBestSellingProducts(): Promise<BestSellingProduct[]> {
  const sql = getDatabase();
  try {
    const result = await sql`
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
    return result as BestSellingProduct[];
  } catch (error) {
    console.error('Error fetching best-selling products:', error);
    throw new Error('Failed to fetch best-selling products.');
  }
}

// In app/lib/data.ts
export interface UpcomingTransaction {
  title: string;
  date: string;
  status: string;
  nama_pembeli: string;
  total_harga: string;
}

export async function fetchUpcomingTransactions(): Promise<UpcomingTransaction | null> {
  const sql = getDatabase();
  try {
    const result = await sql`
      SELECT 
        p.nama_produk AS title,
        TO_CHAR(t.tanggal, 'Mon DD, YYYY') AS date,
        t.status,
        t.nama_pembeli,
        t.total_harga
      FROM public.transactions t
      JOIN public.products p ON t.id_produk = p.id_produk
      WHERE t.status IN ('Pending', 'Processing')
        AND t.tanggal >= NOW()
      ORDER BY t.tanggal DESC
      LIMIT 1
    `;
    return (result[0] as UpcomingTransaction) || null;
  } catch (error) {
    console.error('Error fetching upcoming transaction:', error);
    throw new Error('Failed to fetch upcoming transaction.');
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const sql = getDatabase();
  try {
    const result = await sql`
      SELECT id_produk as id, nama_produk as name, harga as price, kategori as category, gambar as image
      FROM public.products
      WHERE id_produk = ${id}
      LIMIT 1
    `;

    if (result.length === 0) return null;
    return result[0] as Product;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}
