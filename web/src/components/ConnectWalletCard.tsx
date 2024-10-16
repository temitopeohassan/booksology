'use client';
import React from 'react';
import { 
    ConnectWallet, 
  } from '@coinbase/onchainkit/wallet';

  export default function ConnectWalletCard() {
    
    return (
      <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
     <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
      <ConnectWallet className='bg-blue-800 text-white'>
          </ConnectWallet>
     </div>
    </div>
      </>
    );
  }
  