import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { EBOOKNFT_CONTRACT_ADDRESS, EBOOKNFT_CONTRACT_ABI } from '../app/constants';

export default function BookMintForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [cover, setCover] = useState('');
  const [bookId, setBookId] = useState('');

  const { writeContract, data: mintData } = useWriteContract();
  const { isLoading: isMinting, isSuccess: isMinted } = useWaitForTransactionReceipt({
    hash: mintData,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await writeContract({
        abi: EBOOKNFT_CONTRACT_ABI,
        address: EBOOKNFT_CONTRACT_ADDRESS,
        functionName: 'mintEBook',
        args: [title, author, cover, bookId],
      });
    } catch (error) {
      console.error('Error minting book:', error);
    }
  };

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
        <label htmlFor="cover" className="block mb-2">Cover URL</label>
        <input
          type="url"
          id="cover"
          value={cover}
          onChange={(e) => setCover(e.target.value)}
          className="w-full p-2 border rounded"
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
      {isMinted && (
        <p className="text-green-600">Book minted successfully!</p>
      )}
    </form>
  );
}
