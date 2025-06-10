// app/dashboard/products/create/page.tsx
import { createProduct } from '@/app/lib/actions';
import Link from 'next/link';

export default async function CreateProductPage() {
  async function handleCreate(formData: FormData) {
    'use server';
    const result = await createProduct({}, formData);
    if (result.errors && Object.keys(result.errors).length > 0) {
      console.error('Form validation errors:', result.errors);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white p-6">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        <Link
          href="/dashboard/products"
          className="rounded-lg bg-gray-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-gray-700 hover:shadow-lg"
        >
          Back to Products
        </Link>
      </div>

      {/* Create Product Form */}
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <form action={handleCreate} className="space-y-4" encType="multipart/form-data">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter product name"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <input
              type="text"
              name="category"
              id="category"
              placeholder="Enter category"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price (Rp)
            </label>
            <input
              type="number"
              name="price"
              id="price"
              placeholder="Enter price"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              required
              min="1"
            />
          </div>
          
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Product Image
            </label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/dashboard/products"
              className="rounded-lg bg-gray-400 px-6 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-gray-500 hover:shadow-lg"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-pink-600 px-6 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-pink-700 hover:shadow-lg"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}