export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand?: string;
  category?: string;
  imageUrl?: string;
  nutritionGrade?: string;
  ingredients?: string[];
  allergens?: string[];
  nutritionFacts?: NutritionFacts;
  scannedAt: Date;
}

export interface NutritionFacts {
  energy?: number;
  fat?: number;
  saturatedFat?: number;
  carbohydrates?: number;
  sugars?: number;
  fiber?: number;
  proteins?: number;
  salt?: number;
}

export interface UserFavorite {
  id: string;
  userId: string;
  product: Product;
  addedAt: Date;
}

export interface ScanHistory {
  id: string;
  userId: string;
  product: Product;
  scannedAt: Date;
}

export interface UserAnalytics {
  totalScans: number;
  categoriesScanned: { [key: string]: number };
  monthlyScans: { [key: string]: number };
  favoriteCount: number;
}

export interface AIProductIdentification {
  product_name: string | null;
  brand?: string;
  category?: string;
  confidence: number;
  description?: string;
  estimated_price_range?: string;
  key_features?: string[];
  error?: string;
}

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type TabsParamList = {
  Home: undefined;
  Results: { product?: Product };
  Suggestions: { product?: Product };
  Favorites: undefined;
  Analytics: undefined;
};