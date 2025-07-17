import BrandLogo from '@/components/BrandLogo';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function NavBar() {
  return (
    <header className="py-6 shadow-xl flex justify-center fixed top-0 w-full z-10 bg-background/95">
      <nav className="flex items-center gap-10 container font-semibold">
        {/* ====== HOME LINK ======== */}
        <Link href="/" className="mr-auto">
          <BrandLogo />
        </Link>
        {/* ====== FEATURES LINK ======== */}
        <Link href="#" className="text-lg">
          Features
        </Link>
        {/* ====== PRICING LINK ======== */}
        <Link href="/#pricing" className="text-lg">
          Pricing
        </Link>
        {/* ====== ABOUT LINK ======== */}
        <Link href="#" className="text=lg">
          About
        </Link>
        <span className="text-lg cursor-pointer">
          <SignedIn>
            <Link href="/dashboard">Dashboard</Link>
          </SignedIn>
          <SignedOut>
            <SignInButton>Login</SignInButton>
          </SignedOut>
        </span>
      </nav>
    </header>
  );
}