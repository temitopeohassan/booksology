'use client'

import React, { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId } from 'wagmi';
import { BOOKSHOPPASSNFT_CONTRACT_ABI, BOOKSHOPPASSNFT_CONTRACT_ADDRESS } from '../constants';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useRouter } from 'next/navigation';

export default function MintBookshopPassNFT() {
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const router = useRouter();

  console.log('Component rendered. isConnected:', isConnected, 'address:', address, 'chainId:', chainId);

  useEffect(() => {
    console.log('Transaction status:', { isPending, isConfirming, isSuccess, hash });
  }, [isPending, isConfirming, isSuccess, hash]);

  useEffect(() => {
    if (isSuccess) {
      console.log('Minting successful, redirecting to home page');
      router.push('/');
    }
  }, [isSuccess, router]);

  const mintNFT = async () => {
    console.log('Mint NFT function called');
    setMinting(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('Contract Address:', BOOKSHOPPASSNFT_CONTRACT_ADDRESS);
      console.log('ABI:', BOOKSHOPPASSNFT_CONTRACT_ABI);
      console.log('Chain ID:', chainId);

      if (!BOOKSHOPPASSNFT_CONTRACT_ADDRESS) {
        throw new Error('Contract address is not defined');
      }

      console.log('Attempting to write contract');
      const result = await writeContract({
        address:  BOOKSHOPPASSNFT_CONTRACT_ADDRESS,
          abi: BOOKSHOPPASSNFT_CONTRACT_ABI,
        functionName: 'mintBookshopPass',
        args: [],
      });
      console.log('Write contract call result:', result);
      setSuccess('Minting transaction submitted. Please wait for confirmation.');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error minting NFT:', error.message);
        setError(`Error: ${error.message}`);
      } else {
        console.error('Unknown error occurred while minting NFT');
        setError('An unknown error occurred');
      }
      // Log the full error object for debugging
      console.error('Full error object:', error);
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
