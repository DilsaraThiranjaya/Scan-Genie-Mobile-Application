import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBackgroundProps {
  children: React.ReactNode;
  colors?: readonly [any, any, ...any[]];
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ 
  children, 
  colors = ['#667eea', '#764ba2'] as readonly [any, any]
}) => {
  return (
    <LinearGradient colors={colors} style={styles.gradient}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});