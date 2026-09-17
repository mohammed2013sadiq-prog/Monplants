import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../src/constants/colors';

const ARTICLES = [
  {
    id: '1',
    category: 'Watering Guide',
    title: 'The "Finger Test" & Soil Moisture Mastery',
    readTime: '4 min read',
    icon: 'water-outline'
  },
  {
    id: '2',
    category: 'Sunlight',
    title: 'Bright Indirect vs Full Sun: Finding the Perfect Window',
    readTime: '5 min read',
    icon: 'sunny-outline'
  },
  {
    id: '3',
    category: 'Mediterranean Flora',
    title: 'How to Nurture Olive Trees and Cacti Indoors',
    readTime: '6 min read',
    icon: 'leaf-outline'
  },
  {
    id: '4',
    category: 'Propagation',
    title: 'Stem Cuttings in Water: From Snipping to Roots',
    readTime: '3 min read',
    icon: 'git-branch-outline'
  }
];

export default function LearningScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plant Care Academy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroBanner}>
          <Ionicons name="school" size={32} color="#FFFFFF" />
          <Text style={styles.heroTitle}>Master Greenery Care</Text>
          <Text style={styles.heroSub}>
            Curated guides, botanical science, and practical tips from expert horticulturists.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Featured Lessons</Text>

        {ARTICLES.map((art) => (
          <TouchableOpacity key={art.id} style={styles.articleCard}>
            <View style={styles.iconCircle}>
              <Ionicons name={art.icon as any} size={22} color={Colors.primary} />
            </View>
            <View style={styles.articleInfo}>
              <Text style={styles.categoryText}>{art.category}</Text>
              <Text style={styles.articleTitle}>{art.title}</Text>
              <Text style={styles.readTime}>{art.readTime}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
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
  heroBanner: {
    backgroundColor: Colors.primary,
    borderRadius: 22,
    padding: 24,
    marginBottom: 24
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 10
  },
  heroSub: {
    fontSize: 13,
    color: '#BCEECF',
    marginTop: 6,
    lineHeight: 20
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12
  },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EBF7EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  articleInfo: {
    flex: 1
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryMedium,
    textTransform: 'uppercase'
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2
  },
  readTime: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4
  }
});
