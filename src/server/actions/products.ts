'use server';

// ============ SCHEMA ============
import { productDetailsSchema } from '@/schema/products';

// ============ CLERK ============
import { auth } from '@clerk/nextjs/server';

// ============ ZOD ============
import z from 'zod';

// =========== CREATE PRODDUCT DB ==============
import { createProduct as createProductDb } from '@/server/db/products';

// ========== NEXT NAVIGATION ===========
import { redirect } from 'next/navigation';

export async function createProdudct(
  unsafeData: z.infer<typeof productDetailsSchema>
): Promise<{ error: boolean, message: string } | undefined> {
  const { userId } = await auth();
  const { success, data } = productDetailsSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return { error: true, message: 'There was an error creating your product' };
  }

  const { id } = await createProductDb({ ...data, clerkUserId: userId });

  redirect(`/dashboard/products/${id}/edit?tab=countries`);
}