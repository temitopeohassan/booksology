"use client";
import { useEffect, useState } from 'react';
import { BookOpen, BookMarked, Library } from "lucide-react";
import Image from 'next/image';
import { useAccessControl } from '../../contexts/AccessControlContext';
import AccessControlWrapper from '../../components/AccessControlWrapper';


interface Category {
  id: number;
  name: string;
  icon: string;
}

interface FeaturedBookProps {
  title: string;
  author: string;
  cover: string;
}

const FeaturedBook: React.FC<FeaturedBookProps> = ({ title, author, cover }) => {
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
  const { hasAccess, requestAccess } = useAccessControl();
  const [featuredBooks, setFeaturedBooks] = useState<FeaturedBookProps[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newReleases, setNewReleases] = useState<FeaturedBookProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, categoriesRes, newReleasesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/featured-books`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/new-releases`)
        ]);

        const featuredData = await featuredRes.json();
        const categoriesData = await categoriesRes.json();
        const newReleasesData = await newReleasesRes.json();

        setFeaturedBooks(Array.isArray(featuredData) ? featuredData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setNewReleases(Array.isArray(newReleasesData) ? newReleasesData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

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
            <FeaturedBook key={index} title={book.title} author={book.author} cover={book.cover} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">New Releases</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {newReleases.map((book, index) => (
            <FeaturedBook key={index} title={book.title} author={book.author} cover={book.cover} />
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
