import { useEffect, useState } from 'react';
import { usePlantStore } from '../store/plantStore';

export const useSpecies = (initialSearch: string = '') => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const { speciesList, selectedSpecies, isLoading, error, fetchSpecies, getSpeciesDetails } = usePlantStore();

  useEffect(() => {
    fetchSpecies(searchTerm);
  }, [searchTerm]);

  return {
    speciesList,
    selectedSpecies,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    refetch: () => fetchSpecies(searchTerm),
    getSpeciesDetails
  };
};

export default useSpecies;
