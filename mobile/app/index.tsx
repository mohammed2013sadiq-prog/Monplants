import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../src/constants/colors';
import Button from '../src/components/Button';
import { useAuthStore } from '../src/store/authStore';

export default function SplashScreen() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    // If user is already authenticated, take them directly to home
    if (token) {
      const timer = setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [token]);

  return (
    <View style={styles.container}>
      <View style={styles.backgroundCard}>
        {/* Moroccan Botanical Motif / Header Accent */}
        <View style={styles.iconCircle}>
          <Ionicons name="leaf" size={48} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>MoPlants</Text>
        <Text style={styles.subtitle}>Discover • Identify • Care</Text>

        <Text style={styles.description}>
          Your intelligent botanical companion. Identify species, care for Moroccan & Mediterranean flora, and nurture your living sanctuary.
        </Text>

        <View style={styles.buttonGroup}>
          <Button
            title="Get Started"
            variant="primary"
            size="lg"
            onPress={() => router.push('/(tabs)/home')}
            style={styles.mainButton}
          />

          <Button
            title="Sign In / Register"
            variant="secondary"
            size="md"
            onPress={() => router.push('/(auth)/login')}
            style={styles.secondaryButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.sandBeigeLight,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  backgroundCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDE7DE',
    shadowColor: '#14422D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.earthBrownLight,
    marginTop: 6,
    letterSpacing: 0.5
  },
  description: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginVertical: 24,
    paddingHorizontal: 8
  },
  buttonGroup: {
    width: '100%',
    gap: 12
  },
  mainButton: {
    width: '100%'
  },
  secondaryButton: {
    width: '100%'
  }
});
