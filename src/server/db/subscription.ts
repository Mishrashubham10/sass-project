import { db } from '@/drizzle/db';
import { UserSubscriptionTable } from '@/drizzle/schema';

// =========== CREATE SUBSCRIPTIONS ==============
export function createUserSubscription(
  data: typeof UserSubscriptionTable.$inferInsert
) {
  db.insert(UserSubscriptionTable).values(data).onConflictDoNothing({
    target: UserSubscriptionTable.clerkUserId,
  });
}