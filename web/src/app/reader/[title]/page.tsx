"use client"
import Link from "next/link"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Settings, Bookmark, Sun, Moon, Type, X } from 'lucide-react';

type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

interface BookContent {
  title: string;
  author: string;
  content: string;
}

export default function Reader() {
  const params = useParams();
  const bookTitle = params.title as string;

  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [theme, setTheme] = useState('light');
  const [showSettings, setShowSettings] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookContent, setBookContent] = useState<BookContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookContent = async () => {
      try {
        // Encode the book title for the URL
        const encodedTitle = encodeURIComponent(bookTitle);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reader/${encodedTitle}`);
        if (!response.ok) {
          throw new Error('Failed to fetch book content');
        }
        const data = await response.json();
        setBookContent(data);
      } catch (error) {
        console.error('Error fetching book content:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bookTitle) {
      fetchBookContent();
    }
  }, [bookTitle]);

  const fontSizes: Record<FontSize, string> = {
    small: '12px',
    medium: '16px',
    large: '20px',
    xlarge: '24px',
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!bookContent) {
    return <div>Error loading book content</div>;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full p-4 flex justify-between items-center bg-opacity-90 backdrop-blur-sm z-10">
        <Link href="/userlibrary" legacyBehavior passHref>
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
        {/* ... (settings panel content remains the same) ... */}
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
