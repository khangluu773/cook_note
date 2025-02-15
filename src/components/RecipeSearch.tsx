'use client';

import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import PantryCheck from './PantryCheck';

interface SearchParams {
  query: string;
  maxTime: string;
  maxPrice: string;
  dietary: string[];
  ingredients: string[];
}

interface Props {
  onSearch: (params: SearchParams) => void;
}

export default function RecipeSearch({ onSearch }: Props) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    maxPrice: '',
    maxTime: '',
    dietary: [] as string[],
  });
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const activeFilterCount = Object.values(filters).flat().filter(Boolean).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      query: searchQuery,
      maxTime: filters.maxTime,
      maxPrice: filters.maxPrice,
      dietary: filters.dietary,
      ingredients: selectedIngredients,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
          />
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center justify-between w-full md:hidden"
          >
            <span className="font-medium text-gray-700">
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </span>
            {isFilterOpen ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>

          <div className={`mt-4 space-y-6 ${!isFilterOpen && 'hidden md:block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                className="w-full p-2 rounded-lg border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              >
                <option value="">Max Price per Serving</option>
                <option value="5">Under $5</option>
                <option value="10">Under $10</option>
                <option value="15">Under $15</option>
              </select>

              <select
                className="w-full p-2 rounded-lg border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                value={filters.maxTime}
                onChange={(e) => setFilters({...filters, maxTime: e.target.value})}
              >
                <option value="">Cooking Time</option>
                <option value="15">Under 15 mins</option>
                <option value="30">Under 30 mins</option>
                <option value="45">Under 45 mins</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              {['vegetarian', 'vegan', 'gluten-free'].map(diet => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      dietary: prev.dietary.includes(diet)
                        ? prev.dietary.filter(d => d !== diet)
                        : [...prev.dietary, diet]
                    }));
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filters.dietary.includes(diet)
                      ? 'bg-teal-500 text-white hover:bg-teal-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>
        </div>

        <PantryCheck
          onIngredientsChange={(ingredients) => setSelectedIngredients(ingredients)}
        />

        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Search Recipes
        </button>
      </form>
    </div>
  );
} 