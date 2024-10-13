'use client'

import React, { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { IDENTITYNFT_CONTRACT_ABI, IDENTITYNFT_CONTRACT_ADDRESS } from '../constants';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';

export default function MintIdentityNFT() {
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mintNFT = async () => {
    setMinting(true);
    setError(null);
    setSuccess(null);

    try {
      await writeContract({
        address: IDENTITYNFT_CONTRACT_ADDRESS,
        abi: IDENTITYNFT_CONTRACT_ABI,
        functionName: 'mintIdentityNFT',
      });
      setSuccess('Minting transaction submitted. Please wait for confirmation.');
    } catch (err: any) {
      setError(err.message || 'An error occurred while minting the NFT');
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Mint Your Bookshop Pass</h1>
        <ConnectWallet />
        <button
          onClick={mintNFT}
          disabled={minting || isPending}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {minting || isPending ? 'Minting...' : 'Mint NFT'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>
    </div>
  );
}
