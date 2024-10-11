'use client'

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { IDENTITYNFT_CONTRACT_ABI, IDENTITYNFT_CONTRACT_ADDRESS } from '../constants';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function MintIdentityNFT() {
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const mintNFT = async () => {
    setMinting(true);
    setError(null);
    setSuccess(null);

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to use this feature');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(IDENTITYNFT_CONTRACT_ADDRESS.toString(), IDENTITYNFT_CONTRACT_ABI, signer);

      const transaction = await contract.mintIdentityNFT();
      await transaction.wait();

      setSuccess('IdentityNFT minted successfully!');
    } catch (err: any) {
      setError(err.message || 'An error occurred while minting the NFT');
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Mint Your IdentityNFT</h1>
        <button
          onClick={mintNFT}
          disabled={minting}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {minting ? 'Minting...' : 'Mint NFT'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>
    </div>
  );
}
