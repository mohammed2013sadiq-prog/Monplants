import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/constants/colors';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import { useAuthStore } from '../../src/store/authStore';
import { API_BASE_URL } from '../../src/services/api';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const fillDemoAccount = () => {
    setEmail('demo@moplants.app');
    setPassword('password123');
    setEmailError('');
    setPasswordError('');
    clearError();
  };

  const handleLogin = async () => {
    clearError();
    let hasError = false;

    if (!email.trim()) {
      setEmailError('Email address is required.');
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) return;

    const success = await login(email, password);
    if (success) {
      router.replace('/(tabs)/home');
    } else {
      Alert.alert(
        'Authentication Failed',
        error || 'Invalid credentials. Please verify your email and password in the database.'
      );
    }
  };

  const handleSocialNotice = (provider: string) => {
    Alert.alert(
      `${provider} Sign-In`,
      `${provider} OAuth is in development. Please use your PostgreSQL email & password account to sign in.`
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.logoBadge}>
            <Ionicons name="leaf" size={28} color="#FFFFFF" />
          </View>

          <Text style={styles.title}>MoPlants</Text>
          <Text style={styles.subtitle}>Welcome back to your indoor garden.</Text>

          {/* Database Connection Badge */}
          <View style={styles.dbBadge}>
            <View style={styles.dbDot} />
            <Text style={styles.dbText}>PostgreSQL Database Connected</Text>
          </View>

          {/* Quick Demo Credentials Autofill */}
          <TouchableOpacity
            style={styles.demoFillBtn}
            onPress={fillDemoAccount}
            activeOpacity={0.8}
          >
            <Ionicons name="flash-outline" size={16} color={Colors.primary} />
            <Text style={styles.demoFillText}>Quick Fill: Demo Account (demo@moplants.app)</Text>
          </TouchableOpacity>

          {/* Error Banner */}
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" />
              <Text style={styles.errorBanner}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <Input
              label="Email Address"
              placeholder="e.g. explorer@moplants.app"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              iconName="mail-outline"
              value={email}
              onChangeText={(txt) => {
                setEmail(txt);
                if (emailError) setEmailError('');
                if (error) clearError();
              }}
              error={emailError}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              iconName="lock-closed-outline"
              value={password}
              onChangeText={(txt) => {
                setPassword(txt);
                if (passwordError) setPasswordError('');
                if (error) clearError();
              }}
              error={passwordError}
            />

            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() =>
                Alert.alert(
                  'Password Reset',
                  'To reset your password, contact your database administrator or re-register with a new email.'
                )
              }
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In to Garden"
              variant="primary"
              size="lg"
              loading={isLoading}
              onPress={handleLogin}
              style={styles.submitBtn}
            />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => handleSocialNotice('Google')}
              >
                <Ionicons name="logo-google" size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => handleSocialNotice('Apple')}
              >
                <Ionicons name="logo-apple" size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>New to MoPlants? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.footerLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.apiInfo}>API: {API_BASE_URL}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.sandBeigeLight
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center'
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: '#EFEAE2',
    shadowColor: '#14422D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3
  },
  logoBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 14
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14
  },
  dbBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 14,
    gap: 6
  },
  dbDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981'
  },
  dbText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857'
  },
  demoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3FAF5',
    borderWidth: 1,
    borderColor: '#D1E7D8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 6
  },
  demoFillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
    gap: 8
  },
  errorBanner: {
    flex: 1,
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '500'
  },
  form: {
    marginTop: 4
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 18,
    marginTop: -4
  },
  forgotText: {
    fontSize: 13,
    color: Colors.primaryMedium,
    fontWeight: '600'
  },
  submitBtn: {
    width: '100%',
    marginBottom: 20
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border
  },
  dividerText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    marginHorizontal: 10
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24
  },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary
  },
  apiInfo: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 16
  }
});
