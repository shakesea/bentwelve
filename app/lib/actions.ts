'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import postgres from 'postgres';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

const sql = postgres(process.env.DATABASE_URL!);

// Schema for validating form data (for create and update)
const FormSchema = z.object({
  id: z.string().optional(), // id is optional for create
  name: z.string().min(1, 'Product name is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce
    .number()
    .gt(0, 'Price must be greater than 0'),
});

export async function createProduct(prevState: any, formData: FormData) {
  // Validate form data
  const validatedFields = FormSchema.safeParse({
    name: formData.get('name'),
    category: formData.get('category'),
    price: formData.get('price'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the form.',
    };
  }

  const { name, category, price } = validatedFields.data;
  
  // Get the image file from the form
  const imageFile = formData.get('image') as File;
  let imageUrl = '';
  
  if (imageFile && imageFile.size > 0) {
    // Convert image to base64 string
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    imageUrl = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
  }

  try {
    // Insert the new product into the database with image
    await sql`
      INSERT INTO public.products (nama_produk, kategori, harga, gambar)
      VALUES (${name}, ${category}, ${price.toString()}, ${imageUrl})
    `;

    // Revalidate the products page to reflect the new product
    revalidatePath('/dashboard/products');

    // Redirect to the products page
    redirect('/dashboard/products');
  } catch (error) {
    console.error('Failed to create product:', error);
    return { message: 'Failed to create product.', errors: {} };
  }
}

export async function updateProduct(id: string, prevState: any, formData: FormData) {
  // Existing updateProduct function remains unchanged
  const validatedFields = FormSchema.safeParse({
    id,
    name: formData.get('name'),
    category: formData.get('category'),
    price: formData.get('price'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the form.',
    };
  }

  const { name, category, price } = validatedFields.data;

  try {
    await sql`
      UPDATE public.products
      SET nama_produk = ${name}, kategori = ${category}, harga = ${price.toString()}
      WHERE id_produk = ${id}
    `;

    revalidatePath('/dashboard/products');
    return { message: 'Product updated successfully', errors: {} };
  } catch (error) {
    console.error('Failed to update product:', error);
    return { message: 'Failed to update product.', errors: {} };
  }
}

export async function deleteProduct(id: string) {
  try {
    await sql`
      DELETE FROM public.products
      WHERE id_produk = ${id}
    `;
    revalidatePath('/dashboard/products');
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw new Error('Failed to delete product.');
  }
}

const TransactionSchema = z.object({
  productId: z.string().optional(), // nullable
  buyerName: z.string().min(1, 'Buyer name is required'),
  totalPrice: z.coerce.number().gt(0, 'Total price must be greater than 0'),
  date: z.string().datetime({ message: 'Invalid date format (ISO expected)' }), // ISO timestamp
  userId: z.string().optional(), // optional
});

export async function createTransaction(prevState: any, formData: FormData) {
  const validated = TransactionSchema.safeParse({
    productId: formData.get('productId')?.toString() || undefined,
    buyerName: formData.get('buyerName'),
    totalPrice: formData.get('totalPrice'),
    date: formData.get('date'),
    userId: formData.get('userId')?.toString() || undefined,
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the form.',
    };
  }

  const { productId, buyerName, totalPrice, date, userId } = validated.data;

  try {
    await sql`
      INSERT INTO transactions (id_produk, nama_pembeli, total_harga, tanggal, id_user)
      VALUES (${productId ?? null}, ${buyerName}, ${totalPrice}, ${date}, ${userId ?? null})
    `;

    revalidatePath('/dashboard/transactions');
    redirect('/dashboard/transactions');
  } catch (error) {
    console.error('Failed to create transaction:', error);
    return { message: 'Failed to create transaction.', errors: {} };
  }
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
});

export async function createUser(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!username || !email || !password) {
    throw new Error("All fields are required");
  }

  let client;
  try {
    client = await pool.connect();
    console.log("Connected to database, checking email:", email);

    const checkQuery = await client.query(
      `SELECT email FROM users WHERE email = $1`,
      [email]
    );
    console.log("Query result:", checkQuery);

    if (checkQuery.rows && checkQuery.rows.length > 0) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await client.query(
      `INSERT INTO users (name, email, password, created_at, role)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)`,
      [username, email, hashedPassword, "user"]
    );
    revalidatePath("/");
  } catch (error) {
    console.error("Error creating user:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to create user: ${errorMessage}`);
  } finally {
    if (client) client.release();
  }

  // Pindahkan redirect di luar try-catch
  redirect("/");
}

export async function deleteTransaction(id: string) {
  'use server';
  let client;
  try {
    client = await pool.connect();
    console.log("Attempting to delete transaction with id:", id); // Log id untuk debugging
    const result = await client.query(
      `DELETE FROM transactions WHERE id_transaksi = $1`,
      [id]
    );
    console.log("Delete result:", result); // Log hasil query
    if (result.rowCount === 0) {
      throw new Error(`No transaction found with id ${id}`);
    }
    revalidatePath('/dashboard/report');
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    throw new Error('Failed to delete transaction: ' + (error instanceof Error ? error.message : 'Unknown error'));
  } finally {
    if (client) client.release();
  }
  redirect('/dashboard/report');
}