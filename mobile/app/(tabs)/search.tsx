import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/constants/colors';
import SpeciesCard from '../../src/components/SpeciesCard';
import Loading from '../../src/components/Loading';
import EmptyState from '../../src/components/EmptyState';
import { useSpecies } from '../../src/hooks/useSpecies';
import { usePlantStore } from '../../src/store/plantStore';

const CATEGORIES = ['All', 'Mediterranean', 'Trees', 'Succulents', 'Herbs', 'Flowers'];

export default function SearchScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { speciesList, isLoading, searchTerm, setSearchTerm } = useSpecies('');
  const { toggleFavorite, isFavorite } = usePlantStore();

  const filteredList = speciesList.filter((sp) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Mediterranean') {
      return (
        sp.climate_adaptation?.toLowerCase().includes('mediterranean') ||
        sp.common_name.includes('Olivier') ||
        sp.common_name.includes('Arganier')
      );
    }
    if (selectedCategory === 'Succulents') {
      return sp.family?.toLowerCase().includes('cact') || sp.common_name.toLowerCase().includes('kactus');
    }
    if (selectedCategory === 'Herbs') {
      return sp.family?.toLowerCase().includes('lami') || sp.common_name.toLowerCase().includes('menthe');
    }
    if (selectedCategory === 'Trees') {
      return (
        sp.common_name.includes('Olivier') ||
        sp.common_name.includes('Arganier') ||
        sp.common_name.includes('Palmier')
      );
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Flora</Text>
        <Text style={styles.headerSub}>Search botanical species, care guides & remedies</Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by common or scientific name..."
            placeholderTextColor={Colors.textMuted}
            value={searchTerm}
            onChangeText={setSearchTerm}
            clearButtonMode="while-editing"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextActive
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Species List */}
      {isLoading ? (
        <Loading message="Discovering species..." />
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <SpeciesCard
              species={item}
              isFavorite={isFavorite(item.id)}
              onPress={() => router.push(`/species/${item.id}`)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="No Species Found"
              description={`We couldn't find any botanical entries matching "${searchTerm}". Try another search term or browse categories.`}
              buttonTitle="Clear Search"
              onButtonPress={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
            />
          }
        />
      )}
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
    paddingBottom: 14,
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
    marginTop: 2,
    marginBottom: 14
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F5',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 8
  },
  categoryScroll: {
    paddingTop: 12,
    gap: 8
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#F3F4F5',
    marginRight: 6
  },
  categoryPillActive: {
    backgroundColor: Colors.primary
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary
  },
  categoryPillTextActive: {
    color: '#FFFFFF'
  },
  listContent: {
    padding: 20,
    paddingBottom: 40
  }
});
