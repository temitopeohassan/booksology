declare global {
  interface Window {
    ethereum?: any;
  }
}

import { ethers } from 'ethers';
import { BOOKSHOPPASSNFT_CONTRACT_ADDRESS, BOOKSHOPPASSNFT_CONTRACT_ABI } from '../app/constants';

export async function hasIdentityNFT(address: string): Promise<boolean> {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(BOOKSHOPPASSNFT_CONTRACT_ADDRESS, BOOKSHOPPASSNFT_CONTRACT_ABI, provider);
    try {
      const hasMinted = await contract.hasMinted(address);
      return hasMinted;
    } catch (error) {
      console.error('Error checking IdentityNFT:', error);
      return false;
    }
  }
  return false;
}
