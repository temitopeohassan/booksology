declare global {
  interface Window {
    ethereum?: any;
  }
}

import { ethers } from 'ethers';
import { IDENTITYNFT_CONTRACT_ABI, IDENTITYNFT_CONTRACT_ADDRESS } from '../app/constants';

export async function hasIdentityNFT(address: string): Promise<boolean> {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(IDENTITYNFT_CONTRACT_ADDRESS.toString(), IDENTITYNFT_CONTRACT_ABI, provider);
    try {
      const balance = await contract.balanceOf(address);
      return balance > 0;
    } catch (error) {
      console.error('Error checking IdentityNFT balance:', error);
      return false;
    }
  }
  return false;
}
