import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/constants/colors';
import Button from '../../src/components/Button';
import Loading from '../../src/components/Loading';
import { usePlantStore } from '../../src/store/plantStore';
import { Species } from '../../src/types/species';
import { resolvePlantImage } from '../../src/constants/plantImages';
import { findSpeciesById } from '../../src/constants/speciesCatalog';

export default function SpeciesDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const {
    speciesList,
    getSpeciesDetails,
    addPlantToCollection,
    toggleFavorite,
    isFavorite
  } = usePlantStore();

  const numId = parseInt(id as string, 10);
  const catalogFallback = findSpeciesById(numId || (id as string));

  const [species, setSpecies] = useState<Species>(() => {
    const local = speciesList.find((s) => s.id === numId);
    return local || catalogFallback;
  });
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchDetail = async () => {
      // Look in local store first
      const local = speciesList.find((s) => s.id === numId);
      if (local && isMounted) {
        setSpecies(local);
      }

      try {
        const remote = await getSpeciesDetails(numId);
        if (remote && isMounted) {
          setSpecies(remote);
        }
      } catch (e) {
        // use local/catalog
      }
    };

    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const currentSpecies: Species = species || catalogFallback;

  const isNonToxic =
    !currentSpecies.toxicity_level ||
    currentSpecies.toxicity_level.toLowerCase().includes('non') ||
    currentSpecies.toxicity_level.toLowerCase().includes('safe');

  // Dynamic tags
  const getTags = () => {
    const tags = [];
    if (currentSpecies.care_difficulty) {
      tags.push({ text: currentSpecies.care_difficulty, type: 'green' });
    }
    if (currentSpecies.family) {
      tags.push({ text: currentSpecies.family, type: 'blue' });
    }
    if (currentSpecies.common_name.toLowerCase().includes('argan')) {
      tags.push({ text: 'UNESCO', type: 'gold' });
      tags.push({ text: 'Huile Précieuse', type: 'green' });
    } else if (currentSpecies.common_name.toLowerCase().includes('palm') || currentSpecies.common_name.toLowerCase().includes('dattier')) {
      tags.push({ text: 'Emblème Oasien', type: 'gold' });
      tags.push({ text: 'Dattes Royales', type: 'green' });
    } else if (currentSpecies.common_name.toLowerCase().includes('oliv')) {
      tags.push({ text: 'Symbole de Paix', type: 'gold' });
      tags.push({ text: 'Méditerranéen', type: 'blue' });
    }
    return tags;
  };

  const handleAddToMyPlants = async () => {
    setIsAdding(true);
    await addPlantToCollection(
      currentSpecies.id,
      currentSpecies.common_name,
      currentSpecies.image_url
    );
    setIsAdding(false);

    Alert.alert(
      'Plante ajoutée !',
      `${currentSpecies.common_name} a été ajoutée à votre collection de plantes.`,
      [
        {
          text: 'Voir mes plantes',
          onPress: () => router.replace('/(tabs)/home')
        },
        { text: 'Continuer' }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MoPlants</Text>
        <TouchableOpacity
          onPress={() => toggleFavorite(currentSpecies.id)}
          style={styles.backBtn}
        >
          <Ionicons
            name={isFavorite(currentSpecies.id) ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite(currentSpecies.id) ? '#E53935' : Colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Botanical Image Showcase Card */}
        <View style={styles.imageCard}>
          <Image
            source={resolvePlantImage(currentSpecies.image_url || currentSpecies.common_name || currentSpecies.scientific_name)}
            style={styles.plantImage}
            resizeMode="cover"
          />

          {/* Pet Toxicity Alert / Safe Badge */}
          <View
            style={[
              styles.toxicityBadge,
              isNonToxic ? styles.toxicityBadgeSafe : styles.toxicityBadgeAlert
            ]}
          >
            <Ionicons
              name={isNonToxic ? 'shield-checkmark' : 'alert-circle'}
              size={14}
              color={isNonToxic ? '#15803D' : '#B91C1C'}
            />
            <Text
              style={[
                styles.toxicityBadgeText,
                isNonToxic ? styles.toxicityBadgeTextSafe : styles.toxicityBadgeTextAlert
              ]}
            >
              {currentSpecies.toxicity_level || 'Non toxique'}
            </Text>
          </View>
        </View>

        {/* Plant Titles & Quick Tags */}
        <View style={styles.titleSection}>
          <Text style={styles.commonName}>{currentSpecies.common_name}</Text>
          <Text style={styles.scientificName}>{currentSpecies.scientific_name}</Text>

          <View style={styles.tagRow}>
            {getTags().map((tag, idx) => (
              <View
                key={idx}
                style={[
                  styles.tagBadge,
                  tag.type === 'green' && styles.tagGreen,
                  tag.type === 'blue' && styles.tagBlue,
                  tag.type === 'gold' && styles.tagGold
                ]}
              >
                <Text
                  style={[
                    styles.tagTextBase,
                    tag.type === 'green' && styles.tagGreenText,
                    tag.type === 'blue' && styles.tagBlueText,
                    tag.type === 'gold' && styles.tagGoldText
                  ]}
                >
                  {tag.text}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 4 Care Essentials Grid */}
        <View style={styles.careGrid}>
          {/* Light */}
          <View style={styles.careBox}>
            <View style={styles.iconCircle}>
              <Ionicons name="sunny-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.careBoxTitle}>Lumière / Light</Text>
            <Text style={styles.careBoxDesc}>{currentSpecies.light_needs}</Text>
          </View>

          {/* Water */}
          <View style={styles.careBox}>
            <View style={styles.iconCircle}>
              <Ionicons name="water-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.careBoxTitle}>Arrosage / Water</Text>
            <Text style={styles.careBoxDesc}>{currentSpecies.watering_frequency}</Text>
          </View>

          {/* Soil */}
          <View style={styles.careBox}>
            <View style={styles.iconCircle}>
              <Ionicons name="earth-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.careBoxTitle}>Sol / Soil</Text>
            <Text style={styles.careBoxDesc}>{currentSpecies.soil_type}</Text>
          </View>

          {/* Climate */}
          <View style={styles.careBox}>
            <View style={styles.iconCircle}>
              <Ionicons name="thermometer-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.careBoxTitle}>Climat / Climate</Text>
            <Text style={styles.careBoxDesc}>{currentSpecies.climate_adaptation}</Text>
          </View>
        </View>

        {/* About this Plant Section */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>À propos / About this Plant</Text>
          <Text style={styles.aboutText}>{currentSpecies.description}</Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View style={styles.bottomBar}>
        <Button
          title="+ Add to My Plants"
          variant="primary"
          size="lg"
          loading={isAdding}
          onPress={handleAddToMyPlants}
          style={styles.addBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: '#FAF8F5'
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEAE2'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 110
  },
  imageCard: {
    height: 310,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
    backgroundColor: '#EAE6DF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  plantImage: {
    width: '100%',
    height: '100%'
  },
  toxicityBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6
  },
  toxicityBadgeSafe: {
    backgroundColor: 'rgba(240, 253, 244, 0.95)',
    borderWidth: 1,
    borderColor: '#BBF7D0'
  },
  toxicityBadgeAlert: {
    backgroundColor: 'rgba(254, 242, 242, 0.95)',
    borderWidth: 1,
    borderColor: '#FECACA'
  },
  toxicityBadgeText: {
    fontSize: 12,
    fontWeight: '700'
  },
  toxicityBadgeTextSafe: {
    color: '#15803D'
  },
  toxicityBadgeTextAlert: {
    color: '#991B1B'
  },
  titleSection: {
    marginBottom: 20
  },
  commonName: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: Colors.textMuted,
    marginTop: 2
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12
  },
  tagTextBase: {
    fontSize: 12,
    fontWeight: '700'
  },
  tagGreen: {
    backgroundColor: '#DCFCE7'
  },
  tagGreenText: {
    color: '#15803D'
  },
  tagBlue: {
    backgroundColor: '#E0F2FE'
  },
  tagBlueText: {
    color: '#0369A1'
  },
  tagGold: {
    backgroundColor: '#FEF3C7'
  },
  tagGoldText: {
    color: '#B45309'
  },
  careGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20
  },
  careBox: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EFEAE2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  careBoxTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  careBoxDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 16
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EFEAE2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1
  },
  aboutTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8
  },
  aboutText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight
  },
  addBtn: {
    width: '100%'
  }
});
