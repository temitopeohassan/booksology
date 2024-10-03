'use client';
import { ReactNode } from 'react';
import OnchainProviders from './OnchainProviders';
import Header from './Header';
import Footer from './Footer';

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <OnchainProviders>
      <Header />
      <main>{children}</main>
      <Footer />
    </OnchainProviders>
  );
}
