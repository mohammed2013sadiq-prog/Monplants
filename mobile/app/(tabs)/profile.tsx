import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';
import { usePlantStore } from '../../src/store/plantStore';
import { AVATAR_IMAGES } from '../../src/constants/plantImages';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateAvatar } = useAuthStore();
  const { myPlants, favorites } = usePlantStore();

  const handleAvatarOptions = () => {
    Alert.alert('Profile Picture', 'Customize your profile picture:', [
      {
        text: 'Use AI Botanist Picture',
        onPress: () => updateAvatar('ai_bot')
      },
      {
        text: 'Make Picture Empty',
        onPress: () => updateAvatar(null)
      },
      {
        text: 'Upload Custom Photo',
        onPress: async () => {
          try {
            const res = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8
            });
            if (!res.canceled && res.assets && res.assets.length > 0) {
              updateAvatar(res.assets[0].uri);
            }
          } catch (e) {
            Alert.alert('Notice', 'Could not open image picker.');
          }
        }
      },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of MoPlants?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        }
      }
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Profile Section */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {user?.avatar ? (
            <Image
              source={user.avatar === 'ai_bot' ? AVATAR_IMAGES.ai_bot : { uri: user.avatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarEmpty}>
              <Ionicons name="person" size={46} color={Colors.textMuted} />
            </View>
          )}
          <TouchableOpacity style={styles.editAvatarBtn} onPress={handleAvatarOptions}>
            <Ionicons name="camera" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{user?.full_name || 'Botanical Explorer'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'moplants.user@example.com'}</Text>

        {/* Garden Statistics Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{myPlants.length || 3}</Text>
            <Text style={styles.statLabel}>Plants</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{favorites.length || 5}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>14d</Text>
            <Text style={styles.statLabel}>Care Streak</Text>
          </View>
        </View>
      </View>

      {/* Navigation Menu Options */}
      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Botanical Tools</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/chat')}
        >
          <View style={[styles.menuIconCircle, { backgroundColor: '#EBF7EE' }]}>
            <Ionicons name="chatbubble-ellipses" size={20} color={Colors.primary} />
          </View>
          <Text style={styles.menuItemText}>AI Plant Doctor / Chat</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/map')}
        >
          <View style={[styles.menuIconCircle, { backgroundColor: '#E0F2FE' }]}>
            <Ionicons name="map" size={20} color="#0284C7" />
          </View>
          <Text style={styles.menuItemText}>Flora Map & Habitats</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/learning')}
        >
          <View style={[styles.menuIconCircle, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="school" size={20} color="#D97706" />
          </View>
          <Text style={styles.menuItemText}>Plant Care Guides</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/quiz')}
        >
          <View style={[styles.menuIconCircle, { backgroundColor: '#F3E8FF' }]}>
            <Ionicons name="bulb" size={20} color="#9333EA" />
          </View>
          <Text style={styles.menuItemText}>Botanical Quiz</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Account Settings Section */}
      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Preferences</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/notifications')}
        >
          <View style={[styles.menuIconCircle, { backgroundColor: '#F3F4F5' }]}>
            <Ionicons name="notifications" size={20} color={Colors.textPrimary} />
          </View>
          <Text style={styles.menuItemText}>Care Reminders & Alerts</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/settings')}
        >
          <View style={[styles.menuIconCircle, { backgroundColor: '#F3F4F5' }]}>
            <Ionicons name="settings" size={20} color={Colors.textPrimary} />
          </View>
          <Text style={styles.menuItemText}>App Settings</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Logout Action */}
      <View style={styles.logoutWrapper}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={styles.appVersion}>MoPlants v1.0.0 (MVP)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 14
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.sandBeigeLight
  },
  avatarEmpty: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E8ECEF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E1'
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  userEmail: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FAF8F5',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EFEAE2',
    marginTop: 20,
    width: '100%',
    paddingVertical: 14,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  statItem: {
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight
  },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12
  },
  menuIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary
  },
  logoutWrapper: {
    padding: 24,
    alignItems: 'center'
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 14
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.error
  },
  appVersion: {
    fontSize: 12,
    color: Colors.textMuted
  }
});
