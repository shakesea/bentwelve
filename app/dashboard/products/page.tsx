import Image from 'next/image';
import { redirect } from 'next/navigation';
import { fetchProducts } from '../../lib/data';

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

  async function handleEdit(id_product: string) {
    'use server';
    redirect(`/ui/dashboard/cruds/update?id=${encodeURIComponent(id_product)}`);
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 relative">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <div className="flex items-center gap-4 p-4 bg-white text-black rounded-2xl shadow-lg w-64 mt-4 md:mt-0">
          <Image
            src="/Kucing.png"
            alt="User Profile"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full border-4 border-green-500"
          />
          <div className="text-right flex-1">
            <p className="font-semibold text-base">Welcome, Monkey</p>
            <p className="text-sm text-gray-500 truncate">monkey@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-10">
        <form action={search as any} className="flex-grow relative mr-6">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            name="search"
            placeholder="Search Menu"
            defaultValue={searchTerm}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-sm focus:outline-none focus:ring-0 focus:shadow-none border border-gray-300"
          />
        </form>

        <form action={handleAdd as any}>
          <button
            type="submit"
            className="bg-pink-500 text-white px-5 py-2 rounded shadow"
            style={{ backgroundColor: '#D3628B' }}
          >
            + Add New
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-sm text-left border-separate border-spacing-0">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="border-t border-b border-l border-gray-200 px-4 py-3 first:rounded-tl-lg">NO</th>
              <th className="border-t border-b border-gray-200 px-4 py-3">ID PRODUCT</th>
              <th className="border-t border-b border-gray-200 px-4 py-3">NAME</th>
              <th className="border-t border-b border-gray-200 px-4 py-3">CATEGORY</th>
              <th className="border-t border-b border-gray-200 px-4 py-3">PRICE</th>
              <th className="border-t border-b border-r border-gray-200 px-4 py-3 last:rounded-tr-lg">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="border-t border-b border-x border-gray-200 px-4 py-3 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product, idx) => (
                <tr key={product.id_produk} className={idx % 2 === 0 ? "bg-white" : "bg-pink-50"}>
                  <td className="border-t border-b border-l border-gray-200 px-4 py-3 text-center">
                    {String(idx + 1).padStart(2, '0')}
                  </td>
                  <td className="border-t border-b border-gray-200 px-4 py-3">{product.id_produk}</td>
                  <td className="border-t border-b border-gray-200 px-4 py-3">{product.nama_produk}</td>
                  <td className="border-t border-b border-gray-200 px-4 py-3">{product.kategori}</td>
                  <td className="border-t border-b border-gray-200 px-4 py-3">
                    {product.harga.replace('Rp', 'Rp ').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </td>
                  <td className="border-t border-b border-r border-gray-200 px-4 py-3 flex gap-3">
                    <form action={handleEdit.bind(null, product.id_produk) as any}>
                      <button type="submit" className="text-gray-600 hover:text-black text-lg">✏️</button>
                    </form>
                    <button className="text-red-500 hover:text-red-700 text-lg">🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {products.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan={6} className="border-b border-x border-gray-200 first:rounded-bl-lg last:rounded-br-lg"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
