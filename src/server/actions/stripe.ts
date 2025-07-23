'use server';

import { PaidTierNames, subscriptionTiers } from '@/data/subscriptionTier';
import { currentUser, User } from '@clerk/nextjs/server';
import { getUserSubscription } from '../db/subscription';
import { Stripe } from 'stripe';
import { env } from '@/data/env/server';
import { env as clientEnv } from '@/data/env/client';
import { redirect } from 'next/navigation';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// ======= CREATE CANCEL SESSION STRIPE =========
export async function createCancelSession() {
    
}

// ======= CREATE CUSTOMER PORTAL SESSION STRIPE ========
export async function createCustomerPortalSession() {
    
}

// ======= CREATE CHECKOUT SESSION STRIPE =========
export async function createCheckoutSession(tier: PaidTierNames) {
  const user = await currentUser();
  if (user == null) return { error: true };

  const subscription = await getUserSubscription(user.id);

  if (subscription == null) return { error: true };

  if (subscription.stripeCustomerId == null) {
    const url = await getCheckoutSession(tier, user);
    if (url == null) return { error: true };
    redirect(url);
  } else {
    // const url = await getSubscriptionUpgradeSession(tier, subscription);
    // redirect(url);
  }
}

// ======= GET CHECKOUT SESSION STRIPE =========
async function getCheckoutSession(tier: PaidTierNames, user: User) {
  const session = await stripe.checkout.sessions.create({
    customer_email: user.primaryEmailAddress?.emailAddress,
    subscription_data: {
      metadata: {
        clerkUserId: user.id,
      },
    },
    line_items: [
      {
        price: subscriptionTiers[tier].stripePriceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    cancel_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
  });

  return session.url;
}