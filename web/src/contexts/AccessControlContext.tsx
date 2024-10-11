import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ACCESSCONTROL_CONTRACT_ADDRESS, ACCESSCONTROL_CONTRACT_ABI } from '../app/constants';

const AccessControlContext = createContext<{
  hasAccess: (eBookId: number) => Promise<boolean>;
  requestAccess: (eBookId: number) => Promise<boolean>;
} | null>(null);

export const useAccessControl = () => {
  const context = useContext(AccessControlContext);
  if (!context) {
    throw new Error('useAccessControl must be used within an AccessControlProvider');
  }
  return context;
};

interface AccessControlProviderProps {
  children: React.ReactNode;
}

export const AccessControlProvider: React.FC<AccessControlProviderProps> = ({ children }) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    const initContract = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await provider.getSigner();
        setSigner(newSigner);
        const accessControlContract = new ethers.Contract(
          ACCESSCONTROL_CONTRACT_ADDRESS.toString(),
          ACCESSCONTROL_CONTRACT_ABI,
          newSigner
        );
        setContract(accessControlContract);
      }
    };

    initContract();
  }, []);

  const hasAccess = async (eBookId: number) => {
    if (!contract || !signer) return false;
    try {
      const address = await signer.getAddress();
      const result = await contract.verifyAccess(address, eBookId.toString());
      return result;
    } catch (error) {
      console.error('Error checking access:', error);
      return false;
    }
  };

  const requestAccess = async (eBookId: number) => {
    if (!contract) return false;
    try {
      const result = await contract.requestAccess(eBookId.toString());
      return result;
    } catch (error) {
      console.error('Error requesting access:', error);
      return false;
    }
  };

  return (
    <AccessControlContext.Provider value={{ hasAccess, requestAccess }}>
      {children}
    </AccessControlContext.Provider>
  );
};
