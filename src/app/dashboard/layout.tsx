import React, { ReactNode } from 'react';
import NavBar from './_components/NavBar';
import { Toaster } from '@/components/ui/sonner';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-accent/5 min-h-screen">
      <NavBar />
      <div className="container py-6 px-4">
        <Toaster position="top-right" richColors />
        {children}
      </div>
    </div>
  );
}