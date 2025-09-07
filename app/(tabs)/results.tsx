import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { FirestoreService } from '@/services/firestore';
import { Product } from '@/types';
import { Heart, ArrowRight, Info, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

export default function Results() {
  const { productData } = useLocalSearchParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (productData) {
      try {
        const parsed = JSON.parse(productData as string);
        setProduct(parsed);
      } catch (error) {
        console.error('Error parsing product data:', error);
      }
    }
  }, [productData]);

  const toggleFavorite = async () => {
    if (!product || !user) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      if (isFavorite) {
        // Note: In a real implementation, you'd need to store the favorite ID to delete it
        Toast.show({
          type: 'info',
          text1: 'Removed from favorites',
          text2: product.name,
        });
        setIsFavorite(false);
      } else {
        await FirestoreService.addFavorite(user.uid, product);
        Toast.show({
          type: 'success',
          text1: 'Added to favorites',
          text2: product.name,
        });
        setIsFavorite(true);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update favorites',
      });
    }
  };

  const getNutritionGradeColor = (grade?: string) => {
    switch (grade?.toLowerCase()) {
      case 'a': return '#22c55e';
      case 'b': return '#84cc16';
      case 'c': return '#eab308';
      case 'd': return '#f97316';
      case 'e': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getNutritionGradeIcon = (grade?: string) => {
    switch (grade?.toLowerCase()) {
      case 'a':
      case 'b':
        return CheckCircle;
      case 'c':
        return Info;
      case 'd':
      case 'e':
        return AlertTriangle;
      default:
        return Info;
    }
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No product data available</Text>
      </SafeAreaView>
    );
  }

  const GradeIcon = getNutritionGradeIcon(product.nutritionGrade);

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.productCard}>
              {product.imageUrl && (
                <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
              )}
              
              <View style={styles.productInfo}>
                <View style={styles.productHeader}>
                  <View style={styles.productTitleContainer}>
                    <Text style={styles.productName}>{product.name}</Text>
                    {product.brand && (
                      <Text style={styles.productBrand}>{product.brand}</Text>
                    )}
                  </View>
                  
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={toggleFavorite}
                  >
                    <Heart
                      size={24}
                      color={isFavorite ? '#ef4444' : '#6b7280'}
                      fill={isFavorite ? '#ef4444' : 'none'}
                    />
                  </TouchableOpacity>
                </View>

                {product.category && (
                  <View style={styles.categoryContainer}>
                    <Text style={styles.categoryText}>{product.category}</Text>
                  </View>
                )}
              </View>
            </View>

            {product.nutritionGrade && (
              <View style={styles.gradeCard}>
                <View style={styles.gradeHeader}>
                  <GradeIcon 
                    size={24} 
                    color={getNutritionGradeColor(product.nutritionGrade)} 
                  />
                  <Text style={styles.gradeTitle}>Nutrition Score</Text>
                </View>
                <View style={[
                  styles.gradeBadge,
                  { backgroundColor: getNutritionGradeColor(product.nutritionGrade) }
                ]}>
                  <Text style={styles.gradeText}>
                    {product.nutritionGrade.toUpperCase()}
                  </Text>
                </View>
              </View>
            )}

            {product.nutritionFacts && (
              <View style={styles.nutritionCard}>
                <Text style={styles.cardTitle}>Nutrition Facts (per 100g)</Text>
                <View style={styles.nutritionGrid}>
                  {Object.entries(product.nutritionFacts).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <View key={key} style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Text>
                        <Text style={styles.nutritionValue}>
                          {typeof value === 'number' ? `${value.toFixed(1)}g` : value}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {product.ingredients && product.ingredients.length > 0 && (
              <View style={styles.ingredientsCard}>
                <Text style={styles.cardTitle}>Ingredients</Text>
                <Text style={styles.ingredientsText}>
                  {product.ingredients.join(', ')}
                </Text>
              </View>
            )}

            {product.allergens && product.allergens.length > 0 && (
              <View style={styles.allergensCard}>
                <View style={styles.allergensHeader}>
                  <AlertTriangle size={20} color="#ef4444" />
                  <Text style={styles.cardTitle}>Allergens</Text>
                </View>
                <View style={styles.allergensContainer}>
                  {product.allergens.map((allergen, index) => (
                    <View key={index} style={styles.allergenTag}>
                      <Text style={styles.allergenText}>{allergen}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.suggestionsButton}>
              <Text style={styles.suggestionsButtonText}>View Healthier Alternatives</Text>
              <ArrowRight size={20} color="white" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 16,
    color: '#6b7280',
  },
  favoriteButton: {
    padding: 8,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  gradeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gradeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  gradeBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  nutritionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  nutritionGrid: {
    gap: 8,
  },
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  ingredientsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
  },
  ingredientsText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  allergensCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
  },
  allergensHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  allergensContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergenTag: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  allergenText: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
  },
  suggestionsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  suggestionsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});