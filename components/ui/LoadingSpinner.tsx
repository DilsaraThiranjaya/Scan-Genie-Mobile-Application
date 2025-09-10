import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface LoadingSpinnerProps {
  text?: string;
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = 'Loading...', 
  color = '#667eea' 
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={color} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
});