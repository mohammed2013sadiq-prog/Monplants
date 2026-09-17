import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../constants/colors';
import { UserPlant } from '../types/plant';
import { resolvePlantImage } from '../constants/plantImages';

interface PlantCardProps {
  plant: UserPlant;
  onPress: () => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({ plant, onPress }) => {
  const imageSource = resolvePlantImage(
    plant.image_url || plant.nickname || plant.species?.common_name || plant.species?.image_url
  );

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {plant.nickname || plant.species?.common_name || 'My Plant'}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {plant.species?.scientific_name || 'Botanical specimen'}
        </Text>

        <View style={styles.statusBar}>
          <View style={styles.healthDot} />
          <Text style={styles.statusText}>Health: 98%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAF8F5',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EFEAE2',
    marginBottom: 14,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.sandBeigeLight
  },
  image: {
    width: '100%',
    height: '100%'
  },
  content: {
    padding: 10
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  subtitle: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.textMuted,
    marginTop: 2
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start'
  },
  healthDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
    marginRight: 5
  },
  statusText: {
    fontSize: 11,
    color: '#1B5E20',
    fontWeight: '600'
  }
});

export default PlantCard;
