"use client"
import React, { useState, useEffect } from 'react';
import { useAccessControl } from '../contexts/AccessControlContext';
import { hasIdentityNFT } from '../utils/nftUtils';
import { useRouter } from 'next/navigation';
import ConnectWalletCard from './ConnectWalletCard';
import { useAccount } from 'wagmi';

interface AccessControlWrapperProps {
  eBookId?: number;
  children: React.ReactNode;
}

const AccessControlWrapper: React.FC<AccessControlWrapperProps> = ({ eBookId, children }) => {
  const { hasAccess, requestAccess } = useAccessControl();
  const [canAccess, setCanAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const checkAccessAndNFT = async () => {
      if (isConnected && address) {
        try {
          const hasNFT = await hasIdentityNFT(address);
          if (!hasNFT) {
            router.push('/mint');
            return;
          }
          if (eBookId) {
            const access = await hasAccess(eBookId);
            setCanAccess(access);
          } else {
            setCanAccess(true);
          }
        } catch (error) {
          console.error('Error checking access:', error);
        }
      }
      setLoading(false);
    };

    checkAccessAndNFT();
  }, [eBookId, hasAccess, address, isConnected, router]);

  const handleRequestAccess = async () => {
    if (eBookId) {
      try {
        const granted = await requestAccess(eBookId);
        if (granted) {
          setCanAccess(true);
        }
      } catch (error) {
        console.error('Error requesting access:', error);
      }
    }
  };

  if (!isConnected) {
    return <ConnectWalletCard />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!canAccess && eBookId) {
    return (
      <div>
        <p>You don't have access to this content.</p>
        <button onClick={handleRequestAccess}>Request Access</button>
      </div>
    );
  }

  return <>{children}</>;
};

export default AccessControlWrapper;
