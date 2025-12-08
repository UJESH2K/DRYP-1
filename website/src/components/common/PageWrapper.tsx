'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === '/login' || pathname === '/signup' || pathname.startsWith('/dashboard');

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}