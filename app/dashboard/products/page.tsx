import Image from 'next/image';
import { redirect } from 'next/navigation';
import { fetchProducts } from '@/app/lib/data'; // Sesuaikan path
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

  async function handleAdd() {
    'use server';
    redirect(`/ui/dashboard/cruds/create`);
  }

  async function handleEdit(id: string) {
    'use server';
    redirect(`/ui/dashboard/cruds/update/?id=${encodeURIComponent(id)}`);
  }

  return (
    <div className="mt-6">
      {/* Search and Add button */}
      <div className="mb-4 flex items-center justify-between">
        <form action={search}>
          <input
            type="text"
            name="search"
            placeholder="Search product..."
            defaultValue={searchTerm}
            className="rounded-md border px-3 py-2 text-sm"
          />
        </form>
        <Link
          href="/ui/dashboard/cruds/create"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <table className="min-w-full text-gray-900">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th className="px-4 py-5 font-medium sm:pl-6">No</th>
                  <th className="px-3 py-5 font-medium">Product</th>
                  <th className="px-3 py-5 font-medium">Category</th>
                  <th className="px-3 py-5 font-medium">Price</th>
                  <th className="px-3 py-5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
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
                      className="w-full border-b py-3 text-sm last-of-type:border-none 
                        [&:first-child>td:first-child]:rounded-tl-lg 
                        [&:first-child>td:last-child]:rounded-tr-lg 
                        [&:last-child>td:first-child]:rounded-bl-lg 
                        [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <p>{product.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">{product.category}</td>
                      <td className="whitespace-nowrap px-3 py-3">
                        Rp {product.price.toLocaleString('id-ID')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <div className="flex gap-2">
                          <form action={handleEdit.bind(null, product.id)}>
                            <button
                              type="submit"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ✏️ Edit
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}