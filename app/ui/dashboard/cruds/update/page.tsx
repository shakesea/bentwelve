// page.tsx
'use client';

import { useState, useEffect } from 'react';
import { updateInvoice } from '@/app/lib/actions'; // Sesuaikan path dengan lokasi actions.ts

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('pending');
  const [isImageChanged, setIsImageChanged] = useState(false);

  // Simulasi fetch data dari server (ganti dengan logika fetch sesungguhnya)
  useEffect(() => {
    const fetchInvoiceData = async () => {
      // Ganti dengan API call ke server atau database
      const mockData = {
        customerId: 'cust_001',
        amount: 100,
        status: 'pending',
      };
      setCustomerId(mockData.customerId);
      setAmount(mockData.amount.toString());
      setStatus(mockData.status);
    };
    fetchInvoiceData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsImageChanged(true);
    }
  };

  return (
    <div className="p-10 min-h-screen flex justify-center">
      <div className="text-xl font-bold mb-10 text-center">Edit Product</div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        <div className="space-y-6 w-full">
          <div className="flex items-center">
            <label className="w-32 text-sm font-medium">Product Name</label>
            <input
              name="customerId"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              type="text"
              placeholder="Product name"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center">
            <label className="w-32 text-sm font-medium">Category</label>
            <input
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              placeholder="Product category"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center">
            <label className="w-32 text-sm font-medium">Price</label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none"
              required
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </form>

      <div className="flex justify-end gap-4 mt-10">
        <button
          type="button"
          className="border border-gray-300 rounded-lg px-6 py-3"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          formAction={(formData: FormData) => updateInvoice(params.id, formData)}
          className="bg-blue-500 text-white rounded-lg px-6 py-3"
        >
          Save
        </button>
      </div>
    </div>
  );
}