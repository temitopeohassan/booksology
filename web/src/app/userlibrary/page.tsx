"use client"
import { BookOpen, Clock, BookMarked } from 'lucide-react';
import Link from "next/link"
import { useEffect, useState } from 'react';

interface OwnedBook {
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

const BookCard = ({ title, author, cover, progress }: OwnedBook) => (
  <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
    <div className="aspect-[2/3] relative">
      <img src={cover} alt={title} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
        <div className="flex justify-between items-center">
          <span>{progress}% complete</span>
          <button className="bg-blue-500 px-3 py-1 rounded text-sm">
            <Link href="/reader">Read</Link>
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
  const [ownedBooks, setOwnedBooks] = useState<OwnedBook[]>([]);
  const [recentlyRead, setRecentlyRead] = useState<RecentlyReadBook[]>([]);
  const [readingStats, setReadingStats] = useState<ReadingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        const [ownedBooksRes, recentlyReadRes, readingStatsRes] = await Promise.all([
          fetch('`${process.env.API_URL}/api/library/owned-books`'),
          fetch('`${process.env.API_URL}/api/library/recently-read`'),
          fetch('`${process.env.API_URL}/api/library/reading-stats`')
        ]);

        const ownedBooksData = await ownedBooksRes.json();
        const recentlyReadData = await recentlyReadRes.json();
        const readingStatsData = await readingStatsRes.json();

        setOwnedBooks(ownedBooksData);
        setRecentlyRead(recentlyReadData);
        setReadingStats(readingStatsData);
      } catch (error) {
        console.error('Error fetching library data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Library</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <BookMarked className="mr-2" /> My Books
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedBooks.map((book, index) => (
              <BookCard key={index} {...book} />
            ))}
          </div>
        </div>
        
        <div>
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
          
          {readingStats && (
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
          )}
        </div>
      </div>
    </div>
  );
}