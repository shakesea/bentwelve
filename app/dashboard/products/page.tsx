import Image from 'next/image';
import { redirect } from 'next/navigation';
import { fetchProducts } from '../../lib/data';
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

  async function handleEdit(id_product: string) {
    'use server';
    redirect(`/ui/dashboard/cruds/update?id=${encodeURIComponent(id_product)}`);
  }

  // return (
  //   <div className="p-6 min-h-screen">
  //     <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 relative">
  //       <h1 className="text-3xl font-bold text-gray-800">Products</h1>
  //       <div className="flex items-center gap-4 p-4 bg-white text-black rounded-2xl shadow-lg w-64 mt-4 md:mt-0">
  //         <Image
  //           src="/Kucing.png"
  //           alt="User Profile"
  //           width={48}
  //           height={48}
  //           className="w-12 h-12 rounded-full border-4 border-green-500"
  //         />
  //         <div className="text-right flex-1">
  //           <p className="font-semibold text-base">Welcome, Monkey</p>
  //           <p className="text-sm text-gray-500 truncate">monkey@gmail.com</p>
  //         </div>
  //       </div>
  //     </div>

  //     <div className="flex items-center justify-between mb-10">
  //       <form action={search as any} className="flex-grow relative mr-6">
  //         <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 text-lg">🔍</span>
  //         <input
  //           type="text"
  //           name="search"
  //           placeholder="Search Menu"
  //           defaultValue={searchTerm}
  //           className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-sm focus:outline-none focus:ring-0 focus:shadow-none border border-gray-300"
  //         />
  //       </form>

  //       <form action={handleAdd as any}>
  //         <button
  //           type="submit"
  //           className="bg-pink-500 text-white px-5 py-2 rounded shadow"
  //           style={{ backgroundColor: '#D3628B' }}
  //         >
  //           + Add New
  //         </button>
  //       </form>
  //     </div>

  //     <div className="overflow-x-auto rounded-lg shadow">
  //       <table className="min-w-full text-sm text-left border-separate border-spacing-0">
  //         <thead className="bg-gray-100 text-gray-700 font-semibold">
  //           <tr>
  //             <th className="border-t border-b border-l border-gray-200 px-4 py-3 first:rounded-tl-lg">NO</th>
  //             <th className="border-t border-b border-gray-200 px-4 py-3">ID PRODUCT</th>
  //             <th className="border-t border-b border-gray-200 px-4 py-3">NAME</th>
  //             <th className="border-t border-b border-gray-200 px-4 py-3">CATEGORY</th>
  //             <th className="border-t border-b border-gray-200 px-4 py-3">PRICE</th>
  //             <th className="border-t border-b border-r border-gray-200 px-4 py-3 last:rounded-tr-lg">ACTIONS</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {products.length === 0 ? (
  //             <tr>
  //               <td colSpan={6} className="border-t border-b border-x border-gray-200 px-4 py-3 text-center text-gray-500">
  //                 No products found.
  //               </td>
  //             </tr>
  //           ) : (
  //             products.map((product, idx) => (
  //               <tr key={product.id_produk} className={idx % 2 === 0 ? "bg-white" : "bg-pink-50"}>
  //                 <td className="border-t border-b border-l border-gray-200 px-4 py-3 text-center">
  //                   {String(idx + 1).padStart(2, '0')}
  //                 </td>
  //                 <td className="border-t border-b border-gray-200 px-4 py-3">{product.id_produk}</td>
  //                 <td className="border-t border-b border-gray-200 px-4 py-3 flex items-center gap-3">
  //                   <Image
  //                     src={product.gambar}
  //                     alt={product.nama_produk}
  //                     width={40}
  //                     height={40}
  //                     className="w-10 h-10 rounded object-cover"
  //                   />
  //                   <span>{product.nama_produk}</span>
  //                 </td>

  //                 <td className="border-t border-b border-gray-200 px-4 py-3">{product.kategori}</td>
  //                 <td className="border-t border-b border-gray-200 px-4 py-3">
  //                   {product.harga.replace('Rp', 'Rp ').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
  //                 </td>
  //                 <td className="border-t border-b border-r border-gray-200 px-4 py-3 flex gap-3">
  //                   <form action={handleEdit.bind(null, product.id_produk) as any}>
  //                     <button type="submit" className="text-gray-600 hover:text-black text-lg">✏️</button>
  //                   </form>
  //                   <button className="text-red-500 hover:text-red-700 text-lg">🗑️</button>
  //                 </td>
  //               </tr>
  //             ))
  //           )}
  //         </tbody>
  //         {products.length > 0 && (
  //           <tfoot>
  //             <tr>
  //               <td colSpan={6} className="border-b border-x border-gray-200 first:rounded-bl-lg last:rounded-br-lg"></td>
  //             </tr>
  //           </tfoot>
  //         )}
  //       </table>
  //     </div>
  //   </div>
  // );
    return (
  <div className="mt-6">
    {/* Search and Add button */}
    <div className="mb-4 flex items-center justify-between">
      <form>
        <input
          type="text"
          placeholder="Search product..."
          className="rounded-md border px-3 py-2 text-sm"
        />
      </form>
      <Link
        href="/dashboard/products/create"
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
                    key={product.id_produk}
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
                          src={product.gambar}
                          alt={product.nama_produk}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <p>{product.nama_produk}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">{product.kategori}</td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {product.harga.replace('Rp', 'Rp ').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex gap-2">
                        <form action={handleEdit.bind(null, product.id_produk) as any}>
                          <button
                            type="submit"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ✏️ Edit
                          </button>
                        </form>
                        <button className="text-red-500 hover:text-red-700">🗑️ Delete</button>
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
