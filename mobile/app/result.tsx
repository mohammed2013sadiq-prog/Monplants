import React, { useState } from 'react';
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
import Colors from '../src/constants/colors';
import Button from '../src/components/Button';
import { usePlantStore } from '../src/store/plantStore';
import { resolvePlantImage } from '../src/constants/plantImages';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addPlantToCollection, toggleFavorite, isFavorite } = usePlantStore();

  const [isAdding, setIsAdding] = useState(false);

  // Parse species data if passed
  let parsedData = null;
  try {
    if (params.speciesData && typeof params.speciesData === 'string') {
      parsedData = JSON.parse(params.speciesData);
    }
  } catch (e) {
    // fallback
  }

  const rawSpecies = parsedData?.species;
  const species = {
    id: rawSpecies?.id || 1,
    commonName: rawSpecies?.commonName || rawSpecies?.common_name || 'Olivier',
    scientificName: rawSpecies?.scientificName || rawSpecies?.scientific_name || 'Olea europaea',
    family: rawSpecies?.family || 'Oleaceae',
    description:
      rawSpecies?.description ||
      "Symbole universel de paix, de longévité et de sagesse, l'Olivier prospère dans tout le bassin méditerranéen marocain (Meknès, Fès, Beni Mellal). Arbre noble au feuillage argenté persistant.",
    lightNeeds: rawSpecies?.lightNeeds || rawSpecies?.light_needs || 'Plein Soleil',
    wateringFrequency: rawSpecies?.wateringFrequency || rawSpecies?.watering_frequency || 'Faible (Tous les 10-14 jours)',
    soilType: rawSpecies?.soilType || rawSpecies?.soil_type || 'Sol rocailleux, calcaire ou caillouteux bien drainé',
    climateAdaptation: rawSpecies?.climateAdaptation || rawSpecies?.climate_adaptation || 'Méditerranéen chaud',
    toxicityLevel: rawSpecies?.toxicityLevel || rawSpecies?.toxicity_level || 'Non-toxique pour les animaux',
    careDifficulty: rawSpecies?.careDifficulty || rawSpecies?.care_difficulty || 'Facile',
    imageUrl: rawSpecies?.imageUrl || rawSpecies?.image_url || 'olivier'
  };

  const confidence = parsedData?.confidence || 0.98;
  const imageUri = (params.image as string) || species.imageUrl || 'olivier';

  const handleAddToMyPlants = async () => {
    setIsAdding(true);
    const success = await addPlantToCollection(species.id, species.commonName, imageUri);
    setIsAdding(false);

    Alert.alert(
      'Added to Collection!',
      `${species.commonName} has been added to your plants. Watering schedule created.`,
      [
        {
          text: 'Go to Garden',
          onPress: () => router.replace('/(tabs)/home')
        },
        { text: 'Keep Exploring' }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Result</Text>
        <TouchableOpacity
          onPress={() => toggleFavorite(species.id)}
          style={styles.backBtn}
        >
          <Ionicons
            name={isFavorite(species.id) ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite(species.id) ? '#E53935' : Colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Plant Photograph Card */}
        <View style={styles.imageCard}>
          <Image
            source={resolvePlantImage(imageUri || species.commonName || species.scientificName)}
            style={styles.mainImage}
            resizeMode="cover"
          />

          {/* Confidence Badge */}
          <View style={styles.matchBadge}>
            <View style={styles.matchDot} />
            <Text style={styles.matchText}>
              {Math.round(confidence * 100)}% Match
            </Text>
          </View>
        </View>

        {/* Species Information Card */}
        <View style={styles.infoCard}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.commonName}>{species.commonName}</Text>
              <Text style={styles.scientificName}>{species.scientificName}</Text>
            </View>
          </View>

          {/* Tag Chips */}
          <View style={styles.tagChipsRow}>
            <View style={[styles.chip, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.chipText, { color: '#92400E' }]}>Full Sun</Text>
            </View>
            <View style={[styles.chip, { backgroundColor: '#D1F2D9' }]}>
              <Text style={[styles.chipText, { color: '#0D522C' }]}>Low Water</Text>
            </View>
            <View style={[styles.chip, { backgroundColor: '#E0F2FE' }]}>
              <Text style={[styles.chipText, { color: '#0369A1' }]}>Drought Tolerant</Text>
            </View>
          </View>

          <Text style={styles.descriptionText}>{species.description}</Text>

          {/* Botanical Care Specs Grid */}
          <View style={styles.specsGrid}>
            <View style={styles.specBox}>
              <Ionicons name="sunny-outline" size={20} color={Colors.primary} />
              <Text style={styles.specLabel}>Light</Text>
              <Text style={styles.specValue}>{species.lightNeeds}</Text>
            </View>

            <View style={styles.specBox}>
              <Ionicons name="water-outline" size={20} color={Colors.primary} />
              <Text style={styles.specLabel}>Watering</Text>
              <Text style={styles.specValue}>{species.wateringFrequency}</Text>
            </View>

            <View style={styles.specBox}>
              <Ionicons name="earth-outline" size={20} color={Colors.primary} />
              <Text style={styles.specLabel}>Soil</Text>
              <Text style={styles.specValue}>{species.soilType}</Text>
            </View>

            <View style={styles.specBox}>
              <Ionicons name="thermometer-outline" size={20} color={Colors.primary} />
              <Text style={styles.specLabel}>Climate</Text>
              <Text style={styles.specValue}>{species.climateAdaptation}</Text>
            </View>

            <View style={styles.specBox}>
              <Ionicons name="alert-circle-outline" size={20} color={Colors.primary} />
              <Text style={styles.specLabel}>Toxicity</Text>
              <Text style={styles.specValue}>{species.toxicityLevel}</Text>
            </View>

            <View style={styles.specBox}>
              <Ionicons name="fitness-outline" size={20} color={Colors.primary} />
              <Text style={styles.specLabel}>Care Difficulty</Text>
              <Text style={styles.specValue}>{species.careDifficulty}</Text>
            </View>
          </View>
        </View>

        {/* Similar Species Section */}
        <View style={styles.similarSection}>
          <Text style={styles.similarTitle}>Similar Species</Text>
          <TouchableOpacity
            style={styles.similarCard}
            onPress={() => router.push('/species/2')}
          >
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1550950158-d0d960dff51b?auto=format&fit=crop&w=600&q=80'
              }}
              style={styles.similarImage}
              resizeMode="cover"
            />
            <View style={styles.similarOverlay}>
              <Text style={styles.similarName}>Hibiscus</Text>
              <Text style={styles.similarSub}>Hibiscus rosa-sinensis</Text>
            </View>
          </TouchableOpacity>
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
    fontWeight: '700',
    color: Colors.textPrimary
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100
  },
  imageCard: {
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16
  },
  mainImage: {
    width: '100%',
    height: '100%'
  },
  matchBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6
  },
  matchDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981'
  },
  matchText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#EFEAE2',
    marginBottom: 20
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  commonName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  scientificName: {
    fontSize: 15,
    fontStyle: 'italic',
    color: Colors.textMuted,
    marginTop: 2
  },
  tagChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 14,
    flexWrap: 'wrap'
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700'
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10
  },
  specBox: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight
  },
  specLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    marginTop: 6,
    textTransform: 'uppercase'
  },
  specValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 2
  },
  similarSection: {
    marginBottom: 20
  },
  similarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12
  },
  similarCard: {
    height: 170,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative'
  },
  similarImage: {
    width: '100%',
    height: '100%'
  },
  similarOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.45)'
  },
  similarName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  similarSub: {
    fontSize: 12,
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.85)'
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
