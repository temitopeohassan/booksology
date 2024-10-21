"use client"
import { BookOpen, Clock, BookMarked } from 'lucide-react';
import Link from "next/link"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface OwnedBook {
  id: number;
  title: string;
  author: string;
  cover: string;
  progress: number;
}

interface RecentlyReadBook {
  title: string;
  date: string;
  timeSpent: string;
}

interface ReadingStats {
  booksRead: number;
  totalReadingTime: string;
  avgDailyReading: string;
}

const BookCard = ({ id, title, author, cover, progress }: OwnedBook) => (
  <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
    <div className="aspect-[2/3] relative">
      <Image 
        src={`/images/${cover}`}
        alt={title}
        layout="fill"
        objectFit="cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
        <div className="flex justify-between items-center">
          <span>{progress}% complete</span>
          <button className="bg-blue-500 px-3 py-1 rounded text-sm">
            <Link href={`/reader/${id}`}>Read</Link>
          </button>
        </div>
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm">{author}</p>
    </div>
  </div>
);

export default function UserLibrary() {
  const params = useParams();
  const userId = params.id as string;

  const [ownedBooks, setOwnedBooks] = useState<OwnedBook[]>([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded values for recentlyRead
  const recentlyRead: RecentlyReadBook[] = [
    { title: 'The Great Gatsby', date: '2024-10-15', timeSpent: '2h 30m' },
    { title: '1984', date: '2024-10-12', timeSpent: '1h 45m' },
    { title: 'To Kill a Mockingbird', date: '2024-10-10', timeSpent: '3h 15m' },
  ];

  // Hardcoded values for readingStats
  const readingStats: ReadingStats = {
    booksRead: 15,
    totalReadingTime: '52h 30m',
    avgDailyReading: '1h 45m',
  };

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/owned-books/${params.id}`);
        const ownedBooksData = await response.json();
        console.log('Fetched owned books:', ownedBooksData);  // Add this line
        setOwnedBooks(ownedBooksData);
      } catch (error) {
        console.error('Error fetching library data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchLibraryData();
    }
  }, [userId]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Library</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ownedBooks.map((book) => (
          <BookCard key={book.id} {...book} />
        ))}
      </div>

      <div className="lg:col-span-2">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Clock className="mr-2" /> Reading Activity
        </h2>
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Recently Read</h3>
          <div className="space-y-4">
            {recentlyRead.map((item, index) => (
              <div key={index} className="flex items-start">
                <BookOpen className="mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.date} • {item.timeSpent}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-4 mt-6">
          <h3 className="font-semibold mb-2">Reading Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Books Read</span>
              <span className="font-semibold">{readingStats.booksRead}</span>
            </div>
            <div className="flex justify-between">
              <span>Reading Time</span>
              <span className="font-semibold">{readingStats.totalReadingTime}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg. Daily Reading</span>
              <span className="font-semibold">{readingStats.avgDailyReading}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
