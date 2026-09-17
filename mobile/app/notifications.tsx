import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../src/constants/colors';

const NOTIFICATIONS = [
  {
    id: '1',
    title: 'Watering Reminder',
    body: 'Time to check Menthe Marocaine soil moisture.',
    time: '2 hours ago',
    unread: true,
    icon: 'water',
    iconColor: '#0D9488',
    iconBg: '#CCFBF1'
  },
  {
    id: '2',
    title: 'Sunlight Advisory',
    body: 'High UV forecast today in your area. Great sunlight for your Arganier.',
    time: 'Yesterday',
    unread: false,
    icon: 'sunny',
    iconColor: '#D97706',
    iconBg: '#FEF3C7'
  },
  {
    id: '3',
    title: 'MoPlants Tip',
    body: 'Spring is the ideal season to repot cacti and succulent varieties.',
    time: '3 days ago',
    unread: false,
    icon: 'bulb',
    iconColor: '#7C3AED',
    iconBg: '#EDE9FE'
  }
];

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.headerRight}>
          <Text style={styles.markAllText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.notifCard, item.unread && styles.notifUnread]}>
            <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
              <Ionicons name={item.icon as any} size={20} color={item.iconColor} />
            </View>
            <View style={styles.notifInfo}>
              <View style={styles.notifTop}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>
              <Text style={styles.notifBody}>{item.body}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4EFE6',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  headerRight: {
    padding: 6
  },
  markAllText: {
    fontSize: 13,
    color: Colors.primaryMedium,
    fontWeight: '600'
  },
  listContent: {
    padding: 20
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight
  },
  notifUnread: {
    borderColor: '#BCEECF',
    backgroundColor: '#F6FCF8'
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  notifInfo: {
    flex: 1
  },
  notifTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  notifTime: {
    fontSize: 11,
    color: Colors.textMuted
  },
  notifBody: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 4
  }
});
