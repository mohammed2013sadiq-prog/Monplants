import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import { Species } from '../types/species';
import { resolvePlantImage } from '../constants/plantImages';

interface SpeciesCardProps {
  species: Species;
  isFavorite?: boolean;
  onPress: () => void;
  onToggleFavorite?: () => void;
}

export const SpeciesCard: React.FC<SpeciesCardProps> = ({
  species,
  isFavorite = false,
  onPress,
  onToggleFavorite
}) => {
  const imageSource = resolvePlantImage(
    species.image_url || species.common_name || species.scientific_name
  );

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.container}
    >
      <Image source={imageSource} style={styles.image} resizeMode="cover" />

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.commonName} numberOfLines={1}>
            {species.common_name}
          </Text>
          {onToggleFavorite && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                onToggleFavorite();
              }}
              style={styles.favButton}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorite ? '#E53935' : Colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.scientificName} numberOfLines={1}>
          {species.scientific_name}
        </Text>

        <View style={styles.tagsRow}>
          {species.light_needs ? (
            <View style={[styles.badge, styles.badgeLight]}>
              <Text style={styles.badgeLightText}>{species.light_needs.split(' ')[0]}</Text>
            </View>
          ) : null}

          {species.care_difficulty ? (
            <View style={[styles.badge, styles.badgeCare]}>
              <Text style={styles.badgeCareText}>{species.care_difficulty}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: 12,
    backgroundColor: Colors.sandBeigeLight
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  commonName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1
  },
  scientificName: {
    fontSize: 13,
    fontStyle: 'italic',
    color: Colors.textMuted,
    marginTop: 2
  },
  favButton: {
    padding: 4
  },
  tagsRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 6
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  badgeLight: {
    backgroundColor: '#FEF3C7'
  },
  badgeLightText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600'
  },
  badgeCare: {
    backgroundColor: Colors.badgeGreenBg
  },
  badgeCareText: {
    fontSize: 11,
    color: Colors.badgeGreenText,
    fontWeight: '600'
  }
});

export default SpeciesCard;
