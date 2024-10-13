"use client";
import { useState, useCallback, useEffect } from 'react';
import { useAccount, useTransaction } from 'wagmi';
import { useWriteContract, useSimulateContract } from 'wagmi';
import { EBOOKNFT_CONTRACT_ADDRESS, EBOOKNFT_CONTRACT_ABI } from '../app/constants';

export default function BookMintForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverIpfs, setCoverIpfs] = useState('');
  const [bookId, setBookId] = useState('');
  const [status, setStatus] = useState('');

  const { isConnected } = useAccount();
  const { writeContract, data: hash } = useWriteContract();
  const { data: simulateData, error: simulateError } = useSimulateContract({
    address: EBOOKNFT_CONTRACT_ADDRESS,
    abi: EBOOKNFT_CONTRACT_ABI,
    functionName: 'mintEBook',
    args: [title, author, coverIpfs, bookId],
  });

  const { isLoading: isMinting, isSuccess: isMinted } = useTransaction({ hash });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted', { title, author, coverIpfs, bookId });
    setStatus('Initiating transaction...');

    try {
      if (!simulateData || !simulateData.request) {
        console.error('Simulation data is not available');
        setStatus('Error: Unable to prepare transaction. Please try again.');
        return;
      }

      const result = await writeContract(simulateData.request);
      console.log('Transaction initiated:', result);
      setStatus('Transaction sent. Waiting for confirmation...');
    } catch (error: unknown) {
      console.error('Error minting book:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  useEffect(() => {
    if (isMinted) {
      setStatus('Transaction confirmed!');
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
        <label htmlFor="author" className="block mb-2">Author</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="coverIpfs" className="block mb-2">Cover IPFS Location</label>
        <input
          type="text"
          id="coverIpfs"
          value={coverIpfs}
          onChange={(e) => setCoverIpfs(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="ipfs://..."
          required
        />
      </div>
      <div>
        <label htmlFor="bookId" className="block mb-2">Book ID</label>
        <input
          type="text"
          id="bookId"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isMinting}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isMinting ? 'Minting...' : 'Mint Book'}
      </button>
      {status && <p className="mt-4 text-sm">{status}</p>}
      {isMinted && (
        <p className="mt-4 text-green-600">Book minted successfully!</p>
      )}
    </form>
  );
}
