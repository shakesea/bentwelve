// app/dashboard/products/page.tsx
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { fetchProducts } from '@/app/lib/data';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchTerm = typeof params.search === 'string' ? params.search : '';
  const products = await fetchProducts(searchTerm);

  async function search(formData: FormData) {
    'use server';
    const searchTerm = formData.get('search')?.toString() || '';
    redirect(`/dashboard/products?search=${encodeURIComponent(searchTerm)}`);
  }

  async function handleCreate() {
    'use server';
    redirect(`/dashboard/products/create`);
  }

  async function handleEdit(id: string) {
    'use server';
  redirect(`/ui/dashboard/cruds/update/?id=${encodeURIComponent(id)}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white p-6">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Product Catalog</h1>
        <Link
          href="/dashboard/products/create"
          className="rounded-lg bg-pink-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-pink-700 hover:shadow-lg"
        >
          + Add New Product
        </Link>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <form action={search} className="flex items-center space-x-2">
          <input
            type="text"
            name="search"
            placeholder="Search by product name..."
            defaultValue={searchTerm}
            className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
          />
          <button
            type="submit"
            className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-pink-700 hover:shadow-lg"
          >
            Search
          </button>
        </form>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-pink-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">No</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 animate-fade-in">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product, idx) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {String(idx + 1).padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={product.image || '/placeholder.png'}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover border border-gray-200"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp {product.price.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <form action={handleEdit.bind(null, product.id)} className="inline-block">
                      <button
                        type="submit"
                        className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors duration-200"
                      >
                        ✏️ Edit
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}