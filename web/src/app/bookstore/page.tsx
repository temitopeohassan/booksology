"use client"
import { Search } from "lucide-react";
import Link from "next/link"
import { useEffect, useState } from 'react';

interface BookProps {
  title: string;
  author: string;
  price: number;
  cover: string;
}

const BookCard = ({ title, author, price, cover }: BookProps) => (
  <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
    <div className="aspect-[2/3] bg-gray-200">
      <img src={cover} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm">{author}</p>
      <div className="mt-2 flex justify-between items-center">
        <span className="font-bold">{price} ETH</span>
        <Link 
          href="/bookdetails" 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm inline-block"
        >
          Purchase
        </Link>
      </div>
    </div>
  </div>
);

export default function Marketplace() {
  const [categories, setCategories] = useState<string[]>([]);
  const [books, setBooks] = useState<BookProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState('latest');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('`${process.env.NEXT_PUBLIC_API_URL}/marketplace/categories`');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          ...(searchTerm && { search: searchTerm }),
          ...(minPrice && { minPrice }),
          ...(maxPrice && { maxPrice }),
          ...(sort !== 'latest' && { sort })
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/books?${queryParams}`);
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [searchTerm, minPrice, maxPrice, sort]);

  const handleCategoryToggle = (category: string) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setSelectedCategories(newCategories);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Marketplace</h1>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/4">
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-4">Filters</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="w-1/2 p-2 border rounded"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="w-1/2 p-2 border rounded"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Categories</label>
                {categories.map((category) => (
                  <div key={category} className="flex items-center mb-2">
                    <input 
                      type="checkbox" 
                      id={category} 
                      className="mr-2"
                      checked={selectedCategories.has(category)}
                      onChange={() => handleCategoryToggle(category)}
                    />
                    <label htmlFor={category}>{category}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
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
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select 
                className="border rounded-lg p-2"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="latest">Latest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book, index) => (
                <BookCard key={index} {...book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}