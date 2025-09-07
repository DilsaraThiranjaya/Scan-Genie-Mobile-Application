import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/AuthContext';
import { OpenFoodFactsService } from '@/services/openFoodFacts';
import { FirestoreService } from '@/services/firestore';
import { Camera, Image as ImageIcon, LogOut, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      Toast.show({
        type: 'info',
        text1: 'Image Selected',
        text2: 'Image analysis coming soon!',
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
      <SafeAreaView style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (scanning) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarcodeScan}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
          }}
        >
          <BlurView style={styles.scanOverlay} intensity={20} tint="dark">
            <Text style={styles.scanText}>Position barcode in the center</Text>
            <View style={styles.scanFrame} />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setScanning(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </BlurView>
        </CameraView>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <User size={24} color="white" />
            <Text style={styles.welcomeText}>
              Welcome, {user?.displayName || 'User'}!
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <BlurView style={styles.mainCard} intensity={20} tint="light">
            <Text style={styles.title}>AI Shopping Assistant</Text>
            <Text style={styles.subtitle}>
              Scan products to get instant nutrition insights and healthier alternatives
            </Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.scanButton]}
                onPress={() => setScanning(true)}
                disabled={loading}
              >
                <Camera size={32} color="white" />
                <Text style={styles.actionButtonText}>Scan Barcode</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.imageButton]}
                onPress={handleImagePicker}
                disabled={loading}
              >
                <ImageIcon size={32} color="#667eea" />
                <Text style={[styles.actionButtonText, styles.imageButtonText]}>
                  Upload Image
                </Text>
              </TouchableOpacity>
            </View>

            {loading && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Processing...</Text>
              </View>
            )}
          </BlurView>

          <View style={styles.featuresGrid}>
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push('/(tabs)/favorites')}
            >
              <Heart size={24} color="#667eea" />
              <Text style={styles.featureText}>Favorites</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push('/(tabs)/analytics')}
            >
              <BarChart3 size={24} color="#667eea" />
              <Text style={styles.featureText}>Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  welcomeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  mainCard: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  actionButtons: {
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  scanButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  imageButton: {
    backgroundColor: 'white',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  imageButtonText: {
    color: '#667eea',
  },
  loadingContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  featureCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scanText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  cancelButton: {
    marginTop: 40,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});