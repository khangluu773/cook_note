import { Ingredient, Recipe } from '@/types/recipe';
import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

interface SearchParams {
  query?: string;
  maxReadyTime?: string;
  maxPrice?: string;
  dietary?: string[];
  ingredients?: string[];
}

interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  pricePerServing: number;
  extendedIngredients: {
    id: number;
    name: string;
    aisle: string;
  }[];
  analyzedInstructions: {
    steps: { step: string }[];
  }[];
  diets: string[];
  servings: number;
}

interface SpoonacularIngredient {
  id: number;
  name: string;
}

export const recipeApi = {
  async searchRecipes({
    query = '',
    maxReadyTime,
    maxPrice,
    dietary,
    ingredients,
  }: SearchParams): Promise<Recipe[]> {
    try {
      const params = new URLSearchParams({
        apiKey: API_KEY!,
        query,
        number: '12',
        addRecipeInformation: 'true',
        fillIngredients: 'true',
        ...(maxReadyTime && { maxReadyTime }),
        ...(maxPrice && { maxCost: maxPrice }),
        ...(dietary?.length && { diet: dietary.join(',') }),
        ...(ingredients?.length && { includeIngredients: ingredients.join(',') }),
      });

      const response = await axios.get(`${BASE_URL}/complexSearch?${params}`);
      
      return response.data.results.map((recipe: SpoonacularRecipe) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        pricePerServing: recipe.pricePerServing,
        ingredients: recipe.extendedIngredients.map((ing: { id: number; name: string; aisle: string }) => ({
          id: ing.id.toString(),
          name: ing.name,
          category: ing.aisle,
        })),
        instructions: recipe.analyzedInstructions[0]?.steps.map((step: { step: string }) => step.step) || [],
        dietaryTags: recipe.diets,
        servings: recipe.servings,
      }));
    } catch (error) {
      console.error('Error searching recipes:', error);
      return [];
    }
  },

  async getIngredientSuggestions(query: string): Promise<Ingredient[]> {
    try {
      const params = new URLSearchParams({
        apiKey: API_KEY!,
        query,
        number: '5',
      });

      const response = await axios.get(
        `https://api.spoonacular.com/food/ingredients/autocomplete?${params}`
      );

      return response.data.map((item: SpoonacularIngredient) => ({
        id: item.id.toString(),
        name: item.name,
      }));
    } catch (error) {
      console.error('Error fetching ingredient suggestions:', error);
      return [];
    }
  },
}; 