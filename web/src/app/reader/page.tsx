"use client"
import Link from "next/link"

type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Settings, Bookmark, Sun, Moon, Type, X } from 'lucide-react';

export default function Reader() {
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [theme, setTheme] = useState('light');
  const [showSettings, setShowSettings] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  
  const bookContent = `
    Chapter 1: The Genesis of Blockchain
    In the beginning, there was Bitcoin. Created in the wake of the 2008 financial crisis, 
    this revolutionary technology introduced the world to the concept of a decentralized, 
    peer-to-peer electronic cash system. But what started as a solution for digital 
    currency would soon evolve into something much greater.
    Blockchain, the underlying technology of Bitcoin, represented a paradigm shift in how we 
    think about trust, transparency, and decentralization. Its potential applications extend 
    far beyond cryptocurrency, touching every industry from finance to healthcare, from supply 
    chain management to digital identity verification.
  `;

  const fontSizes: Record<FontSize, string> = {
    small: '12px',
    medium: '16px',
    large: '20px',
    xlarge: '24px',
  };

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
        <div style={{ fontSize: fontSizes[fontSize as FontSize] }}>
          {bookContent}
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