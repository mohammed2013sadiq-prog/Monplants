export interface Species {
  id: number;
  scientific_name: string;
  common_name: string;
  family?: string;
  description?: string;
  light_needs?: string;
  watering_frequency?: string;
  soil_type?: string;
  climate_adaptation?: string;
  toxicity_level?: string;
  care_difficulty?: string;
  image_url?: string;
  created_at?: string;
}

export interface IdentificationResult {
  species: {
    id: number;
    commonName: string;
    scientificName: string;
    family?: string;
    description?: string;
    lightNeeds?: string;
    wateringFrequency?: string;
    soilType?: string;
    climateAdaptation?: string;
    toxicityLevel?: string;
    careDifficulty?: string;
    imageUrl?: string;
  };
  confidence: number;
  similarSpecies?: Array<{
    id: number;
    commonName: string;
    scientificName: string;
    imageUrl?: string;
  }>;
}
