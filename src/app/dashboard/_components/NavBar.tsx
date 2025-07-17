import BrandLogo from '@/components/BrandLogo';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import React from 'react';

export default function NavBar() {
  return (
    <header className="flex py-4 shadow bg-background justify-center">
      <nav className="flex items-center gap-10 px-4 container">
        <Link href="/dashboard" className="mr-auto">
          <BrandLogo />
        </Link>
        <Link href="/dashboard/products">Products</Link>
        <Link href="/dashboard/analytics">Products</Link>
        <Link href="/dashboard/subscription">Subscription</Link>
        <UserButton />
      </nav>
    </header>
  );
}