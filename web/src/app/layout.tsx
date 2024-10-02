import type { Metadata } from "next";
import { Inter } from "next/font/google";
import OnchainProviders from './OnchainProviders';
import "./globals.css";
import { ReactNode } from 'react'; // Import ReactNode

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Booksology | The Bookstore for the Modern Age",
  description: "Booksology is a bookstore for the modern age. It is a place where you can find all your favorite books, and more.",
};

// Define the type for the props
type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        {/* Add any head tags here if needed */}
      </head>
      <body>
        <OnchainProviders>
          {children}
        </OnchainProviders>
      </body>
    </html>
  );
}
