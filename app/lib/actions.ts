// actions.ts
'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id};
    `;

    redirect(`/dashboard/invoices/${id}`);
  } catch (error) {
    console.error('Failed to update invoice:', error);
    throw new Error('Failed to update invoice');
  }
}