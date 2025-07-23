import { getUserSubscriptionTier } from './db/subscription';

// =========== CAN REMOVE BRANDING ============
export async function canRemoveBranding(userId: string | null) {
  if (userId == null) return false;
  const tier = await getUserSubscriptionTier(userId);
  return tier.canRemoveBranding;
}

// =========== CAN CUSTOMIZE BANNER ============
export async function canCustomizeBanner(userId: string | null) {
  if (userId == null) return false;
  const tier = await getUserSubscriptionTier(userId);
  return tier.canCustomizeBanner;
}
// =========== CAN ACCESS ANALYTICS ============
export async function canAccessAnalytice(userId: string | null) {
  if (userId == null) return false;
  const tier = await getUserSubscriptionTier(userId);
  return tier.canAccessAnalytics;
}