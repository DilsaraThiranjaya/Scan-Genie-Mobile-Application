import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Lightbulb, TrendingUp, Leaf, Shield } from 'lucide-react-native';

const suggestions = [
  {
    id: 1,
    title: 'Organic Whole Grain Bread',
    brand: 'Nature Valley',
    reason: 'Higher fiber content and no preservatives',
    improvement: '25% more fiber',
    icon: Leaf,
    color: '#22c55e',
  },
  {
    id: 2,
    title: 'Low-Sodium Tomato Sauce',
    brand: 'Healthy Choice',
    reason: 'Reduced sodium content for heart health',
    improvement: '40% less sodium',
    icon: Shield,
    color: '#3b82f6',
  },
  {
    id: 3,
    title: 'Greek Yogurt Alternative',
    brand: 'Two Good',
    reason: 'Higher protein and probiotics',
    improvement: '2x more protein',
    icon: TrendingUp,
    color: '#8b5cf6',
  },
];

export default function Suggestions() {
  return (
    <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Lightbulb size={32} color="white" />
              <Text style={styles.headerTitle}>Healthier Alternatives</Text>
              <Text style={styles.headerSubtitle}>
                Based on your recent scans, here are some better options for you
              </Text>
            </View>

            <View style={styles.suggestionsContainer}>
              {suggestions.map((suggestion) => {
                const IconComponent = suggestion.icon;
                return (
                  <TouchableOpacity key={suggestion.id} style={styles.suggestionCard}>
                    <View style={styles.suggestionHeader}>
                      <View style={[styles.iconContainer, { backgroundColor: suggestion.color }]}>
                        <IconComponent size={24} color="white" />
                      </View>
                      <View style={styles.improvementBadge}>
                        <Text style={styles.improvementText}>{suggestion.improvement}</Text>
                      </View>
                    </View>

                    <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                    <Text style={styles.suggestionBrand}>{suggestion.brand}</Text>
                    <Text style={styles.suggestionReason}>{suggestion.reason}</Text>

                    <TouchableOpacity style={styles.viewButton}>
                      <Text style={styles.viewButtonText}>View Product</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>💡 Smart Shopping Tips</Text>
              <View style={styles.tipsList}>
                <Text style={styles.tipItem}>• Look for products with nutrition grade A or B</Text>
                <Text style={styles.tipItem}>• Check ingredient lists for hidden sugars</Text>
                <Text style={styles.tipItem}>• Choose whole grain over refined options</Text>
                <Text style={styles.tipItem}>• Consider organic for heavily pesticide-treated crops</Text>
              </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  suggestionsContainer: {
    gap: 16,
  },
  suggestionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  improvementBadge: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#22c55e',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  improvementText: {
    color: '#22c55e',
    fontSize: 12,
    fontWeight: '600',
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  suggestionBrand: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  suggestionReason: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  viewButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
});