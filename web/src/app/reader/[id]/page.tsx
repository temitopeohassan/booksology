"use client"
import Link from "next/link"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Settings, Bookmark } from 'lucide-react';

type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

interface BookContent {
  title: string;
  author: string;
  content: string;
}

export default function Reader() {
  console.log('Reader component rendered');
  const params = useParams();
  const bookId = params.id as string;
  console.log('Book ID from params:', bookId);

  const [fontSize ] = useState<FontSize>('medium');
  const [theme ] = useState('light');
  const [showSettings, setShowSettings] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookContent, setBookContent] = useState<BookContent | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log('useEffect triggered');
    const fetchBookContent = async () => {
      console.log('Fetching book content for ID:', bookId);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/reader/${bookId}`;
        console.log('Fetching from URL:', url);
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        // Log the raw response
        const rawResponse = await response.text();
        console.log('Raw response:', rawResponse);

        if (!response.ok) {
          throw new Error(`Failed to fetch book content: ${response.status} ${response.statusText}`);
        }
        
        // Parse the response as JSON
        const data = JSON.parse(rawResponse);
        console.log('Parsed data:', data);
        setBookContent(data);
      } catch (error) {
        console.error('Error fetching book content:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookContent();
    } else {
      console.log('No book ID available, skipping fetch');
    }
  }, [bookId]);

  const fontSizes: Record<FontSize, string> = {
    small: '12px',
    medium: '16px',
    large: '20px',
    xlarge: '24px',
  };

  console.log('Current state - loading:', loading, 'bookContent:', bookContent);

  if (loading) {
    console.log('Rendering loading state');
    return <div>Loading...</div>;
  }

  if (!bookContent || Object.keys(bookContent).length === 0) {
    console.log('Book content is empty');
    return <div>Error: No book content available</div>;
  }

  console.log('Rendering book content');
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full p-4 flex justify-between items-center bg-opacity-90 backdrop-blur-sm z-10">
        <Link href={`/userlibrary`} legacyBehavior passHref>
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </Link>
        <div className="flex space-x-4">
          <button 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`fixed right-0 top-0 h-full w-64 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 shadow-lg z-20`}>
          {/* Settings panel content remains the same */}
        </div>
      )}

      {/* Main Content */}
      <main className="pt-16 pb-16 px-4 md:px-8 lg:px-16 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">{bookContent.title}</h1>
        <h2 className="text-xl mb-4">{bookContent.author}</h2>
        <div style={{ fontSize: fontSizes[fontSize] }}>
          {bookContent.content}
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full p-4 flex justify-between items-center bg-opacity-90 backdrop-blur-sm">
        <span className="text-sm">Page {currentPage}</span>
        <div className="flex space-x-4">
          <button 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </div>
  );
}
