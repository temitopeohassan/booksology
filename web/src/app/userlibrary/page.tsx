"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

interface User {
  id: string;
  wallet: string;
  // Add other properties as needed
}

export default function UserLibraryRedirect() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserIdAndRedirect = async () => {
      if (isConnected && address) {
        setIsLoading(true);
        setError(null);
        try {
          const url = `${process.env.NEXT_PUBLIC_API_URL}/users?address=${address}`;
          console.log('Fetching user data from:', url);
          
          const response = await fetch(url);
          console.log('Response status:', response.status);
          
          const responseData = await response.text();
          console.log('Raw response:', responseData);

          if (!response.ok) {
            throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`);
          }

          let users;
          try {
            users = JSON.parse(responseData);
          } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            throw new Error('Invalid response format');
          }

          console.log('Parsed user data:', users);

          // Find the user with the matching wallet address
          const user = users.find((u: User) => u.wallet === address);

          if (user && user.id) {
            console.log('Redirecting to:', `/userlibrary/${user.id}`);
            router.push(`/userlibrary/${user.id}`);
          } else {
            throw new Error('User not found for the connected wallet address');
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserIdAndRedirect();
  }, [isConnected, address, router]);

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">User Library</h1>
        <p>Please connect your wallet to view your library.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">User Library</h1>
        <p>Loading your library...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">User Library</h1>
        <p className="text-red-500">Error: {error}</p>
        <p>Connected Address: {address}</p>
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
