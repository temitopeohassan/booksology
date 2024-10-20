"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

export default function UserLibraryRedirect() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      router.push(`/userlibrary/${address}`);
    }
  }, [isConnected, address, router]);

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">User Library</h1>
        <p>Please connect your wallet to view your library.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">User Library</h1>
      <p>Redirecting to your personal library...</p>
    </div>
  );
}

