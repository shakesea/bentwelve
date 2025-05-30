'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProductPage() {
  const router = useRouter();
  const [imageSelected, setImageSelected] = useState<File | null>(null);

  const handleCancel = () => {
    router.push("/dashboard/products");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageSelected(e.target.files[0]);
    }
  };

  return (
    <div className="pt-32 min-h-screen flex justify-center">
      <div className="p-10 w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-10 text-center">Edit Product</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6 w-full">
            <div className="flex items-center">
              <label className="w-32 text-sm font-medium">Name</label>
              <input
                type="text"
                placeholder="Product name"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none"
              />
            </div>

            <div className="flex items-center">
              <label className="w-32 text-sm font-medium">Category</label>
              <input
                type="text"
                placeholder="Product category"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none"
              />
            </div>

            <div className="flex items-center">
              <label className="w-32 text-sm font-medium">Price</label>
              <input
                type="number"
                placeholder="Product price"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-center items-center">
            {!imageSelected && (
              <label className="h-40 w-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:border-pink-500 hover:text-pink-500 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                + Add Menu Image
              </label>
            )}

            {imageSelected && (
              <div className="h-40 w-40 border-2 border-solid border-gray-300 rounded-lg flex items-center justify-center">
                <img
                  src={URL.createObjectURL(imageSelected)}
                  alt="Selected"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handleCancel}
            className="bg-red-500 text-white rounded-xl py-3 px-8 hover:bg-red-600 transition"
          >
            Cancel
          </button>

          <button className="bg-pink-500 text-white rounded-xl py-3 px-8 hover:bg-pink-600 transition">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
