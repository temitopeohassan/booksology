"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import BookMintForm from '../../../components/BookMintForm';

const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;

export default function MintBookPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address !== ADMIN_ADDRESS) {
      router.push('/');
    }
  }, [isConnected, address, router]);

  if (!isConnected || address !== ADMIN_ADDRESS) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mint New Book</h1>
      <BookMintForm />
    </div>
  );
}
