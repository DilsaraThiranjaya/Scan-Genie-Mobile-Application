import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
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
    <LinearGradient colors={['#43e97b', '#38f9d7']} className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-5 gap-5">
            <View className="items-center pt-5 pb-2">
              <Lightbulb size={32} color="white" />
              <Text className="text-3xl font-bold text-white mt-3 mb-2">Healthier Alternatives</Text>
              <Text className="text-base text-white/90 text-center leading-6">
                Based on your recent scans, here are some better options for you
              </Text>
            </View>

            <View className="gap-4">
              {suggestions.map((suggestion) => {
                const IconComponent = suggestion.icon;
                return (
                  <TouchableOpacity key={suggestion.id} className="bg-white rounded-2xl p-5 shadow-lg">
                    <View className="flex-row justify-between items-center mb-4">
                      <View 
                        className="w-12 h-12 rounded-full items-center justify-center"
                        style={{ backgroundColor: suggestion.color }}
                      >
                        <IconComponent size={24} color="white" />
                      </View>
                      <View className="bg-green-50 border border-green-500 px-3 py-1 rounded-xl">
                        <Text className="text-green-600 text-xs font-semibold">{suggestion.improvement}</Text>
                      </View>
                    </View>

                    <Text className="text-lg font-bold text-gray-900 mb-1">{suggestion.title}</Text>
                    <Text className="text-sm text-gray-600 mb-2">{suggestion.brand}</Text>
                    <Text className="text-sm text-gray-700 leading-5 mb-4">{suggestion.reason}</Text>

                    <TouchableOpacity className="bg-gray-100 rounded-lg py-2 items-center">
                      <Text className="text-gray-900 text-sm font-semibold">View Product</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View className="bg-white/90 rounded-2xl p-5">
              <Text className="text-lg font-bold text-gray-900 mb-4">💡 Smart Shopping Tips</Text>
              <View className="gap-2">
                <Text className="text-sm text-gray-700 leading-5">• Look for products with nutrition grade A or B</Text>
                <Text className="text-sm text-gray-700 leading-5">• Check ingredient lists for hidden sugars</Text>
                <Text className="text-sm text-gray-700 leading-5">• Choose whole grain over refined options</Text>
                <Text className="text-sm text-gray-700 leading-5">• Consider organic for heavily pesticide-treated crops</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}