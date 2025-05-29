'use client';

export default function BestSellingProducts() {
  const products = [
    { name: 'Romantic Roses', sales: 150, price: 60 },
    { name: 'Sunflower Delight', sales: 120, price: 50 },
    { name: 'Tulip Elegance', sales: 90, price: 70 },
  ];

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
              <td className="py-3">{product.name}</td>
              <td className="py-3">{product.sales} units</td>
              <td className="py-3">${product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}