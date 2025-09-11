import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/AuthContext';
import { OpenFoodFactsService } from '@/services/openFoodFacts';
import { AIProductSearchService } from '@/services/aiProductSearch';
import { FirestoreService } from '@/services/firestore';
import { Camera, Image as ImageIcon, LogOut, User, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Heart, ChartBar as BarChart3 } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const { user, logout } = useAuth();

  const handleBarcodeScan = async (result: BarcodeScanningResult) => {
    if (loading) return;
    
    setScanning(false);
    setLoading(true);

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      const product = await OpenFoodFactsService.getProductByBarcode(result.data);
      
      if (product && user) {
        await FirestoreService.addScanToHistory(user.uid, product);
        Toast.show({
          type: 'success',
          text1: 'Product Found!',
          text2: product.name,
        });
        router.push({
          pathname: '/(tabs)/results',
          params: { productData: JSON.stringify(product) }
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Product Not Found',
          text2: 'This barcode was not found in our database',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Scan Error',
        text2: 'Failed to scan product. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImagePicker = async () => {
    setProcessingImage(true);
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      await processProductImage(result.assets[0].uri);
    }
    
    setProcessingImage(false);
  };

  const processProductImage = async (imageUri: string) => {
    if (!user) return;

    try {
      Toast.show({
        type: 'info',
        text1: 'Analyzing Image',
        text2: 'AI is identifying the product...',
      });

      // Step 1: Identify product using AI
      const identification = await AIProductSearchService.identifyProductFromImage(imageUri);
      
      if (!identification || !identification.product_name) {
        Toast.show({
          type: 'error',
          text1: 'Product Not Recognized',
          text2: 'Could not identify the product from the image',
        });
        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Product Identified!',
        text2: identification.product_name,
      });

      // Step 2: Search Open Food Facts for similar products
      const searchResults = await OpenFoodFactsService.searchProductsByName(
        identification.product_name,
        identification.category
      );

      if (searchResults.length > 0) {
        // Use the first/best match
        const product = searchResults[0];
        await FirestoreService.addScanToHistory(user.uid, product);
        
        router.push({
          pathname: '/(tabs)/results',
          params: { 
            productData: JSON.stringify(product),
            aiIdentified: 'true',
            originalImage: imageUri
          }
        });
      } else {
        // Create a basic product from AI identification
        const basicProduct = {
          id: `ai_${Date.now()}`,
          barcode: 'AI_IDENTIFIED',
          name: identification.product_name,
          brand: identification.brand,
          category: identification.category,
          imageUrl: imageUri,
          scannedAt: new Date(),
        };

        await FirestoreService.addScanToHistory(user.uid, basicProduct);
        
        router.push({
          pathname: '/(tabs)/results',
          params: { 
            productData: JSON.stringify(basicProduct),
            aiIdentified: 'true',
            originalImage: imageUri
          }
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Analysis Failed',
        text2: 'Could not process the image. Please try again.',
      });
    }
  };

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to log out?')) {
        await logout();
        router.replace('/(auth)/login');
      }
    } else {
      Alert.alert(
        'Log Out',
        'Are you sure you want to log out?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Log Out',
            style: 'destructive',
            onPress: async () => {
              await logout();
              router.replace('/(auth)/login');
            },
          },
        ]
      );
    }
  };

  if (!permission) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-lg text-center mb-5">We need your permission to show the camera</Text>
        <TouchableOpacity 
          className="bg-blue-500 px-6 py-3 rounded-lg"
          onPress={requestPermission}
        >
          <Text className="text-white text-base font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (scanning) {
    return (
      <View className="flex-1">
        <CameraView
          className="flex-1"
          facing="back"
          onBarcodeScanned={handleBarcodeScan}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
          }}
        >
          <BlurView className="flex-1 justify-center items-center p-5" intensity={20} tint="dark">
            <Text className="text-white text-lg text-center mb-10">Position barcode in the center</Text>
            <View className="w-64 h-64 border-2 border-white rounded-xl bg-transparent" />
            <TouchableOpacity
              className="mt-10 px-6 py-3 bg-white/20 rounded-lg border border-white/30"
              onPress={() => setScanning(false)}
            >
              <Text className="text-white text-base font-semibold">Cancel</Text>
            </TouchableOpacity>
          </BlurView>
        </CameraView>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} className="flex-1">
      <View className="flex-1 px-5 pt-5">
        <View className="flex-row justify-between items-center mb-2.5">
          <View className="flex-row items-center gap-2">
            <User size={24} color="white" />
            <Text className="text-white text-lg font-semibold">
              Welcome, {user?.displayName || 'User'}!
            </Text>
          </View>
          <TouchableOpacity className="p-2" onPress={handleLogout}>
            <LogOut size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 p-5 gap-5">
          <BlurView className="rounded-2xl p-6 bg-white/10 border border-white/20" intensity={20} tint="light">
            <Text className="text-white text-2xl font-bold text-center mb-2">AI Shopping Assistant</Text>
            <Text className="text-white/80 text-base text-center mb-8 leading-6">
              Scan products to get instant nutrition insights and healthier alternatives
            </Text>

            <View className="gap-4">
              <TouchableOpacity
                className="flex-row items-center justify-center py-4 rounded-xl bg-white/20 border border-white/30 gap-3"
                onPress={() => setScanning(true)}
                disabled={loading}
              >
                <Camera size={32} color="white" />
                <Text className="text-white text-lg font-semibold">Scan Barcode</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center justify-center py-4 rounded-xl bg-white gap-3"
                onPress={handleImagePicker}
                disabled={loading || processingImage}
              >
                {processingImage ? (
                  <Sparkles size={32} color="#667eea" />
                ) : (
                  <ImageIcon size={32} color="#667eea" />
                )}
                <Text className="text-blue-500 text-lg font-semibold">
                  {processingImage ? 'Analyzing...' : 'AI Photo Scan'}
                </Text>
              </TouchableOpacity>
            </View>

            {(loading || processingImage) && (
              <View className="mt-4 items-center">
                <Text className="text-white/80 text-base">
                  {processingImage ? 'AI is analyzing your image...' : 'Processing...'}
                </Text>
              </View>
            )}
          </BlurView>

          <View className="flex-row gap-4">
            <TouchableOpacity
              className="flex-1 bg-white/90 rounded-xl p-5 items-center gap-2"
              onPress={() => router.push('/(tabs)/favorites')}
            >
              <Heart size={24} color="#667eea" />
              <Text className="text-gray-800 text-base font-semibold">Favorites</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-white/90 rounded-xl p-5 items-center gap-2"
              onPress={() => router.push('/(tabs)/analytics')}
            >
              <BarChart3 size={24} color="#667eea" />
              <Text className="text-gray-800 text-base font-semibold">Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}