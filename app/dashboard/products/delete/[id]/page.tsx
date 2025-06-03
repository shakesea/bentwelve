'use server';

import { redirect } from 'next/navigation';
import { deleteProduct } from '@/app/lib/actions';
import Link from 'next/link';

interface DeletePageProps {
  params: Promise<{ id: string }>;
}

export default async function DeleteProductPage({ params }: DeletePageProps) {
  const { id } = await params;

  async function handleDelete() {
    'use server';
    await deleteProduct(id);
    redirect('/dashboard/products');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Delete Product</h1>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <Link
            href="/dashboard/products"
            className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-400 transition-all duration-200"
          >
            Cancel
          </Link>
          <form action={handleDelete}>
            <button
              type="submit"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-gray-800 font-medium text-white hover:bg-red-700 transition-all duration-200"
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}