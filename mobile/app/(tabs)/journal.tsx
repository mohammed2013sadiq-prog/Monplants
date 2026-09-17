import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/constants/colors';
import EmptyState from '../../src/components/EmptyState';
import { usePlantStore } from '../../src/store/plantStore';

interface CareLogItem {
  id: string;
  action: string;
  plantName: string;
  timeAgo: string;
  notes?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
}

const DEFAULT_LOGS: CareLogItem[] = [
  {
    id: '1',
    action: 'Pruned',
    plantName: 'Kactus (Opuntia)',
    timeAgo: 'Just now',
    notes: 'Removed dried pads to stimulate new spring growth.',
    icon: 'cut-outline',
    iconBg: '#FFEDD5',
    iconColor: '#C2410C'
  },
  {
    id: '2',
    action: 'Watered',
    plantName: 'Olivier (Olea europaea)',
    timeAgo: '5 days ago',
    notes: 'Deep watering after checking soil dryness.',
    icon: 'water-outline',
    iconBg: '#CCFBF1',
    iconColor: '#0F766E'
  },
  {
    id: '3',
    action: 'Fertilized',
    plantName: 'Menthe Marocaine',
    timeAgo: '2 weeks ago',
    notes: 'Added balanced organic liquid fertilizer.',
    icon: 'flask-outline',
    iconBg: '#FEF3C7',
    iconColor: '#B45309'
  },
  {
    id: '4',
    action: 'Pruned',
    plantName: 'Hibiscus rosa-sinensis',
    timeAgo: '1 month ago',
    notes: 'Trimmed back top branches for denser foliage.',
    icon: 'cut-outline',
    iconBg: '#FFEDD5',
    iconColor: '#C2410C'
  }
];

export default function JournalScreen() {
  const { journalEntries, fetchJournal, addJournalEntry, myPlants } = usePlantStore();
  const [logs, setLogs] = useState<CareLogItem[]>(DEFAULT_LOGS);

  useEffect(() => {
    fetchJournal();
  }, []);

  const handleQuickLog = (action: string) => {
    Alert.alert(
      `Log ${action}`,
      `Would you like to record a new "${action}" entry in your plant care journal?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            const newEntry: CareLogItem = {
              id: Date.now().toString(),
              action,
              plantName: myPlants[0]?.nickname || 'Arganier',
              timeAgo: 'Just now',
              notes: `Routine ${action.toLowerCase()} completed successfully.`,
              icon:
                action === 'Watered'
                  ? 'water-outline'
                  : action === 'Fertilized'
                  ? 'flask-outline'
                  : 'cut-outline',
              iconBg:
                action === 'Watered'
                  ? '#CCFBF1'
                  : action === 'Fertilized'
                  ? '#FEF3C7'
                  : '#FFEDD5',
              iconColor:
                action === 'Watered'
                  ? '#0F766E'
                  : action === 'Fertilized'
                  ? '#B45309'
                  : '#C2410C'
            };
            setLogs([newEntry, ...logs]);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Care Journal</Text>
          <Text style={styles.headerSub}>Timeline of watering, feeding, and pruning</Text>
        </View>

        {/* Quick Log Action */}
        <TouchableOpacity
          style={styles.addLogBtn}
          onPress={() => handleQuickLog('Watered')}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addLogBtnText}>Log Care</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Action Chips */}
      <View style={styles.quickChipsRow}>
        <TouchableOpacity
          style={[styles.quickChip, { backgroundColor: '#E0F2FE' }]}
          onPress={() => handleQuickLog('Watered')}
        >
          <Ionicons name="water" size={14} color="#0369A1" />
          <Text style={[styles.quickChipText, { color: '#0369A1' }]}>+ Water</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickChip, { backgroundColor: '#FEF3C7' }]}
          onPress={() => handleQuickLog('Fertilized')}
        >
          <Ionicons name="flask" size={14} color="#92400E" />
          <Text style={[styles.quickChipText, { color: '#92400E' }]}>+ Fertilize</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickChip, { backgroundColor: '#FFEDD5' }]}
          onPress={() => handleQuickLog('Pruned')}
        >
          <Ionicons name="cut" size={14} color="#C2410C" />
          <Text style={[styles.quickChipText, { color: '#C2410C' }]}>+ Prune</Text>
        </TouchableOpacity>
      </View>

      {/* Timeline List */}
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.timelineItem}>
            <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
              <Ionicons name={item.icon} size={20} color={item.iconColor} />
            </View>

            <View style={styles.contentCol}>
              <View style={styles.topRow}>
                <Text style={styles.actionTitle}>{item.action}</Text>
                <Text style={styles.timeAgo}>{item.timeAgo}</Text>
              </View>

              <Text style={styles.plantName}>{item.plantName}</Text>
              {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title="No Care Logs Yet"
            description="Record when you water, fertilize, or prune your plants to build a healthy botanical habit."
            buttonTitle="Log Your First Care"
            onButtonPress={() => handleQuickLog('Watered')}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addLogBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 4
  },
  addLogBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  quickChipsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '700'
  },
  listContent: {
    padding: 20,
    paddingBottom: 40
  },
  timelineItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  contentCol: {
    flex: 1
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  timeAgo: {
    fontSize: 12,
    color: Colors.textMuted
  },
  plantName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryMedium,
    marginTop: 2
  },
  notes: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 6
  }
});
