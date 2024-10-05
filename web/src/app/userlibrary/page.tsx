import { BookOpen, Clock, BookMarked } from 'lucide-react';
import Link from "next/link"

const BookCard = ({ title, author, cover, progress }: {
  title: string;
  author: string;
  cover: string;
  progress: number;
}) => (
  <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
    <div className="aspect-[2/3] relative">
      <img src={cover} alt={title} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
        <div className="flex justify-between items-center">
          <span>{progress}% complete</span>
          <button className="bg-blue-500 px-3 py-1 rounded text-sm"><Link href="/reader" legacyBehavior passHref>Read</Link></button>
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
  const ownedBooks = [
    { title: "Web3 Basics", author: "John Doe", cover: "/api/placeholder/200/300", progress: 75 },
    { title: "DeFi Handbook", author: "Jane Smith", cover: "/api/placeholder/200/300", progress: 30 },
    { title: "Crypto Trading", author: "Mike Johnson", cover: "/api/placeholder/200/300", progress: 100 },
    { title: "Blockchain Architecture", author: "Sarah Lee", cover: "/api/placeholder/200/300", progress: 50 },
  ];

  const recentlyRead = [
    { title: "Smart Contracts 101", date: "2024-03-15", timeSpent: "45 minutes" },
    { title: "NFT Creation Guide", date: "2024-03-14", timeSpent: "1 hour" },
    { title: "Tokenomics Explained", date: "2024-03-12", timeSpent: "30 minutes" },
  ];

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
          
          <div className="border rounded-lg p-4 mt-6">
            <h3 className="font-semibold mb-2">Reading Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Books Read</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span>Reading Time</span>
                <span className="font-semibold">48 hours</span>
              </div>
              <div className="flex justify-between">
                <span>Avg. Daily Reading</span>
                <span className="font-semibold">45 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}