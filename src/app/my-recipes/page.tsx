'use client';

import { useCallback, useEffect, useState } from 'react';
import PantryCheck from '@/components/PantryCheck';
import RecipeGrid from '@/components/RecipeGrid';
import { recipeApi } from '@/services/recipeApi';
import { Recipe } from '@/types/recipe';

export default function MyRecipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
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

  const handleIngredientsChange = useCallback((ingredients: string[]) => {
    if (ingredients.length === 0) {
      setFilteredRecipes(recipes); // Show all recipes if no filters
      return;
    }
    const filtered = recipes.filter(recipe =>
      recipe.ingredients.some(ing => ingredients.includes(ing.name))
    );
    setFilteredRecipes(filtered);
  }, [recipes]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">My Saved Recipes</h1>
        <p className="text-lg text-gray-600 text-center">Browse your saved recipes and filter them by ingredients!</p>

        {/* ✅ Pass `handleIngredientsChange` to `PantryCheck` */}
        <PantryCheck onIngredientsChange={handleIngredientsChange} />

        {loading ? (
          <div className="text-center text-xl text-gray-500">Loading...</div>
        ) : (
          <RecipeGrid recipes={filteredRecipes} loading={loading} />
        )}
      </div>
    </div>
  );
}
