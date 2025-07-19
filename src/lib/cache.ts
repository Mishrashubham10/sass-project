/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { cache } from 'react';

export type ValidTags =
  | ReturnType<typeof getGlobalTag>
  | ReturnType<typeof getUserTag>
  | ReturnType<typeof getIdTag>;

export const CACHE_TAGS = {
  products: 'products',
  productViews: 'productViews',
  subscription: 'subscription',
} as const;

// ============ GLOBAL TIER ============
export function getGlobalTag(tag: keyof typeof CACHE_TAGS) {
  return `global:${CACHE_TAGS[tag]}` as const;
}

// ============ USER TIER ==============
export function getUserTag(userId: string, tag: keyof typeof CACHE_TAGS) {
  return `user:${userId}-${CACHE_TAGS[tag]}` as const;
}

// ============ INDIVISUAL PRODUCT TIER ==============
export function getIdTag(id: string, tag: keyof typeof CACHE_TAGS) {
  return `id:${id}-${CACHE_TAGS[tag]}` as const;
}

// ============= CLEAR FULL CACHE ==============
export function clearFullCache() {
  revalidatePath('*');
}

// ============ DB CACHE ============
export function dbCache<T extends (...args: any[]) => Promise<any>>(
  cb: Parameters<typeof unstable_cache<T>>[0],
  {
    tags,
  }: {
    tags: ValidTags[];
  }
) {
  return cache(unstable_cache<T>(cb, undefined, { tags: [...tags, '*'] }));
}

// ======= REVALIDATE DB CACHE ==========
export function revalidateDbCache({
  tag,
  userId,
  id,
}: {
  tag: keyof typeof CACHE_TAGS;
  userId?: string;
  id?: string;
}) {
  revalidateTag(getGlobalTag(tag));
  if (userId != null) {
    revalidateTag(getUserTag(userId, tag));
  }
  if (id != null) {
    revalidateTag(getIdTag(id, tag));
  }
}