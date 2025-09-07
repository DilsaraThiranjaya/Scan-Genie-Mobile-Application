import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { FirestoreService } from '@/services/firestore';
import { UserFavorite } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Star, Trash2 } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = async () => {
    if (!user) return;

    try {
      const userFavorites = await FirestoreService.getFavorites(user.uid);
      setFavorites(userFavorites);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load favorites',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      await FirestoreService.removeFavorite(favoriteId);
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      Toast.show({
        type: 'success',
        text1: 'Removed',
        text2: 'Product removed from favorites',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to remove favorite',
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

  if (loading) {
    return (
      <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centerContent}>
            <Text style={styles.loadingText}>Loading favorites...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Heart size={32} color="white" fill="white" />
          <Text style={styles.headerTitle}>My Favorites</Text>
          <Text style={styles.headerSubtitle}>
            {favorites.length} saved {favorites.length === 1 ? 'product' : 'products'}
          </Text>
        </View>

        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Heart size={64} color="rgba(255, 255, 255, 0.5)" />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySubtitle}>
              Start scanning products to add them to your favorites!
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          >
            <View style={styles.content}>
              {favorites.map((favorite) => (
                <View key={favorite.id} style={styles.favoriteCard}>
                  <View style={styles.cardContent}>
                    {favorite.product.imageUrl && (
                      <Image
                        source={{ uri: favorite.product.imageUrl }}
                        style={styles.productImage}
                      />
                    )}
                    
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>
                        {favorite.product.name}
                      </Text>
                      {favorite.product.brand && (
                        <Text style={styles.productBrand}>
                          {favorite.product.brand}
                        </Text>
                      )}
                      {favorite.product.category && (
                        <Text style={styles.productCategory}>
                          {favorite.product.category}
                        </Text>
                      )}
                      
                      <View style={styles.productMeta}>
                        {favorite.product.nutritionGrade && (
                          <View style={[
                            styles.gradeBadge,
                            { backgroundColor: getNutritionGradeColor(favorite.product.nutritionGrade) }
                          ]}>
                            <Text style={styles.gradeText}>
                              {favorite.product.nutritionGrade.toUpperCase()}
                            </Text>
                          </View>
                        )}
                        <Text style={styles.addedDate}>
                          Added {favorite.addedAt.toDateString()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeFavorite(favorite.id)}
                  >
                    <Trash2 size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  favoriteCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  productInfo: {
    flex: 1,
    gap: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  productBrand: {
    fontSize: 14,
    color: '#6b7280',
  },
  productCategory: {
    fontSize: 12,
    color: '#9ca3af',
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  gradeBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addedDate: {
    fontSize: 11,
    color: '#9ca3af',
  },
  removeButton: {
    padding: 8,
  },
});