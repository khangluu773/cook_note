'use client';

import { useEffect, useState } from 'react';
import RecipeGrid from '@/components/RecipeGrid';
import { recipeApi } from '@/services/recipeApi';
import { Recipe } from '@/types/recipe';

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's saved recipes
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      setLoading(true);
      try {
        const results = await recipeApi.getSavedRecipes();
        setRecipes(results);
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
            My Saved Recipes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through your collection of saved recipes and get cooking!
          </p>
        </div>

        {loading ? (
          <div className="text-center text-xl text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <RecipeGrid recipes={recipes} loading={loading}/>
              ))
            ) : (
              <div className="col-span-full text-center text-lg text-gray-500">
                No saved recipes found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
