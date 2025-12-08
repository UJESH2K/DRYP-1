import type { Metadata } from "next";
import { Inter, Josefin_Sans } from "next/font/google";
import localFont from 'next/font/local';
import { AuthProvider } from '@/contexts/AuthContext';
import PageWrapper from '@/components/common/PageWrapper';
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const zaloga = localFont({
  src: '../assets/fonts/Zaloga.ttf',
  display: 'swap',
  variable: '--font-zaloga',
});

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: '--font-josefin-sans',
});

export const metadata: Metadata = {
  title: "DR-YP Vendor Hub",
  description: "Manage your products and sales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${zaloga.variable} ${josefinSans.variable} font-sans antialiased overflow-x-hidden`}
      >
        <AuthProvider>
          <PageWrapper>
            {children}
          </PageWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
