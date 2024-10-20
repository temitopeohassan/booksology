"use client"
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { hasBookshopPassNFT } from '../utils/nftUtils';
import ConnectWalletCard from './ConnectWalletCard';

interface AccessControlWrapperProps {
  children: React.ReactNode;
}

const AccessControlWrapper: React.FC<AccessControlWrapperProps> = ({ children }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const { address, isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      if (isConnected && address) {
        console.log('AccessControlWrapper: Checking for Bookshop Pass NFT...');
        const hasNFT = await hasBookshopPassNFT(address);
        console.log('AccessControlWrapper: Has Bookshop Pass NFT:', hasNFT);
        setHasAccess(hasNFT);
        if (!hasNFT) {
          console.log('AccessControlWrapper: Redirecting to mint page...');
          router.push('/mint');
        }
      } else {
        setHasAccess(false);
      }
    };

    checkAccess();
  }, [isConnected, address, router]);

  if (!isConnected) {
    console.log('AccessControlWrapper: Wallet not connected');
    return <ConnectWalletCard />;
  }

  if (!hasAccess) {
    console.log('AccessControlWrapper: No access, rendering null');
    return null; // This will prevent the content from flashing before redirect
  }

  console.log('AccessControlWrapper: Rendering children');
  return <>{children}</>;
};

export default AccessControlWrapper;
