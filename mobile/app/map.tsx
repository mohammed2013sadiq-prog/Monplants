import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../src/constants/colors';

const HABITATS = [
  {
    id: '1',
    region: 'Souss-Massa & Anti-Atlas',
    plant: 'Arganier (Argania spinosa)',
    desc: 'Arid limestone plateaus and valleys where the ancient Argan forests flourish.',
    badge: 'UNESCO Biosphere'
  },
  {
    id: '2',
    region: 'Draa Valley & Tafilalet',
    plant: 'Palmier Dattier (Phoenix dactylifera)',
    desc: 'Pre-Saharan desert oases providing micro-climates and sustaining date groves.',
    badge: 'Oasis Biome'
  },
  {
    id: '3',
    region: 'Rif & Middle Atlas Slopes',
    plant: 'Olivier (Olea europaea)',
    desc: 'Sun-drenched hillsides and terraced orchards with limestone soil.',
    badge: 'Mediterranean Slope'
  }
];

export default function MapScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flora Habitats</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mapCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
            }}
            style={styles.mapImage}
            resizeMode="cover"
          />
          <View style={styles.mapOverlay}>
            <Text style={styles.mapOverlayTitle}>Moroccan Native Flora</Text>
            <Text style={styles.mapOverlaySub}>Geographical distribution & climate zones</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Key Botanical Zones</Text>

        {HABITATS.map((hab) => (
          <View key={hab.id} style={styles.habitatCard}>
            <View style={styles.habTopRow}>
              <Text style={styles.habRegion}>{hab.region}</Text>
              <View style={styles.habBadge}>
                <Text style={styles.habBadgeText}>{hab.badge}</Text>
              </View>
            </View>
            <Text style={styles.habPlant}>{hab.plant}</Text>
            <Text style={styles.habDesc}>{hab.desc}</Text>
          </View>
        ))}
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
    padding: 20,
    paddingBottom: 40
  },
  mapCard: {
    height: 190,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 24
  },
  mapImage: {
    width: '100%',
    height: '100%'
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(20, 66, 45, 0.85)'
  },
  mapOverlayTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  mapOverlaySub: {
    fontSize: 12,
    color: '#BCEECF',
    marginTop: 2
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12
  },
  habitatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight
  },
  habTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  habRegion: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  habBadge: {
    backgroundColor: '#EBF7EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  habBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryMedium
  },
  habPlant: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 6
  },
  habDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18
  }
});
