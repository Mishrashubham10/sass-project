import { Button } from '@/components/ui/button';
import { SignUpButton } from '@clerk/nextjs';
import { ArrowRightIcon, CheckIcon } from 'lucide-react';
import Link from 'next/link';
import { NeonIcon } from './_icons/Neon';
import { ClerkIcon } from './_icons/Clerk';
import { subscriptionTiersInOrder } from '@/data/subscriptionTier';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCompactNumber } from '@/lib/formatters';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import BrandLogo from '@/components/BrandLogo';

export default function Home() {
  return (
    <>
      {/* ========= MAIN SECTION ========== */}
      <section className="min-h-screen bg-[radial-gradient(hsl(0,72%,65%,40%),hsl(24,62%,73%,40%),hsl(var(--background))_60%)] flex items-center justify-center text-center text-balance flex-col gap-8 px-4">
        <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight m-4">
          Price Smarter, Sell bigger!
        </h1>
        <p className="text-lg lg:text-3xl max-w-screen-xl">
          Optimize your product pricing across countries to maximize sales.
          Capture 85% of the untapped market with location-based dynamic pricing
        </p>
        <SignUpButton>
          <Button className="text-lg p-6 rounded-xl flex gap-2">
            Get started for free <ArrowRightIcon className="size-5" />
          </Button>
        </SignUpButton>
      </section>
      {/* ========= ALMUNY SECTION ========== */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-16 flex flex-col gap-16 px-8 md:px-16">
          <h2 className="text-3xl text-center text-balance">
            Trusted by the top modern companies
          </h2>
          {/* ======== ICONS GRID =========== */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-16">
            <Link href="https://neon.tech">
              <NeonIcon />
            </Link>
            <Link href="https://clerk.com">
              <ClerkIcon />
            </Link>
            <Link href="https://neon.tech">
              <NeonIcon />
            </Link>
            <Link href="https://clerk.com">
              <ClerkIcon />
            </Link>
            <Link href="https://neon.tech">
              <NeonIcon />
            </Link>
            <Link href="https://clerk.com">
              <ClerkIcon />
            </Link>
            <Link href="https://neon.tech">
              <NeonIcon />
            </Link>
            <Link href="https://clerk.com">
              <ClerkIcon />
            </Link>
            <Link href="https://neon.tech">
              <NeonIcon />
            </Link>
            <Link href="https://clerk.com" className="md:max-xl:hidden">
              <ClerkIcon />
            </Link>
          </div>
        </div>
      </section>
      {/* ========= PRICING SECTION ========== */}
      <section id="pricing" className="px-8 py-16 bg-accent/5">
        <h2 className="text-4xl text-center text-balance font-semibold mb-8">
          Pricing software which pays for itself 20x over
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-screen-xl mx-auto">
          {subscriptionTiersInOrder.map((tier) => (
            <PricingCard key={tier.name} {...tier} />
          ))}
        </div>
      </section>
      {/* ========= FOOTER SECTION ========== */}
      <footer className="container px-4 pt-16 pb-8 flex sm:flex-row flex-col gap-8 sm:gap-4 justify-between items-start">
        <Link href="/">
          <BrandLogo />
        </Link>
        <section className="flex flex-col sm:flex-row gap-8">
          <div className="flex flex-col gap-8">
            <FooterLinkGroup
              title="Help"
              links={[
                {
                  label: 'PPP Discounts',
                  href: '#',
                },
                {
                  label: 'Discount API',
                  href: '#d',
                },
              ]}
            />
            <FooterLinkGroup
              title="Solutions"
              links={[
                { label: 'Newsletter', href: '#new' },
                { label: 'SaaS Business', href: '#sas' },
                { label: 'Online Courses', href: '#on' },
              ]}
            />
          </div>
          <div className="flex flex-col gap-8">
            <FooterLinkGroup
              title="Features"
              links={[{ label: 'PPP Discounts', href: '#pp' }]}
            />
            <FooterLinkGroup
              title="Tools"
              links={[
                { label: 'Salary Converter', href: '#t' },
                { label: 'Coupon Generator', href: '#u' },
                { label: 'Stripe App', href: '#r' },
              ]}
            />
            <FooterLinkGroup
              title="Company"
              links={[
                { label: 'Affiliate', href: '#l' },
                { label: 'Twitter', href: '#f' },
                { label: 'Terms of Service', href: '#v' },
              ]}
            />
          </div>
          <div className="flex flex-col gap-8">
            <FooterLinkGroup
              title="Integrations"
              links={[
                { label: 'Lemon Squeezy', href: '#n' },
                { label: 'Gumroad', href: '#o' },
                { label: 'Stripe', href: '#i' },
                { label: 'Chargebee', href: '#e' },
                { label: 'Paddle', href: '#d' },
              ]}
            />
            <FooterLinkGroup
              title="Tutorials"
              links={[
                { label: 'Any Website', href: '#a' },
                { label: 'Lemon Squeezy', href: '#l' },
                { label: 'Gumroad', href: '#g' },
                { label: 'Stripe', href: '#s' },
                { label: 'Chargebee', href: '#c' },
                { label: 'Paddle', href: '#p' },
              ]}
            />
          </div>
        </section>
      </footer>
    </>
  );
}

// ---------- PRICING CARD ----------
function PricingCard({
  name,
  priceInCents,
  maxNumberOfVisits,
  maxNumberOfProducts,
  canRemoveBranding,
  canAccessAnalytics,
  canCustomizeBanner,
}: (typeof subscriptionTiersInOrder)[number]) {
  const isMostPopular = name === 'Standard';

  return (
    <Card>
      <CardHeader>
        <div className="text-accent font-semibold mb-8">{name}</div>
        <CardTitle className="text-xl font-bold">
          ${priceInCents / 100} /mo
        </CardTitle>
        <CardDescription>
          {formatCompactNumber(maxNumberOfVisits)} pricing page visits/mo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpButton>
          <Button
            className={`
              ${
                isMostPopular
                  ? 'bg-accent text-accent-foreground shadow hover:bg-accent/90'
                  : 'default'
              } text-lg w-full rounded-lg
            `}
          >
            Get Started
          </Button>
        </SignUpButton>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-start">
        <Feature className="font-bold">
          {maxNumberOfProducts}{' '}
          {maxNumberOfProducts === 1 ? 'product' : 'products'}
        </Feature>
        <Feature>PPP Discounts</Feature>
        {canAccessAnalytics && <Feature>Advanced analytics</Feature>}
        {canCustomizeBanner && <Feature>Banner Customization</Feature>}
        {canRemoveBranding && <Feature>Remove Easy PPP branding</Feature>}
      </CardFooter>
    </Card>
  );
}

// ----------- FEATURE ----------
function Feature({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <CheckIcon className="size-4 stroke-accent bg-accent/45 rounded-full p-0.5" />
      <span>{children}</span>
    </div>
  );
}

// --------- FOOTER LINK GROUP ---------
function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold">{title}</h3>
      <ul className="flex flex-col gap-2 text-sm">
        {links.map((link) => (
          <li className="" key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}