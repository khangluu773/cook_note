'use client';

import RecipeGrid from '@/components/RecipeGrid';
import RecipeSearch from '@/components/RecipeSearch';
import { recipeApi } from '@/services/recipeApi';
import { Recipe } from '@/types/recipe';
import { useEffect, useState } from 'react';

interface SearchParams {
  query: string;
  maxTime: string;
  maxPrice: string;
  dietary: string[];
  ingredients: string[];
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    try {
      const results = await recipeApi.searchRecipes({
        query: params.query,
        maxReadyTime: params.maxTime,
        maxPrice: params.maxPrice,
        dietary: params.dietary,
        ingredients: params.ingredients
      });
      setRecipes(results);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial popular recipes load
  useEffect(() => {
    handleSearch({
      query: 'popular',
      maxTime: '',
      maxPrice: '',
      dietary: [],
      ingredients: []
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
            Find Budget-Friendly Recipes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover delicious recipes that won&apos;t break the bank. Perfect for students and budget-conscious cooks.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-12 transform hover:scale-[1.01] transition-transform">
          <RecipeSearch 
            onSearch={handleSearch}
          />
        </div>

        <RecipeGrid recipes={recipes} loading={loading} />
      </div>
    </div>
  );
}
