// app/dashboard2/components/dashboard/BestSellingProducts.tsx
'use client';

import { BestSellingProduct } from '@/app/lib/data';

interface BestSellingProductsProps {
  products: BestSellingProduct[];
}

export default function BestSellingProducts({ products }: BestSellingProductsProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Produk Terlaris</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="pb-2 text-gray-600">Product</th>
            <th className="pb-2 text-gray-600">Sales</th>
            <th className="pb-2 text-gray-600">Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index} className="border-b">
              <td className="py-3 text-gray-600">{product.name}</td>
              <td className="py-3 text-gray-600">{product.sales} units</td>
              <td className="py-3 text-gray-600">Rp {product.price.toLocaleString('id-ID')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}