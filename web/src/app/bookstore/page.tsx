"use client";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from 'react';

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  price: number;
}

export default function Bookstore() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;

  // Fetch books from the /books API
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/books`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setBooks(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch books on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  // Pagination handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get the current books to display
  const paginatedBooks = books.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Marketplace</h1>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search books..."
                className="w-full p-2 pl-10 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {paginatedBooks.map((book) => (
                  <div key={book.id} className="border p-4 rounded-lg">
                    <img
  src={book.cover ? `/images/${book.cover}` : '/images/default-cover.jpg'}
  alt={book.title}
  className="w-full h-48 object-cover rounded"
/>

                    <h3 className="mt-4 text-lg font-semibold">{book.title}</h3>
                    <p className="text-gray-600">by {book.author}</p>
                    <p className="text-blue-500 mt-2">{book.price} ETH</p>
                    <Link href={`/bookdetails/${book.id}`}>
                      <button className="mt-4 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
                        View Details
                      </button>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      className={`mx-1 px-3 py-1 border ${
                        index + 1 === currentPage ? 'bg-blue-500 text-white' : 'bg-white'
                      }`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
