import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { EBOOKNFT_CONTRACT_ADDRESS, EBOOKNFT_CONTRACT_ABI } from '../app/constants';

export default function BookMintForm() {
  const [title, setTitle] = useState('');
  const [uri, setUri] = useState('');
  const [supply, setSupply] = useState('');
  const [price, setPrice] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [status, setStatus] = useState('');

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isMinted } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted', { title, uri, supply, price, tokenId });
    setStatus('Initiating transaction...');

    try {
      const result = await writeContract({
        address: EBOOKNFT_CONTRACT_ADDRESS,
        abi: EBOOKNFT_CONTRACT_ABI,
        functionName: 'mintEBook',
        args: [title, uri, BigInt(supply), BigInt(price), BigInt(tokenId)],
      });
      console.log('Transaction initiated:', result);
      setStatus('Transaction sent. Waiting for confirmation...');
    } catch (error) {
      console.error('Error minting book:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  useEffect(() => {
    if (isMinted) {
      setStatus('Transaction confirmed! eBook minted successfully.');
      console.log('Transaction confirmed:', hash);
    }
  }, [isMinted, hash]);

  if (!isConnected) {
    return <div>Please connect your wallet to mint a book.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="uri" className="block mb-2">Metadata URI</label>
        <input
          type="text"
          id="uri"
          value={uri}
          onChange={(e) => setUri(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="ipfs://..."
          required
        />
      </div>
      <div>
        <label htmlFor="supply" className="block mb-2">Supply</label>
        <input
          type="number"
          id="supply"
          value={supply}
          onChange={(e) => setSupply(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="price" className="block mb-2">Price (in wei)</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="tokenId" className="block mb-2">Token ID</label>
        <input
          type="number"
          id="tokenId"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isPending || isConfirming}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isPending || isConfirming ? 'Minting...' : 'Mint eBook'}
      </button>
      {status && <p className="mt-4 text-sm">{status}</p>}
      {error && <p className="mt-4 text-sm text-red-500">Error: {error.message}</p>}
    </form>
  );
}