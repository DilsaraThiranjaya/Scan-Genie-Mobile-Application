import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { FirestoreService } from '@/services/firestore';
import { UserAnalytics } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { ChartBar as BarChart3, TrendingUp, Heart, Scan, Calendar } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export default function Analytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = async () => {
    if (!user) return;

    try {
      const userAnalytics = await FirestoreService.getUserAnalytics(user.uid);
      setAnalytics(userAnalytics);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load analytics',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
  };

  const getTopCategories = () => {
    if (!analytics?.categoriesScanned) return [];
    return Object.entries(analytics.categoriesScanned)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const getCurrentMonthScans = () => {
    if (!analytics?.monthlyScans) return 0;
    const currentMonth = new Date().toISOString().slice(0, 7);
    return analytics.monthlyScans[currentMonth] || 0;
  };

  if (loading) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centerContent}>
            <Text style={styles.loadingText}>Loading analytics...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!analytics) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centerContent}>
            <BarChart3 size={64} color="rgba(255, 255, 255, 0.5)" />
            <Text style={styles.emptyTitle}>No data yet</Text>
            <Text style={styles.emptySubtitle}>
              Start scanning products to see your analytics!
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const topCategories = getTopCategories();
  const currentMonthScans = getCurrentMonthScans();

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <BarChart3 size={32} color="white" />
          <Text style={styles.headerTitle}>Your Analytics</Text>
          <Text style={styles.headerSubtitle}>Track your healthy shopping journey</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <View style={styles.content}>
            {/* Stats Overview */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#22c55e' }]}>
                  <Scan size={24} color="white" />
                </View>
                <Text style={styles.statNumber}>{analytics.totalScans}</Text>
                <Text style={styles.statLabel}>Total Scans</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#ef4444' }]}>
                  <Heart size={24} color="white" />
                </View>
                <Text style={styles.statNumber}>{analytics.favoriteCount}</Text>
                <Text style={styles.statLabel}>Favorites</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#3b82f6' }]}>
                  <Calendar size={24} color="white" />
                </View>
                <Text style={styles.statNumber}>{currentMonthScans}</Text>
                <Text style={styles.statLabel}>This Month</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#8b5cf6' }]}>
                  <TrendingUp size={24} color="white" />
                </View>
                <Text style={styles.statNumber}>
                  {Object.keys(analytics.categoriesScanned).length}
                </Text>
                <Text style={styles.statLabel}>Categories</Text>
              </View>
            </View>

            {/* Top Categories */}
            {topCategories.length > 0 && (
              <View style={styles.categoriesCard}>
                <Text style={styles.cardTitle}>Top Categories Scanned</Text>
                <View style={styles.categoriesList}>
                  {topCategories.map(([category, count], index) => (
                    <View key={category} style={styles.categoryItem}>
                      <View style={styles.categoryInfo}>
                        <Text style={styles.categoryRank}>#{index + 1}</Text>
                        <Text style={styles.categoryName}>{category}</Text>
                      </View>
                      <View style={styles.categoryCount}>
                        <Text style={styles.categoryCountText}>{count}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Monthly Activity */}
            <View style={styles.monthlyCard}>
              <Text style={styles.cardTitle}>Monthly Activity</Text>
              <View style={styles.monthlyList}>
                {Object.entries(analytics.monthlyScans)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .slice(0, 6)
                  .map(([month, count]) => {
                    const date = new Date(month + '-01');
                    const monthName = date.toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    });
                    return (
                      <View key={month} style={styles.monthItem}>
                        <Text style={styles.monthName}>{monthName}</Text>
                        <Text style={styles.monthCount}>{count} scans</Text>
                      </View>
                    );
                  })}
              </View>
            </View>

            {/* Achievement Card */}
            <View style={styles.achievementCard}>
              <Text style={styles.achievementTitle}>🏆 Achievement Unlocked!</Text>
              <Text style={styles.achievementText}>
                {analytics.totalScans >= 50 
                  ? "Nutrition Expert - You've scanned 50+ products!"
                  : analytics.totalScans >= 25
                  ? "Health Explorer - You've scanned 25+ products!"
                  : analytics.totalScans >= 10
                  ? "Smart Shopper - You've scanned 10+ products!"
                  : "Getting Started - Keep scanning to unlock achievements!"
                }
              </Text>
            </View>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  categoriesCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  categoriesList: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryRank: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
    width: 24,
  },
  categoryName: {
    fontSize: 14,
    color: '#1f2937',
    marginLeft: 12,
  },
  categoryCount: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  monthlyCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  monthlyList: {
    gap: 12,
  },
  monthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  monthName: {
    fontSize: 14,
    color: '#1f2937',
  },
  monthCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  achievementTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  achievementText: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 20,
  },
});