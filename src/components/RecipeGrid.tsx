'use client';

import { useRecipes } from '@/context/RecipeContext';
import { Recipe } from '@/types/recipe';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface RecipeGridProps {
  recipes: Recipe[];
  loading: boolean;
}

export default function RecipeGrid({ recipes, loading }: RecipeGridProps) {
  const { saveRecipe, removeRecipe, isRecipeSaved } = useRecipes();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="recipe-card animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="recipe-card">
          <div className="relative h-48">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover"
            />
            <button
              onClick={() => {
                return isRecipeSaved(recipe.id) ? removeRecipe(recipe.id) : saveRecipe(recipe);
              }}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
            >
              {isRecipeSaved(recipe.id) ? (
                <HeartSolidIcon className="h-6 w-6 text-red-500" />
              ) : (
                <HeartIcon className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
            <div className="flex justify-between text-sm text-gray-600">
              <span>⏱️ {recipe.readyInMinutes} mins</span>
              <span>💰 ${recipe.pricePerServing.toFixed(2)}/serving</span>
            </div>
            {recipe.dietaryTags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {recipe.dietaryTags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 