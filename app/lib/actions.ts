'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { neon } from '@neondatabase/serverless';
import { z } from 'zod';

const sql = neon(process.env.DATABASE_URL!);

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

  try {
    // Insert the new product into the database
    await sql`
      INSERT INTO public.products (nama_produk, kategori, harga)
      VALUES (${name}, ${category}, ${price.toString()})
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