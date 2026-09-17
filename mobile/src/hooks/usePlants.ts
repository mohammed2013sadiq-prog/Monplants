import { useEffect } from 'react';
import { usePlantStore } from '../store/plantStore';

export const usePlants = () => {
  const {
    myPlants,
    favorites,
    reminders,
    journalEntries,
    lastIdentification,
    isLoading,
    error,
    fetchMyPlants,
    addPlantToCollection,
    removePlantFromCollection,
    fetchFavorites,
    toggleFavorite,
    isFavorite,
    fetchReminders,
    completeReminder,
    fetchJournal,
    addJournalEntry,
    identifyPlantPhoto
  } = usePlantStore();

  useEffect(() => {
    fetchMyPlants();
    fetchFavorites();
    fetchReminders();
    fetchJournal();
  }, []);

  return {
    myPlants,
    favorites,
    reminders,
    journalEntries,
    lastIdentification,
    isLoading,
    error,
    refetchAll: () => {
      fetchMyPlants();
      fetchFavorites();
      fetchReminders();
      fetchJournal();
    },
    addPlantToCollection,
    removePlantFromCollection,
    toggleFavorite,
    isFavorite,
    completeReminder,
    addJournalEntry,
    identifyPlantPhoto
  };
};

export default usePlants;
