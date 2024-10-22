"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AccessControlWrapper from '../../components/AccessControlWrapper';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  price: number;
  description: string;
  preview: string;
  created_at: string;
  encrypted_content: string;
  featured_books: number;
  tokenID: string;
  book_for_sale: boolean;
  categories_id: number;
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface FeaturedBookProps extends Book {
  hasBookshopPass: boolean;
}

const FeaturedBook: React.FC<FeaturedBookProps> = ({ id, title, author, cover }) => {
  const imagePath = cover ? `/images/${cover}` : '/images/default-cover.jpg';

  return (
    <div className="relative group">
      <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
        <Image
          src={imagePath}
          alt={title || 'Book cover'}
          width={200}
          height={300}
          objectFit="cover"
        />
      </div>
      <div className="mt-2">
        <h3 className="text-lg font-semibold">{title || 'Unknown Title'}</h3>
        <p className="text-gray-600">{author || 'Unknown Author'}</p>
        <Link href={`/bookdetails/${id}`}>
          <button className="mt-2 inline-block bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
            Details
          </button>
        </Link>
      </div>
    </div>
  );
};

interface CategoryCardProps {
  name: string;
  icon: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, icon }) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="w-6 h-6">{icon}</div>
      <h3 className="text-lg font-semibold">{name}</h3>
    </div>
  );
};

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState<FeaturedBookProps[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newReleases, setNewReleases] = useState<FeaturedBookProps[]>([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          `${process.env.NEXT_PUBLIC_API_URL}/books`,
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          `${process.env.NEXT_PUBLIC_API_URL}/new-releases`
        ];
  
        console.log('API Endpoints:', endpoints);
  
        const responses = await Promise.all(
          endpoints.map(url => {
            console.log(`Fetching from ${url}...`); // Log before fetching
            return fetch(url)
              .then(res => {
                if (!res.ok) {
                  console.error(`Failed to fetch ${url}: HTTP error! status: ${res.status}`);
                  throw new Error(`HTTP error! status: ${res.status}`);
                }
                console.log(`Successfully fetched from ${url}`); // Log success
                return res.json();
              })
              .catch((fetchError) => {
                console.error(`Error fetching from ${url}:`, fetchError); // Log fetch error
                throw fetchError; // Re-throw the error to be caught in the outer try-catch
              });
          })
        );
  
        const [booksData, categoriesData, newReleasesData] = responses;
  
        console.log('Fetched Books:', booksData);        // Log fetched books
        console.log('Fetched Categories:', categoriesData); // Log fetched categories
        console.log('Fetched New Releases:', newReleasesData); // Log new releases
  
        setFeaturedBooks(
          booksData.filter((book: Book) => {
            console.log("Book in filter:", book); // Log each book before filtering
            return book.featured_books === 1;
          })
        );
        setCategories(categoriesData);
        setNewReleases(newReleasesData);
      } catch (error) {
        console.error('Error fetching data:', error); // Log any error in the fetchData process
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  // Log the state after loading is complete
  console.log('Featured Books:', featuredBooks);
  console.log('Categories:', categories);
  console.log('New Releases:', newReleases);

  return (
    <AccessControlWrapper>
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome To Booksology</h1>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBooks.map((book, index) => (
            <FeaturedBook key={index} {...book} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">New Releases</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {newReleases.map((book, index) => (
            <FeaturedBook key={index} {...book} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </section>
    </div>
    </AccessControlWrapper>
  );
}
