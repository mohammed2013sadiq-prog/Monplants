import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/constants/colors';
import { usePlants } from '../../src/hooks/usePlants';
import { useAuthStore } from '../../src/store/authStore';
import { PLANT_IMAGES, AVATAR_IMAGES, resolvePlantImage } from '../../src/constants/plantImages';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const {
    myPlants,
    reminders,
    favorites,
    isLoading,
    refetchAll,
    completeReminder
  } = usePlants();

  useEffect(() => {
    refetchAll();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.8}
        >
          {user?.avatar ? (
            <Image
              source={user.avatar === 'ai_bot' ? AVATAR_IMAGES.ai_bot : { uri: user.avatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarEmpty}>
              <Ionicons name="person" size={18} color={Colors.textMuted} />
            </View>
          )}
          <Text style={styles.logoTitle}>MoPlants</Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => router.push('/chat')}
            style={styles.headerIconBtn}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/notifications')}
            style={styles.headerIconBtn}
          >
            <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetchAll}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Welcome Greeting Banner */}
        <View style={styles.greetingCard}>
          <View style={styles.greetingTextCol}>
            <Text style={styles.greetingSub}>
              {user ? `Hello, ${user.full_name}` : 'Good Morning,'}
            </Text>
            <Text style={styles.greetingMain}>Your Jungle is thriving.</Text>
          </View>
          <View style={styles.weatherBadge}>
            <Ionicons name="sunny" size={22} color="#F59E0B" />
            <Text style={styles.weatherTemp}>24°C</Text>
            <Text style={styles.weatherCity}>Sunny</Text>
          </View>
        </View>

        {/* Quick Actions Row */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionIdentify]}
            onPress={() => router.push('/scanner')}
          >
            <Ionicons name="scan-outline" size={22} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>Identify Plant</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionSearch]}
            onPress={() => router.push('/(tabs)/search')}
          >
            <Ionicons name="search-outline" size={22} color={Colors.primary} />
            <Text style={styles.actionBtnSearchText}>Search Flora</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Reminders Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Reminders</Text>
          <View style={styles.taskBadge}>
            <Text style={styles.taskBadgeText}>
              {reminders.length > 0 ? `${reminders.length} Tasks` : '2 Tasks'}
            </Text>
          </View>
        </View>

        {/* Reminder Card 1: Palmier Dattier */}
        <View style={styles.reminderCard}>
          <Image
            source={PLANT_IMAGES.palmier_dattier}
            style={styles.reminderImage}
            resizeMode="cover"
          />
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderTitle}>Arroser Palmier Dattier</Text>
            <Text style={styles.reminderSub}>Arrosage copieux au pied</Text>
          </View>
          <TouchableOpacity
            onPress={() => completeReminder(1)}
            style={styles.reminderActionWater}
          >
            <Ionicons name="water" size={18} color="#0D9488" />
          </TouchableOpacity>
        </View>

        {/* Reminder Card 2: Arganier */}
        <View style={styles.reminderCard}>
          <Image
            source={PLANT_IMAGES.arganier}
            style={styles.reminderImage}
            resizeMode="cover"
          />
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderTitle}>Vérifier Sol Arganier</Text>
            <Text style={styles.reminderSub}>Contrôle sécheresse & drainage</Text>
          </View>
          <TouchableOpacity
            onPress={() => completeReminder(2)}
            style={styles.reminderActionMist}
          >
            <Ionicons name="flower-outline" size={18} color={Colors.earthBrownLight} />
          </TouchableOpacity>
        </View>

        {/* My Plants Section */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>My Plants</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/journal')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Plant Grid */}
        <View style={styles.plantGrid}>
          {myPlants.length > 0 ? (
            myPlants.map((plant) => (
              <TouchableOpacity
                key={plant.id}
                style={styles.gridCard}
                onPress={() => router.push(plant.species_id ? `/species/${plant.species_id}` : '/(tabs)/journal')}
              >
                <Image
                  source={resolvePlantImage(plant.image_url || plant.nickname || plant.species?.common_name)}
                  style={styles.gridCardImage}
                  resizeMode="cover"
                />
                <View style={styles.gridCardContent}>
                  <Text style={styles.gridCardName} numberOfLines={1}>
                    {plant.nickname || plant.species?.common_name || 'My Plant'}
                  </Text>
                  <Text style={styles.gridCardSub} numberOfLines={1}>
                    {plant.species?.scientific_name || 'Botanical specimen'}
                  </Text>
                  <View style={styles.healthChip}>
                    <Text style={styles.healthChipText}>Health: 98%</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <>
              {/* Card 1: Arganier */}
              <TouchableOpacity
                style={styles.gridCard}
                onPress={() => router.push('/species/3')}
              >
                <Image
                  source={PLANT_IMAGES.arganier}
                  style={styles.gridCardImage}
                  resizeMode="cover"
                />
                <View style={styles.gridCardContent}>
                  <Text style={styles.gridCardName}>Arganier</Text>
                  <Text style={styles.gridCardSub}>Argania spinosa</Text>
                  <View style={styles.healthChip}>
                    <Text style={styles.healthChipText}>Health: 98%</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Card 2: Palmier Dattier */}
              <TouchableOpacity
                style={styles.gridCard}
                onPress={() => router.push('/species/6')}
              >
                <Image
                  source={PLANT_IMAGES.palmier_dattier}
                  style={styles.gridCardImage}
                  resizeMode="cover"
                />
                <View style={styles.gridCardContent}>
                  <Text style={styles.gridCardName}>Palmier Dattier</Text>
                  <Text style={styles.gridCardSub}>Phoenix dactylifera</Text>
                  <View style={styles.healthChip}>
                    <Text style={styles.healthChipText}>Health: 99%</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Card 3: Olivier */}
              <TouchableOpacity
                style={styles.gridCard}
                onPress={() => router.push('/species/1')}
              >
                <Image
                  source={PLANT_IMAGES.olivier}
                  style={styles.gridCardImage}
                  resizeMode="cover"
                />
                <View style={styles.gridCardContent}>
                  <Text style={styles.gridCardName}>Olivier</Text>
                  <Text style={styles.gridCardSub}>Olea europaea</Text>
                  <View style={styles.healthChip}>
                    <Text style={styles.healthChipText}>Health: 99%</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </>
          )}

          {/* Card 4: Add New Plant */}
          <TouchableOpacity
            style={[styles.gridCard, styles.addNewCard]}
            onPress={() => router.push('/scanner')}
          >
            <View style={styles.addNewCircle}>
              <Ionicons name="add" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.addNewTitle}>Add new plant</Text>
          </TouchableOpacity>
        </View>

        {/* Favorite Species Section */}
        {favorites.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Favorite Species</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/favorites')}>
                <Text style={styles.viewAllText}>See all</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Scan Button */}
      <TouchableOpacity
        style={styles.floatingScanBtn}
        onPress={() => router.push('/scanner')}
      >
        <Ionicons name="camera" size={26} color="#FFFFFF" />
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 12
  },
  avatarEmpty: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E8ECEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1'
  },
  logoTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.3
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4EFE6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 90
  },
  greetingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  greetingTextCol: {
    flex: 1
  },
  greetingSub: {
    fontSize: 14,
    color: Colors.textMuted
  },
  greetingMain: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2
  },
  weatherBadge: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight
  },
  weatherTemp: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2
  },
  weatherCity: {
    fontSize: 10,
    color: Colors.textMuted
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 18,
    gap: 8
  },
  actionIdentify: {
    backgroundColor: Colors.primary
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  actionSearch: {
    backgroundColor: Colors.sandBeige
  },
  actionBtnSearchText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  taskBadge: {
    backgroundColor: '#BCEECF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  taskBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight
  },
  reminderImage: {
    width: 48,
    height: 48,
    borderRadius: 12
  },
  reminderInfo: {
    flex: 1,
    marginLeft: 14
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  reminderSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2
  },
  reminderActionWater: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  reminderActionMist: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryMedium
  },
  plantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 14
  },
  gridCardImage: {
    width: '100%',
    height: 110,
    backgroundColor: Colors.sandBeigeLight
  },
  gridCardContent: {
    padding: 10
  },
  gridCardName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  gridCardSub: {
    fontSize: 11,
    fontStyle: 'italic',
    color: Colors.textMuted,
    marginTop: 2
  },
  healthChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 8
  },
  healthChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1B5E20'
  },
  addNewCard: {
    height: 184,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderColor: '#CAC6BD',
    backgroundColor: '#FAF8F5'
  },
  addNewCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight
  },
  addNewTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary
  },
  floatingScanBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6
  }
});
