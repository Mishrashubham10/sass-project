'use server';

// ============ SCHEMA ============
import {
  productCountryDiscountsSchema,
  productCustomizationSchema,
  productDetailsSchema,
} from '@/schema/products';

// ============ CLERK ============
import { auth } from '@clerk/nextjs/server';

// ============ ZOD ============
import z from 'zod';

// =========== DB ==============
import {
  createProduct as createProductDb,
  deleteProduct as deleteProductDb,
  updateProduct as updateProductDb,
  updateCountryDiscounts as updateCountryDiscountsDb,
  updateProductCustomization as updateProductCustomizationDb,
} from '@/server/db/products';

// ========== NEXT NAVIGATION ===========
import { redirect } from 'next/navigation';

// ========== PERMISSIONS ===========
import { canCreateProduct, canCustomizeBanner } from '../permissions';

// =========== CREATE PRODUCT ACTION ==============
export async function createProdudct(
  unsafeData: z.infer<typeof productDetailsSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();
  const { success, data } = productDetailsSchema.safeParse(unsafeData);
  const canCreate = await canCreateProduct(userId);

  if (!success || userId == null || !canCreate) {
    return { error: true, message: 'There was an error creating your product' };
  }

  const { id } = await createProductDb({ ...data, clerkUserId: userId });

  redirect(`/dashboard/products/${id}/edit?tab=countries`);
}

// =========== UPDATE PRODUCT ACTION ==============
export async function updateProdudct(
  id: string,
  unsafeData: z.infer<typeof productDetailsSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();
  const { success, data } = productDetailsSchema.safeParse(unsafeData);
  const errorMsg = 'There was an error updating your product';

  if (!success || userId == null) {
    return { error: true, message: errorMsg };
  }

  const isSuccess = await updateProductDb(data, { id, userId });

  return {
    error: false,
    message: isSuccess ? 'Product details updated' : errorMsg,
  };
}

// =========== DELETE PRODUCT ACTION ==============
export async function deleteProduct(id: string) {
  const { userId } = await auth();
  const errorMessage = 'There was an error deleting your product';

  if (userId == null) {
    return { error: true, message: errorMessage };
  }

  const isSuccess = await deleteProductDb({ id, userId });

  return {
    error: !isSuccess,
    message: isSuccess ? 'Successfully deleted your product' : errorMessage,
  };
}

// ========= UPDATE COUNTRY DISCOUNT ACTION =========
export async function updateCountryDiscounts(
  id: string,
  unsafeData: z.infer<typeof productCountryDiscountsSchema>
) {
  const { userId } = await auth();
  const { success, data } = productCountryDiscountsSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return {
      error: true,
      message: 'There was an error saving your country discounts',
    };
  }

  const insert: {
    countryGroupId: string;
    productId: string;
    coupon: string;
    discountPercentage: number;
  }[] = [];
  const deleteIds: { countryGroupId: string }[] = [];

  data.groups.forEach((group) => {
    if (
      group.coupon != null &&
      group.coupon.length > 0 &&
      group.discountPercentage != null &&
      group.discountPercentage > 0
    ) {
      insert.push({
        countryGroupId: group.countryGroupId,
        coupon: group.coupon,
        discountPercentage: group.discountPercentage / 100,
        productId: id,
      });
    } else {
      deleteIds.push({ countryGroupId: group.countryGroupId });
    }
  });

  await updateCountryDiscountsDb(deleteIds, insert, { productId: id, userId });

  return { error: false, message: 'Country discounts saved' };
}

// ======= UPDATE PRODUCT CUSTOMIZATION ACTION ========
export async function updateProductCustomization(
  id: string,
  unsafeData: z.infer<typeof productCustomizationSchema>
) {
  const { userId } = await auth();
  const { success, data } = productCustomizationSchema.safeParse(unsafeData);
  const canCustomize = await canCustomizeBanner(userId);

  if (!success || userId == null || !canCustomize) {
    return {
      error: true,
      message: 'There was an error updating your banner',
    };
  }

  await updateProductCustomizationDb(data, { productId: id, userId });

  return { error: false, message: 'Banner updated' };
}