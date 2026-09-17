import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../src/store/authStore';
import Colors from '../src/constants/colors';

export default function RootLayout() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background }
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="scanner"
          options={{
            animation: 'slide_from_bottom',
            presentation: 'fullScreenModal'
          }}
        />
        <Stack.Screen
          name="result"
          options={{
            animation: 'slide_from_right'
          }}
        />
        <Stack.Screen
          name="species/[id]"
          options={{
            animation: 'slide_from_right'
          }}
        />
        <Stack.Screen
          name="chat"
          options={{
            animation: 'slide_from_right'
          }}
        />
        <Stack.Screen
          name="map"
          options={{
            animation: 'slide_from_right'
          }}
        />
        <Stack.Screen
          name="learning"
          options={{
            animation: 'slide_from_right'
          }}
        />
        <Stack.Screen
          name="quiz"
          options={{
            animation: 'slide_from_right'
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            animation: 'slide_from_right'
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            animation: 'slide_from_right'
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
