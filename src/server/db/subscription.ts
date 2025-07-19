import { db } from '@/drizzle/db';
import { UserSubscriptionTable } from '@/drizzle/schema';
import { CACHE_TAGS, revalidateDbCache } from '@/lib/cache';

// =========== CREATE SUBSCRIPTIONS ==============
export async function createUserSubscription(
  data: typeof UserSubscriptionTable.$inferInsert
) {
  const [newSubscripiton] = await db
    .insert(UserSubscriptionTable)
    .values(data)
    .onConflictDoNothing({
      target: UserSubscriptionTable.clerkUserId,
    })
    .returning({
      id: UserSubscriptionTable.id,
      userId: UserSubscriptionTable.clerkUserId,
    });

  if (newSubscripiton != null) {
    revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      id: newSubscripiton.id,
      userId: newSubscripiton.userId,
    });
  }

  return newSubscripiton;
}