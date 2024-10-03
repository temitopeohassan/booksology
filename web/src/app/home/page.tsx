"use client"
import { BookOpen, BookMarked, Library, LucideIcon } from "lucide-react";

interface FeaturedBookProps {
  title: string;
  author: string;
  cover: string;
}

const FeaturedBook: React.FC<FeaturedBookProps> = ({ title, author, cover }) => (
  <div className="relative group">
    <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
      <img src={cover} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="mt-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">{author}</p>
    </div>
  </div>
);

interface CategoryCardProps {
  name: string;
  bookCount: number;
  Icon: LucideIcon;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, bookCount, Icon }) => (
  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
    <Icon className="w-8 h-8 mb-2 text-blue-500" />
    <h3 className="font-semibold">{name}</h3>
    <p className="text-sm text-gray-500">{bookCount} books</p>
  </div>
);

export default function Home() {

  const featuredBooks = [
    { title: "The Blockchain Revolution", author: "Sarah Johnson", cover: "/api/placeholder/200/300" },
    { title: "Digital Horizons", author: "Mike Chen", cover: "/api/placeholder/200/300" },
    { title: "Web3 Futures", author: "Alex Thompson", cover: "/api/placeholder/200/300" },
  ];

  const categories = [
    { name: "Fiction", bookCount: 1250, icon: BookOpen },
    { name: "Non-Fiction", bookCount: 850, icon: BookMarked },
    { name: "Academic", bookCount: 500, icon: Library },
  ];

  return (
    <>
        <div className="container mx-auto px-4 py-8">
       <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Booksology</h1>
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
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="aspect-[2/3] bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} Icon={category.icon} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Quick Access Library</h2>
        <div className="border rounded-lg p-6 bg-gray-50">
          <p className="text-center text-gray-600">Connect your wallet to access your library</p>
        </div>
      </section>
    </div>
    </>
  );
}
