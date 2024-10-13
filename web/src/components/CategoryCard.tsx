import React from 'react';
import { BookOpen, BookMarked, Library } from 'lucide-react';

interface CategoryCardProps {
    name: string;
    bookCount: number;
    icon: keyof typeof iconComponents;
  }

const iconComponents = {
  BookOpen,
  BookMarked,
  Library,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ name, bookCount, icon }) => {
  const IconComponent = iconComponents[icon as keyof typeof iconComponents];

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center mb-2">
        {IconComponent && <IconComponent className="mr-2" />}
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>
      <p>{bookCount} books</p>
    </div>
  );
};
