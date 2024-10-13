"use client"
import Link from "next/link"
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Settings, Bookmark, Sun, Moon, Type, X } from 'lucide-react';

type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

interface BookContent {
  title: string;
  author: string;
  content: string;
}

export default function Reader() {
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [theme, setTheme] = useState('light');
  const [showSettings, setShowSettings] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookContent, setBookContent] = useState<BookContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookContent = async () => {
      try {
        // Replace '1' with the actual bookId, which you might get from URL params or props
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reader/1`);
        const data = await response.json();
        setBookContent(data);
      } catch (error) {
        console.error('Error fetching book content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookContent();
  }, []);

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
        <Link href="/userlibrary" legacyBehavior passHref><button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <ChevronLeft className="w-6 h-6" />
        </button></Link>
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Settings</h2>
            <button onClick={() => setShowSettings(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Font Size</h3>
              <div className="flex items-center space-x-2">
                <Type className="w-4 h-4" />
                <input 
                  type="range" 
                  min="0" 
                  max="3" 
                  value={Object.keys(fontSizes).indexOf(fontSize)}
                  onChange={(e) => setFontSize(Object.keys(fontSizes)[Number(e.target.value)] as FontSize)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Theme</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setTheme('light')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <Sun className="w-4 h-4" />
                  <span>Light</span>
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <Moon className="w-4 h-4" />
                  <span>Dark</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-16 pb-16 px-4 md:px-8 lg:px-16 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">{bookContent.title}</h1>
        <h2 className="text-xl mb-4">{bookContent.author}</h2>
        <div style={{ fontSize: fontSizes[fontSize as FontSize] }}>
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
