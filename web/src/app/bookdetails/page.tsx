"use client"
import { useState } from 'react';
import { Star, BookOpen, Share2, Heart } from 'lucide-react';

export default function BookDetails() {
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const bookData = {
    title: "The Blockchain Revolution",
    author: "Sarah Johnson",
    cover: "/api/placeholder/400/600",
    price: 0.05,
    rating: 4.5,
    reviews: 128,
    description: "A comprehensive exploration of blockchain technology and its potential to transform various industries. From cryptocurrencies to smart contracts, this book covers the fundamentals and advanced concepts of the blockchain revolution.",
    preview: "Chapter 1: The Genesis of Blockchain\n\nIn the aftermath of the 2008 financial crisis, an anonymous figure known as Satoshi Nakamoto introduced Bitcoin, a peer-to-peer electronic cash system that would change the world forever..."
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={bookData.cover} alt={bookData.title} className="w-full rounded-lg shadow-lg" />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-2">{bookData.title}</h1>
          <p className="text-xl text-gray-600 mb-4">by {bookData.author}</p>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(bookData.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-gray-600">({bookData.reviews} reviews)</span>
          </div>
          
          <div className="mb-6">
            <span className="text-2xl font-bold">{bookData.price} ETH</span>
          </div>
          
          <div className="space-y-4 mb-6">
            <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
              Purchase Book
            </button>
            <button 
              className="w-full border border-blue-500 text-blue-500 py-3 rounded-lg hover:bg-blue-50 flex items-center justify-center"
              onClick={() => setPreviewOpen(!previewOpen)}
            >
              <BookOpen className="mr-2" /> Preview Book
            </button>
          </div>
          
          <div className="flex space-x-4 mb-6">
            <button className="flex items-center text-gray-600 hover:text-blue-500">
              <Share2 className="mr-1" /> Share
            </button>
            <button className="flex items-center text-gray-600 hover:text-red-500">
              <Heart className="mr-1" /> Add to Wishlist
            </button>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">About this book</h2>
            <p className="text-gray-600">{bookData.description}</p>
          </div>
        </div>
      </div>
      
      {previewOpen && (
        <div className="mt-8 border rounded-lg p-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Book Preview</h2>
          <p className="whitespace-pre-line">{bookData.preview}</p>
        </div>
      )}
    </div>
  );
}