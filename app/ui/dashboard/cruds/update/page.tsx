'use client';

import { useState, useEffect, useTransition } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { updateProduct } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import { fetchProductById } from '@/app/lib/data';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface FormState {
  message: string;
  errors: { [key: string]: string };
}

export default function UpdateProductPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const initialState: FormState = { message: '', errors: {} };
  const [state, formAction] = useFormState(updateProduct.bind(null, id), initialState);
  const [product, setProduct] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const productData = await fetchProductById(id);
        setProduct(productData || {
          id,
          name: 'Unknown Product',
          category: 'Uncategorized',
          price: 0,
          image: '',
        });
      } catch (error) {
        console.error('Failed to load product:', error);
        setProduct({
          id,
          name: 'Unknown Product',
          category: 'Uncategorized',
          price: 0,
          image: '',
        });
      }
    };
    loadProduct();
  }, [id]);

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  if (!product) return <div className="text-center mt-20 text-pink-600">Loading product...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4 py-10">
      <form
        action={handleSubmit}
        className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-8 md:p-12"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-pink-600 text-center mb-8">
          Update Product
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">Product Name</label>
            <input
              name="name"
              defaultValue={product.name}
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="e.g. Rose Bouquet"
              aria-describedby="name-error"
              required
            />
            {state.errors?.name && (
              <p id="name-error" className="text-red-500 text-sm mt-1">{state.errors.name}</p>
            )}
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">Category</label>
            <select
              name="category"
              defaultValue={product.category}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
              aria-describedby="category-error"
              required
            >
              <option value="">Pilih kategori</option>
              <option value="Rangkaian Bunga">Rangkaian Bunga</option>
              <option value="Bunga Potong">Bunga Potong</option>
            </select>
            {state.errors?.category && (
              <p id="category-error" className="text-red-500 text-sm mt-1">{state.errors.category}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">Price</label>
            <input
              name="price"
              defaultValue={product.price.toString()}
              type="number"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="e.g. 100000"
              aria-describedby="price-error"
              required
            />
            {state.errors?.price && (
              <p id="price-error" className="text-red-500 text-sm mt-1">{state.errors.price}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            disabled={isPending}
            className="px-6 py-3 border border-pink-300 text-pink-500 rounded-lg hover:bg-pink-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <SubmitButton />
        </div>

        {state.message && (
          <p className="text-green-600 text-sm mt-4 text-center">{state.message}</p>
        )}
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition disabled:bg-pink-300"
      disabled={pending}
    >
      {pending ? 'Saving...' : 'Save Changes'}
    </button>
  );
}
