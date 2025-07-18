import { db } from '@/drizzle/db';
import { ProductTable, UserSubscriptionTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

// ============== DELETE USER ===================
export function deleteUser(clerkUserId: string) {
  db.batch([
    db
      .delete(UserSubscriptionTable)
      .where(eq(UserSubscriptionTable.clerkUserId, clerkUserId)),
    db.delete(ProductTable).where(eq(ProductTable.clerkUserId, clerkUserId)),
  ]);
}