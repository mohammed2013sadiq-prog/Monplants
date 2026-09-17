import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/constants/colors';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import { useAuthStore } from '../../src/store/authStore';
import { API_BASE_URL } from '../../src/services/api';

const AVATAR_PRESETS = [
  {
    id: 'monstera',
    label: 'Monstera',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'olive',
    label: 'Olive',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'cactus',
    label: 'Cactus',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'fern',
    label: 'Botanist',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  }
];

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0].url);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const handleRegister = async () => {
    clearError();
    let hasError = false;

    if (!fullName.trim() || fullName.trim().length < 2) {
      setNameError('Please enter your full name (at least 2 characters).');
      hasError = true;
    } else {
      setNameError('');
    }

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
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword) {
      setConfirmError('Please confirm your password.');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmError('Passwords do not match.');
      hasError = true;
    } else {
      setConfirmError('');
    }

    if (hasError) return;

    const success = await register(fullName, email, password, selectedAvatar);
    if (success) {
      Alert.alert(
        'Account Created! 🌿',
        'Your profile has been saved to the PostgreSQL database.',
        [{ text: 'Start Growing', onPress: () => router.replace('/(tabs)/home') }]
      );
    } else {
      Alert.alert(
        'Registration Failed',
        error || 'Unable to register account. Please check your details and try again.'
      );
    }
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

          <Text style={styles.title}>Join MoPlants</Text>
          <Text style={styles.subtitle}>Create your botanical database account.</Text>

          {/* Database Connection Badge */}
          <View style={styles.dbBadge}>
            <View style={styles.dbDot} />
            <Text style={styles.dbText}>PostgreSQL Database Connected</Text>
          </View>

          {/* Error Banner */}
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" />
              <Text style={styles.errorBanner}>{error}</Text>
            </View>
          ) : null}

          {/* Avatar Selector */}
          <Text style={styles.avatarLabel}>Choose Your Avatar</Text>
          <View style={styles.avatarRow}>
            {AVATAR_PRESETS.map((item) => {
              const isSelected = selectedAvatar === item.url;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.avatarChip, isSelected && styles.avatarChipSelected]}
                  onPress={() => setSelectedAvatar(item.url)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: item.url }} style={styles.avatarImg} />
                  {isSelected && (
                    <View style={styles.avatarCheck}>
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="e.g. Youssef Bennani"
              iconName="person-outline"
              value={fullName}
              onChangeText={(txt) => {
                setFullName(txt);
                if (nameError) setNameError('');
                if (error) clearError();
              }}
              error={nameError}
            />

            <Input
              label="Email Address"
              placeholder="e.g. youssef@example.com"
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
              placeholder="At least 6 characters"
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

            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              secureTextEntry
              iconName="shield-checkmark-outline"
              value={confirmPassword}
              onChangeText={(txt) => {
                setConfirmPassword(txt);
                if (confirmError) setConfirmError('');
                if (error) clearError();
              }}
              error={confirmError}
            />

            <Button
              title="Create Account"
              variant="primary"
              size="lg"
              loading={isLoading}
              onPress={handleRegister}
              style={styles.submitBtn}
            />

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.footerLink}>Sign In</Text>
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
  avatarLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center'
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 18
  },
  avatarChip: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 2,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative'
  },
  avatarChipSelected: {
    borderColor: Colors.primary
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 22
  },
  avatarCheck: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    marginTop: 2
  },
  submitBtn: {
    width: '100%',
    marginTop: 6,
    marginBottom: 20
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
