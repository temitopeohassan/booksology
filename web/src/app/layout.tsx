import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from 'react';
import { AccessControlProvider } from '../contexts/AccessControlContext';
import RootLayout from './RootLayout';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from './wagmi'; // adjust path as needed

export const metadata: Metadata = {
  title: "Booksology | The Bookstore for the Modern Age",
  description: "Booksology is a bookstore for the modern age. It is a place where you can find all your favorite books, and more.",
};

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={wagmiConfig}>
          <AccessControlProvider>
            <RootLayout>{children}</RootLayout>
          </AccessControlProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}