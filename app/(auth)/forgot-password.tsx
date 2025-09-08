import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BlurView } from 'expo-blur';
import { Mail, ArrowLeft } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { forgotPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Missing Email',
        text2: 'Please enter your email address',
      });
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      Toast.show({
        type: 'success',
        text1: 'Reset Link Sent',
        text2: 'Check your email for the password reset link',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: error.message || 'Could not send reset email',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground colors={['#4facfe', '#00f2fe']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <BlurView style={styles.formContainer} intensity={20} tint="light">
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                {sent
                  ? 'We\'ve sent a reset link to your email'
                  : 'Enter your email to receive a reset link'}
              </Text>
            </View>

            {!sent ? (
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Mail size={20} color="#6c757d" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>

                <TouchableOpacity
                  style={[styles.resetButton, loading && styles.resetButtonDisabled]}
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  <Text style={styles.resetButtonText}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>
                  If an account with that email exists, we've sent you a password reset link.
                </Text>
                
                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  <Text style={styles.resendButtonText}>
                    Didn't receive it? Resend
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Remember your password? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </BlurView>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  resetButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  resetButtonDisabled: {
    opacity: 0.7,
  },
  resetButtonText: {
    color: '#4facfe',
    fontSize: 18,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    gap: 24,
  },
  successText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  resendButton: {
    paddingVertical: 12,
  },
  resendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  linkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});