'use client';

import { useState, useEffect, useTransition } from 'react';
import { useFormState, useFormStatus } from 'react-dom'; // Tetap gunakan useFormState
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
  const [state, formAction] = useFormState(updateProduct.bind(null, id), initialState); // Tetap gunakan useFormState
  const [product, setProduct] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();

  // Fetch initial product data asynchronously
  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const productData = await fetchProductById(id);
        if (productData) {
          setProduct(productData);
        } else {
          setProduct({
            id,
            name: 'Unknown Product',
            category: 'Uncategorized',
            price: 0,
            image: '',
          });
        }
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

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-10 min-h-screen flex justify-center">
      <div className="text-xl font-bold mb-10 text-center">Update Product</div>
      <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        <div className="space-y-6 w-full">
          <div className="flex items-center">
            <label className="w-32 text-sm font-medium">Product Name</label>
            <input
              name="name"
              defaultValue={product.name}
              type="text"
              placeholder="Product name"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none"
              aria-describedby="name-error"
              required
            />
            {state.errors?.name && (
              <p id="name-error" className="text-red-500 text-sm mt-1">
                {state.errors.name}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <label className="w-32 text-sm font-medium">Category</label>
            <input
              name="category"
              defaultValue={product.category}
              type="text"
              placeholder="Product category"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none"
              aria-describedby="category-error"
              required
            />
            {state.errors?.category && (
              <p id="category-error" className="text-red-500 text-sm mt-1">
                {state.errors.category}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <label className="w-32 text-sm font-medium">Price</label>
            <input
              name="price"
              defaultValue={product.price.toString()}
              type="number"
              step="0.01"
              placeholder="Product price"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none"
              aria-describedby="price-error"
              required
            />
            {state.errors?.price && (
              <p id="price-error" className="text-red-500 text-sm mt-1">
                {state.errors.price}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-10">
          <button
            type="button"
            className="border border-gray-300 rounded-lg px-6 py-3"
            onClick={() => window.history.back()}
            disabled={isPending}
          >
            Cancel
          </button>
          <SubmitButton />
          {state.message && <p className="text-green-500 mt-2">{state.message}</p>}
        </div>
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="bg-blue-500 text-white rounded-lg px-6 py-3 disabled:bg-blue-300"
      disabled={pending}
    >
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}