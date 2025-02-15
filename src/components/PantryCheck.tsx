'use client';

import { recipeApi } from '@/services/recipeApi';
import { Ingredient } from '@/types/recipe';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

interface PantryCheckProps {
  onIngredientsChange?: (ingredients: string[]) => void;
}

export default function PantryCheck({ onIngredientsChange }: PantryCheckProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    onIngredientsChange?.(selectedIngredients.map(ing => ing.name));
  }, [selectedIngredients, onIngredientsChange]);

  // Debounced search function
  const searchIngredients = useCallback(
    debounce(async (searchTerm: string) => {
      setIsLoading(true);
      try {
        const suggestions = await recipeApi.getIngredientSuggestions(searchTerm);
        setSuggestions(suggestions);
      } catch (error) {
        console.error('Error searching ingredients:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.length >= 2) {
      searchIngredients(value);
    } else {
      setSuggestions([]);
    }
  };

  const addIngredient = (ingredient: Ingredient) => {
    if (!selectedIngredients.find(ing => ing.id === ingredient.id)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
    setInput('');
    setSuggestions([]);
  };

  const removeIngredient = (ingredientId: string) => {
    setSelectedIngredients(selectedIngredients.filter(ing => ing.id !== ingredientId));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <label htmlFor="pantry-input" className="block text-sm font-medium text-gray-700 mb-2">
          What&apos;s in your pantry?
        </label>
        <div className="relative">
          <input
            id="pantry-input"
            type="text"
            className="input-field"
            value={input}
            onChange={handleInputChange}
            placeholder="Type ingredient name..."
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-5 w-5 border-2 border-teal-500 rounded-full border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full max-w-2xl bg-white shadow-lg rounded-md mt-1 border border-gray-200">
          <ul className="py-1">
            {suggestions.map(ingredient => (
              <li
                key={ingredient.id}
                className="px-4 py-2 hover:bg-teal-50 cursor-pointer flex items-center justify-between"
                onClick={() => addIngredient(ingredient)}
              >
                <span>{ingredient.name}</span>
                <span className="text-sm text-gray-500">{ingredient.category}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Selected ingredients tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        {selectedIngredients.map(ingredient => (
          <span
            key={ingredient.id}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800"
          >
            {ingredient.name}
            <button
              onClick={() => removeIngredient(ingredient.id)}
              className="ml-2 text-teal-600 hover:text-teal-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
} 