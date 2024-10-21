"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { BookOpen, Share2, Heart } from 'lucide-react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { EBOOKNFT_CONTRACT_ADDRESS, EBOOKNFT_CONTRACT_ABI } from '../../constants';
import { parseEther } from 'viem';


interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  price: number;
  description: string;
  preview: string;
  created_at: string;
  encrypted_content: string;
  featured_books: boolean;
  tokenID: string;
  book_for_sale: boolean;
  categories_id: number;
}

export default function BookDetails() {
  const params = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [status, setStatus] = useState('');
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, error: purchaseError, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isPurchased } = useWaitForTransactionReceipt({
    hash,
  });

  const bookId = parseInt(Array.isArray(params.id) ? params.id[0] : params.id, 10);

  const { data: metadata } = useReadContract({
    address: EBOOKNFT_CONTRACT_ADDRESS,
    abi: EBOOKNFT_CONTRACT_ABI,
    functionName: 'getEBookMetadata',
    args: bookId ? [bookId] : undefined,
  });

  const [blockchainData, setBlockchainData] = useState<{
    supply: number;
    blockchainPrice: number;
    remainingSupply: number;
  } | null>(null);

  useEffect(() => {
    if (metadata && Array.isArray(metadata)) {
      setBlockchainData({
        supply: Number(metadata[2]),
        blockchainPrice: Number(metadata[3]) / 1e18, // Convert wei to ETH
        remainingSupply: Number(metadata[2]) // Assuming initial supply is the remaining supply
      });
    }
  }, [metadata]);

    // Ensure params.id is a string
    console.log('bookId:', bookId); // Log bookId

    useEffect(() => {
      const fetchBookData = async () => {
        if (!bookId) {
          setError('Invalid book ID');
          setLoading(false);
          console.log('No valid bookId'); // Log if bookId is invalid
          return;
        }

        try {
          setLoading(true);
          console.log('Fetching book data from API...');
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}`);
          console.log('API response status:', response.status); // Log response status
          
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Book not found');
            }
            throw new Error('Failed to fetch book details');
          }

          const bookData: Book = await response.json();
          console.log('Fetched book data:', bookData); // Log fetched book data
          setBook(bookData);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unexpected error occurred');
          console.error('Error fetching book:', err);
        } finally {
          setLoading(false);
          console.log('Loading state set to false'); // Log when loading is finished
        }
      };

      fetchBookData();
    }, [bookId]);

    const handlePurchase = async () => {
      if (!book || isNaN(bookId) || !blockchainData) return;

      if (blockchainData.remainingSupply <= 0) {
        setStatus('Error: No more copies available for purchase.');
        return;
      }

      try {
        setStatus('Initiating purchase...');

        const result = await writeContract({
          address: EBOOKNFT_CONTRACT_ADDRESS,
          abi: EBOOKNFT_CONTRACT_ABI,
          functionName: 'buyEBook',
          args: [BigInt(book.tokenID)],
          value: parseEther(blockchainData.blockchainPrice.toString()),
        });

        setStatus('Purchase transaction sent. Waiting for confirmation...');
      } catch (error) {
        console.error('Error purchasing book:', error);
        if (error instanceof Error && error.message.includes('No more copies available')) {
          setStatus('Error: No more copies available for purchase.');
        } else {
          setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
        }
      }
    };


    useEffect(() => {
        if (isPurchased) {
            setStatus('Purchase confirmed! You now own this eBook.');
        }
    }, [isPurchased]);

    if (loading) {
      console.log('Page is in loading state'); // Log loading state
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-lg text-gray-600">Loading book details...</div>
          </div>
        </div>
      );
    }

    if (error || !book) {
      console.log('Error or book data unavailable:', error); // Log error or missing book
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-lg text-red-500">{error || 'Book information unavailable'}</div>
          </div>
        </div>
      );
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    console.log('Rendering book details:', book); // Log when rendering book details
  


    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Book Cover */}
          <div className="relative">
            <Image 
              src={book.cover.startsWith('http') ? book.cover : `/images/${book.cover}`}
              alt={book.title}
              width={400}
              height={600}
              className="w-full rounded-lg shadow-lg object-cover"
              priority
            />
            {book.featured_books && (
              <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                Featured
              </div>
            )}
          </div>

          {/* Book Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            
            <div className="mb-6">
              <span className="text-2xl font-bold">{book.price} ETH</span>
            </div>
            
            <div className="space-y-4 mb-6">
                {isConnected && (
                    <button 
                        onClick={handlePurchase}
                        disabled={isPending || isConfirming}
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition duration-200"
                    >
                        {isPending || isConfirming ? 'Processing...' : 'Purchase Book'}
                    </button>
                )}
                {!isConnected && (
                    <p className="text-sm text-gray-600">Please connect your wallet to purchase this book.</p>
                )}
                {status && <p className="text-sm text-gray-600">{status}</p>}
                {purchaseError && (
                    <p className="text-sm text-red-500">
                        Error: {purchaseError.message}
                    </p>
                )}
              <button 
                className="w-full border border-blue-500 text-blue-500 py-3 rounded-lg hover:bg-blue-50 flex items-center justify-center transition duration-200"
                onClick={() => setPreviewOpen(!previewOpen)}
              >
                <BookOpen className="mr-2" /> 
                {previewOpen ? 'Hide Preview' : 'Preview Book'}
              </button>
            </div>
            
            <div className="flex space-x-4 mb-6">
              <button className="flex items-center text-gray-600 hover:text-blue-500 transition duration-200">
                <Share2 className="mr-1" /> Share
              </button>
              <button className="flex items-center text-gray-600 hover:text-red-500 transition duration-200">
                <Heart className="mr-1" /> Add to Wishlist
              </button>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">About this book</h2>
              <p className="text-gray-600 leading-relaxed">{book.description}</p>
            </div>

            <div className="space-y-2 text-sm text-gray-500">
              <p>Token ID: {book.tokenID}</p>
              <p>Category ID: {book.categories_id}</p>
              <p>Added on: {formatDate(book.created_at)}</p>
            </div>
          </div>
        </div>
      
        {/* Preview Section */}
        {previewOpen && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Book Preview</h2>
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <p className="text-gray-700 leading-relaxed">{book.preview}</p>
            </div>
          </div>
        )}
      </div>
    );
}
