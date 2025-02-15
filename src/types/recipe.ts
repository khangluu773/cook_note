export interface Ingredient {
  id: string;
  name: string;
  category?: string;
}

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  pricePerServing: number;
  ingredients: Ingredient[];
  instructions: string[];
  dietaryTags: string[];
  servings: number;
}

export interface SavedRecipe extends Recipe {
  savedAt: number;
} 