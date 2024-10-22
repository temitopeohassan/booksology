"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAccessControl } from '../../contexts/AccessControlContext';
import AccessControlWrapper from '../../components/AccessControlWrapper';

interface BookForSale {
  listing_id: number;
  book_id: number;
  title: string;
  author: string;
  cover: string;
  price: number;
  seller: string;
}

export default function BooksForSale() {
  const [booksForSale, setBooksForSale] = useState<BookForSale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooksForSale = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/books-for-sale`);
        const data = await response.json();
        setBooksForSale(data);
      } catch (error) {
        console.error('Error fetching books for sale:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksForSale();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AccessControlWrapper>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Books For Sale</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {booksForSale.map((book) => (
          <div key={book.listing_id} className="border rounded-lg overflow-hidden">
            <Image
              src={book.cover}
              alt={book.title}
              width={200}
              height={300}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="font-bold">{book.title}</h2>
              <p className="text-gray-600">{book.author}</p>
              <p className="mt-2">${book.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Seller: {book.seller}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </AccessControlWrapper>
  );
}

