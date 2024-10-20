declare global {
  interface Window {
    ethereum?: any;
  }
}

import { ethers } from 'ethers';
import { BOOKSHOPPASSNFT_CONTRACT_ADDRESS, BOOKSHOPPASSNFT_CONTRACT_ABI } from '../app/constants';

export async function hasBookshopPassNFT(address: string): Promise<boolean> {
  console.log('Checking BookshopPassNFT for address:', address);
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(BOOKSHOPPASSNFT_CONTRACT_ADDRESS, BOOKSHOPPASSNFT_CONTRACT_ABI, provider);
    try {
      const balance = await contract.balanceOf(address);
      const hasNFT = balance > 0;
      console.log('NFT balance:', balance.toString(), 'Has NFT:', hasNFT);
      return hasNFT;
    } catch (error) {
      console.error('Error checking BookshopPassNFT:', error);
      return false;
    }
  }
  console.log('window.ethereum is undefined');
  return false;
}
