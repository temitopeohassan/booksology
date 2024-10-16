"use client"
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
}

interface BookProps {
  title: string;
  author: string;
  price: number;
  cover: string;
}

export default function Bookstore() {
  const [categories, setCategories] = useState<Category[]>([]);
const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState('latest');

  // Fetch categories from the API
  const fetchCategories = async () => {
    console.log('Fetching categories...');
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}marketplace/categories`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log('Categories fetched:', data);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch books from the API
  const fetchBooks = async () => {
    console.log('Fetching books...');
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(sort !== 'latest' && { sort })
      });

      const url = `${process.env.NEXT_PUBLIC_API_URL}marketplace/books?${queryParams}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log('Books fetched:', data);
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories and books on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, minPrice, maxPrice, sort]);

  // Handle toggling categories
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
  {categories.map((category) => (
    <div key={category.id} className="flex items-center mb-2">
      <input 
        type="checkbox" 
        id={category.name} 
        className="mr-2"
        checked={selectedCategories.has(category.name)}
        onChange={() => handleCategoryToggle(category.name)}
      />
      <label htmlFor={category.name}>{category.name}</label> {/* Use the 'name' property */}
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
            <div>
  {books.map((book) => (
    <div key={book.id} className="book-item">
      <h3>{book.title}</h3> {/* Use the 'title' property */}
      <p>by {book.author}</p> {/* Use the 'author' property */}
    </div>
  ))}
</div>

          )}
        </div>
      </div>
    </div>
  );
}
