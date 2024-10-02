import { Search, Filter, ChevronDown } from "lucide-react";

const BookCard = ({ title, author, price, cover }) => (
  <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
    <div className="aspect-[2/3] bg-gray-200">
      <img src={cover} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm">{author}</p>
      <div className="mt-2 flex justify-between items-center">
        <span className="font-bold">{price} ETH</span>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">
          Purchase
        </button>
      </div>
    </div>
  </div>
);

export default function Marketplace() {
  const categories = ["All", "Fiction", "Non-Fiction", "Academic", "Comics", "Poetry"];
  const books = [
    { title: "The Future of DeFi", author: "Elena Rodriguez", price: 0.05, cover: "/api/placeholder/200/300" },
    { title: "Crypto Economics", author: "David Lee", price: 0.03, cover: "/api/placeholder/200/300" },
    { title: "Web3 Design Patterns", author: "Chris Morgan", price: 0.04, cover: "/api/placeholder/200/300" },
    { title: "Blockchain Basics", author: "Sophie Chen", price: 0.02, cover: "/api/placeholder/200/300" },
    { title: "Smart Contract Security", author: "Marcus Johnson", price: 0.06, cover: "/api/placeholder/200/300" },
    { title: "NFT Revolution", author: "Anna White", price: 0.03, cover: "/api/placeholder/200/300" },
  ];

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
                  <input type="number" placeholder="Min" className="w-1/2 p-2 border rounded" />
                  <input type="number" placeholder="Max" className="w-1/2 p-2 border rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Categories</label>
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input type="checkbox" id={category} className="mr-2" />
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
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="border rounded-lg p-2">
                <option>Latest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book, index) => (
              <BookCard key={index} {...book} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}