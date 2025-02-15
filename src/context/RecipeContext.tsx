'use client';

import { Recipe, SavedRecipe } from '@/types/recipe';
import { createContext, useContext, useEffect, useState } from 'react';

interface RecipeContextType {
  savedRecipes: SavedRecipe[];
  saveRecipe: (recipe: Recipe) => void;
  removeRecipe: (recipeId: number) => void;
  isRecipeSaved: (recipeId: number) => boolean;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('savedRecipes');
    if (saved) {
      setSavedRecipes(JSON.parse(saved));
    }
  }, []);

  const saveRecipe = (recipe: Recipe) => {
    const savedRecipe: SavedRecipe = {
      ...recipe,
      savedAt: Date.now(),
    };
    const updated = [...savedRecipes, savedRecipe];
    setSavedRecipes(updated);
    localStorage.setItem('savedRecipes', JSON.stringify(updated));
  };

  const removeRecipe = (recipeId: number) => {
    const updated = savedRecipes.filter(recipe => recipe.id !== recipeId);
    setSavedRecipes(updated);
    localStorage.setItem('savedRecipes', JSON.stringify(updated));
  };

  const isRecipeSaved = (recipeId: number) => {
    return savedRecipes.some(recipe => recipe.id === recipeId);
  };

  return (
    <RecipeContext.Provider value={{ savedRecipes, saveRecipe, removeRecipe, isRecipeSaved }}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
} 