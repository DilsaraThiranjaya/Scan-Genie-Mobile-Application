import axios from 'axios';
import { AIProductIdentification, Product } from '@/types';

// Free Google Gemini API configuration - Get your key from https://makersuite.google.com/app/apikey
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'AIzaSyARDQqqBL4zU1tE_ixrjluuK2sxlk6urL4';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

// Rate limiting to respect free tier limits (60 requests/minute)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

export const AIProductSearchService = {
  // New: Identify product from image using AI
  async identifyProductFromImage(imageUri: string): Promise<AIProductIdentification | null> {
    try {
      // Rate limiting - respect free tier limits
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;
      if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
      }
      lastRequestTime = Date.now();

      // Validate API key
      if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured. Please set EXPO_PUBLIC_GEMINI_API_KEY in your environment variables.');
      }

      // Convert image to base64
      const base64Image = await this.convertImageToBase64(imageUri);
      
      const prompt = `
        Analyze this product image and identify the product. Return ONLY a JSON object with this exact structure:
        {
          "product_name": "exact product name",
          "brand": "brand name if visible",
          "category": "food category (e.g., snacks, beverages, dairy, etc.)",
          "confidence": 0.95,
          "description": "brief product description",
          "estimated_price_range": "$2.99 - $4.99",
          "key_features": ["feature1", "feature2", "feature3"]
        }
        
        If you cannot clearly identify the product, return:
        {
          "product_name": null,
          "confidence": 0.0,
          "error": "Could not identify product from image"
        }
        
        Be specific with product names and brands. Focus on food and consumer products.
      `;

      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      // Parse JSON response
      const cleanResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      const identification = JSON.parse(cleanResponse);

      if (identification.confidence < 0.5) {
        return null;
      }

      return identification;
    } catch (error) {
      console.error('Error identifying product from image:', error);
      
      // Handle specific API errors
      if (error.response?.status === 400) {
        console.error('Invalid API request. Check your API key and request format.');
      } else if (error.response?.status === 429) {
        console.error('Rate limit exceeded. Please wait before making another request.');
      } else if (error.response?.status === 403) {
        console.error('API key invalid or insufficient permissions.');
      }
      
      return null;
    }
  },

  // Convert image URI to base64
  async convertImageToBase64(imageUri: string): Promise<string> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  },

  // Enhanced: Get cheaper alternatives using AI
  // async getCheaperAlternatives(product: Product): Promise<AIAlternative[]> {
  // }
};