'use server';

// ============ SCHEMA ============
import { productDetailsSchema } from '@/schema/products';

// ============ CLERK ============
import { auth } from '@clerk/nextjs/server';

// ============ ZOD ============
import z from 'zod';

// =========== CREATE PRODDUCT DB ==============
import {
  createProduct as createProductDb,
  deleteProduct as deleteProductDb,
} from '@/server/db/products';

// ========== NEXT NAVIGATION ===========
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// =========== CREATE PRODUCT ACTION ==============
export async function createProdudct(
  unsafeData: z.infer<typeof productDetailsSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();
  const { success, data } = productDetailsSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return { error: true, message: 'There was an error creating your product' };
  }

  const { id } = await createProductDb({ ...data, clerkUserId: userId });

  redirect(`/dashboard/products/${id}/edit?tab=countries`);
}

// =========== DELETE PRODUCT ACTION ==============
export async function deleteProduct(id: string) {
  const { userId } = await auth();

  const errorMsg = 'There was an error deleting your product.';

  if (userId == null)
    return {
      error: true,
      message: errorMsg,
    };

  const isSuccess = await deleteProductDb({ id, userId });

  return {
    error: !isSuccess,
    message: isSuccess ? 'Successfully deleted your product' : errorMsg,
  };
}