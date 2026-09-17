import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../src/constants/colors';
import SpeciesCard from '../../src/components/SpeciesCard';
import EmptyState from '../../src/components/EmptyState';
import { usePlantStore } from '../../src/store/plantStore';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, fetchFavorites, toggleFavorite } = usePlantStore();

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <Text style={styles.headerSub}>
          {favorites.length} {favorites.length === 1 ? 'species' : 'species'} saved in your wishlist
        </Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          if (!item.species) return null;
          return (
            <SpeciesCard
              species={item.species}
              isFavorite={true}
              onPress={() => router.push(`/species/${item.species_id}`)}
              onToggleFavorite={() => toggleFavorite(item.species_id)}
            />
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="No Favorites Yet"
            description="Keep track of plants you love or want to grow in your garden by tapping the heart icon on any species."
            buttonTitle="Explore Plants"
            onButtonPress={() => router.push('/(tabs)/search')}
          />
        }
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
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  headerSub: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2
  },
  listContent: {
    padding: 20,
    paddingBottom: 40
  }
});
