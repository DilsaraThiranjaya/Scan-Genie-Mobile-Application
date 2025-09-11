import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBackgroundProps {
  children: React.ReactNode;
  colors?: readonly [any, any, ...any[]];
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  colors = ["#667eea", "#764ba2"],
}) => {
  return (
    <div
      className="flex min-h-screen"
      style={{
        background: `linear-gradient(to bottom right, ${colors[0]}, ${colors[1]})`,
      }}
    >
      {children}
    </div>
  );
};