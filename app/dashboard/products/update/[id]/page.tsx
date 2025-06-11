'use server';

import { redirect } from 'next/navigation';
import { fetchProductById } from '@/app/lib/data';
import { updateProduct } from '@/app/lib/actions';
import Link from 'next/link';
import ImagePreview from './image-preview';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Product Not Found</h1>
        <Link
          href="/dashboard/products"
          className="rounded-lg bg-pink-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-pink-700 hover:shadow-lg"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  async function handleUpdate(formData: FormData) {
    'use server';
    const result = await updateProduct(id, {}, formData);
    if (!result.errors || Object.keys(result.errors).length === 0) {
      redirect('/dashboard/products');
    }
    // Since we're in a server component, we can't directly return state for client-side rendering.
    // Redirect to an error page or handle errors differently if needed.
    redirect(`/dashboard/products/update/${id}?error=${encodeURIComponent(result.message)}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
        <Link
          href="/dashboard/products"
          className="rounded-lg bg-gray-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-gray-700 hover:shadow-lg"
        >
          Back to Products
        </Link>
      </div>

      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <form action={handleUpdate} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={product.name}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              defaultValue={product.category}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              placeholder="Enter category"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (Rp)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              defaultValue={product.price}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              placeholder="Enter price"
              min="1"
              required
            />
          </div>
          
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Product Image
            </label>
            <div className="mt-2 mb-4">
              <p className="text-sm text-gray-500 mb-2">Current Image:</p>
              <div className="relative h-40 w-40 overflow-hidden rounded-md border border-gray-200">
                {product.image ? (
                  <ImagePreview 
                    src={product.image} 
                    alt={product.name} 
                  />
                ) : (
                  <img 
                    src="/default-image.jpg" 
                    alt="Default" 
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </div>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
            />
            <p className="mt-1 text-xs text-gray-500">Leave empty to keep current image</p>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-pink-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-pink-700 hover:shadow-lg"
            >
              Update Product
            </button>
            <Link
              href="/dashboard/products"
              className="flex-1 text-center rounded-lg bg-gray-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-gray-700 hover:shadow-lg"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}