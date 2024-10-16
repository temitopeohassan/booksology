import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from 'react';
import RootLayout from './RootLayout';
import { AccessControlProvider } from '../contexts/AccessControlContext';

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
        <RootLayout>
          <AccessControlProvider>
            {children}
          </AccessControlProvider>
        </RootLayout>
      </body>
    </html>
  );
}
