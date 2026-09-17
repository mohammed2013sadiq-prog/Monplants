import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../src/constants/colors';

export default function SettingsScreen() {
  const router = useRouter();
  const [pushReminders, setPushReminders] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [celsius, setCelsius] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Care & Reminders */}
        <Text style={styles.sectionHeader}>Plant Care</Text>
        <View style={styles.groupCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelCol}>
              <Text style={styles.settingTitle}>Watering Push Notifications</Text>
              <Text style={styles.settingSub}>Receive morning watering alarms</Text>
            </View>
            <Switch
              value={pushReminders}
              onValueChange={setPushReminders}
              trackColor={{ false: '#E2E8F0', true: Colors.primaryLight }}
              thumbColor={pushReminders ? Colors.primary : '#FFFFFF'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLabelCol}>
              <Text style={styles.settingTitle}>Weather & Climate Advisories</Text>
              <Text style={styles.settingSub}>Alerts for heatwaves or low humidity</Text>
            </View>
            <Switch
              value={weatherAlerts}
              onValueChange={setWeatherAlerts}
              trackColor={{ false: '#E2E8F0', true: Colors.primaryLight }}
              thumbColor={weatherAlerts ? Colors.primary : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Units */}
        <Text style={styles.sectionHeader}>Preferences</Text>
        <View style={styles.groupCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelCol}>
              <Text style={styles.settingTitle}>Temperature Units</Text>
              <Text style={styles.settingSub}>Use Celsius (°C) instead of Fahrenheit (°F)</Text>
            </View>
            <Switch
              value={celsius}
              onValueChange={setCelsius}
              trackColor={{ false: '#E2E8F0', true: Colors.primaryLight }}
              thumbColor={celsius ? Colors.primary : '#FFFFFF'}
            />
          </View>
        </View>

        {/* About */}
        <Text style={styles.sectionHeader}>About MoPlants</Text>
        <View style={styles.groupCard}>
          <TouchableOpacity style={styles.navRow}>
            <Text style={styles.navText}>Botanical Database Version</Text>
            <Text style={styles.navValue}>2026.1</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.navRow}>
            <Text style={styles.navText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.navRow}>
            <Text style={styles.navText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: 20
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 16
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 16,
    paddingVertical: 4
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14
  },
  settingLabelCol: {
    flex: 1,
    marginRight: 12
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary
  },
  settingSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14
  },
  navText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary
  },
  navValue: {
    fontSize: 14,
    color: Colors.textMuted
  }
});
