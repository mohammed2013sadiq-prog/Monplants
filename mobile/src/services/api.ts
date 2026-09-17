import axios from 'axios';
import { storage } from '../utils/storage';

import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const resolveApiBaseUrl = (): string => {
  // 1. If explicit environment variable is set and NOT localhost, use it
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl;
  }

  // 2. On Web browser, localhost is completely fine
  if (Platform.OS === 'web') {
    return envUrl || 'http://localhost:3000/api';
  }

  // 3. If running on Expo Go or dev client on physical phone or simulator, extract dev machine LAN IP
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const hostIp = hostUri.split(':')[0];
    return `http://${hostIp}:3000/api`;
  }

  // 4. Android Emulator standard loopback
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }

  // 5. Default Wi-Fi LAN IP fallback for this machine
  return 'http://192.168.1.79:3000/api';
};

export const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Request Interceptor: Attach JWT token if available
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Log or handle unauthenticated responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Token might be expired or invalid
      await storage.clearAll();
    }
    return Promise.reject(error);
  }
);

export default api;
