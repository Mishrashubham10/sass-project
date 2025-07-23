import { subscriptionTiers } from '@/data/subscriptionTier';
import { db } from '@/drizzle/db';
import { UserSubscriptionTable } from '@/drizzle/schema';
import {
  CACHE_TAGS,
  dbCache,
  getUserTag,
  revalidateDbCache,
} from '@/lib/cache';
import { SQL } from 'drizzle-orm';

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

// =========== GET USER SUBSCRIPTIONS =============
export function getUserSubscription(userId: string) {
  const cacheFn = dbCache(getUserSubscriptionInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.subscription)],
  });

  return cacheFn(userId);
}

//  ========== UPDATE SUBSCRIPITON =============
export async function updateUserSubscription(
  where: SQL,
  data: Partial<typeof UserSubscriptionTable.$inferInsert>
) {
  const [updatedSubscription] = await db
    .update(UserSubscriptionTable)
    .set(data)
    .where(where)
    .returning({
      id: UserSubscriptionTable.id,
      userId: UserSubscriptionTable.clerkUserId,
    });

  if (updatedSubscription != null) {
    revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      userId: updatedSubscription.userId,
      id: updatedSubscription.id,
    });
  }
}

// ========= GET USER SUBSCRIPTION TIER ==========
export async function getUserSubscriptionTier(userId: string) {
  const subscription = await getUserSubscription(userId);

  // if (subscription == null) throw new Error('User has no subscription');

  // ======= TESTING PURPOSE ========
  const tier = subscription?.tier ?? 'Free';

  return subscriptionTiers[tier];
  // return subscriptionTiers[subscription?.tier]
}

// ========= GET USER SUBSCRIPTIONS INTERNAL ===========
async function getUserSubscriptionInternal(userId: string) {
  return db.query.UserSubscriptionTable.findFirst({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
  });
}