import { Species } from '../types/species';

export const CATALOG_SPECIES: Species[] = [
  {
    id: 1,
    scientific_name: 'Olea europaea',
    common_name: 'Olivier',
    family: 'Oleaceae',
    description:
      "Symbole universel de paix, de longévité et de sagesse, l'Olivier prospère dans tout le bassin méditerranéen marocain (Meknès, Fès, Beni Mellal). Arbre noble au feuillage argenté persistant, il produit de savoureuses olives de table et une huile d'olive vierge extra dorée réputée pour ses précieux antioxydants et ses bienfaits cardiovasculaires.",
    light_needs: 'Plein Soleil. Préfère une exposition directe, chaude et bien aérée.',
    watering_frequency: 'Faible. Arrosage tous les 10 à 14 jours ; tolère la sécheresse une fois établi.',
    soil_type: 'Sol rocailleux, calcaire ou caillouteux, très filtrant et drainant.',
    climate_adaptation: 'Climat méditerranéen chaud. Résiste au vent et au froid jusqu\'à -8°C.',
    toxicity_level: 'Non-toxique pour les animaux',
    care_difficulty: 'Facile',
    image_url: 'olivier'
  },
  {
    id: 3,
    scientific_name: 'Argania spinosa',
    common_name: 'Arganier',
    family: 'Sapotaceae',
    description:
      "Endémique du sud-ouest marocain (Souss-Massa) et classé au patrimoine mondial de l'UNESCO, l'Arganier est l'arbre emblématique du Maroc. Connu comme « l'arbre de vie », il défie l'aridité et produit des fruits précieux dont les amandons fournissent la célèbre huile d'argan, véritable or liquide aux vertus cosmétiques et nutritionnelles uniques au monde.",
    light_needs: 'Plein Soleil. Préfère 6 à 8 heures d\'ensoleillement direct quotidien.',
    watering_frequency: 'Très faible. Arroser modérément tous les 12 à 15 jours en laissant sécher le sol.',
    soil_type: 'Sol calcaire, aride, pauvre et parfaitement drainé.',
    climate_adaptation: 'Climat aride et semi-aride méditerranéen. Grande résistance thermique.',
    toxicity_level: 'Non-toxique pour les animaux',
    care_difficulty: 'Facile',
    image_url: 'arganier'
  },
  {
    id: 6,
    scientific_name: 'Phoenix dactylifera',
    common_name: 'Palmier Dattier',
    family: 'Arecaceae',
    description:
      "Pilier providentiel des oasis sahariennes et marocaines (vallées du Drâa, du Ziz, Zagora et Tafilalet), le Palmier Dattier est le roi des paysages du Sud. Il apporte une canopée protectrice sous laquelle s'épanouit l'agriculture oasienne et produit des régimes de dattes royales (Medjool, Boufeggous) riches en énergie.",
    light_needs: 'Plein Soleil direct. Exige un ensoleillement maximal et une chaleur rayonnante.',
    watering_frequency: 'Modéré. Arrosage abondant au pied 1 fois par semaine par temps chaud.',
    soil_type: 'Sol sablonneux profond, meuble et très perméable.',
    climate_adaptation: 'Climat aride et chaud désertique. Supporte des chaleurs jusqu\'à 45°C.',
    toxicity_level: 'Non-toxique pour les animaux',
    care_difficulty: 'Facile / Modéré',
    image_url: 'palmier_dattier'
  },
  {
    id: 2,
    scientific_name: 'Hibiscus rosa-sinensis',
    common_name: 'Hibiscus',
    family: 'Malvaceae',
    description:
      "Fleur flamboyante des riads et cours intérieures marocaines, l'Hibiscus émerveille par ses grandes corolles rouges écarlates et son feuillage vert brillant. Utilisé en ornement et réputé en infusion rafraîchissante et tonique (Karkadé), il apporte une élégance végétale incomparable.",
    light_needs: 'Lumière vive ou soleil matinal doux.',
    watering_frequency: 'Fréquent. Garder le terreau frais sans laisser d\'eau stagnante.',
    soil_type: 'Terreau fertile, riche en matière organique et bien aéré.',
    climate_adaptation: 'Subtropical. À abriter impérativement en dessous de 10°C.',
    toxicity_level: 'Non-toxique pour les animaux',
    care_difficulty: 'Facile',
    image_url: 'hibiscus'
  },
  {
    id: 4,
    scientific_name: 'Opuntia ficus-indica',
    common_name: 'Kactus (Figuier de Barbarie)',
    family: 'Cactaceae',
    description:
      "Plante succulente aux raquettes généreuses emblématique des collines et vallées marocaines (Aknari / El Hendi). Formidable réservoir d'eau dans les zones sèches, elle offre des fruits juteux pleins de vitamines et des pépins pressés en une huile précieuse anti-âge.",
    light_needs: 'Plein Soleil direct et continu.',
    watering_frequency: 'Très rare. Une fois toutes les 3 à 4 semaines en période estivale.',
    soil_type: 'Substrat minéral pour cactus, sableux et très drainé.',
    climate_adaptation: 'Climat aride et désertique. Excellente résistance à la chaleur.',
    toxicity_level: 'Non-toxique (attention aux épines)',
    care_difficulty: 'Très facile',
    image_url: 'cactus'
  },
  {
    id: 5,
    scientific_name: 'Mentha spicata',
    common_name: 'Menthe Marocaine',
    family: 'Lamiaceae',
    description:
      "La menthe verte marocaine (Nanah) est l'âme de l'hospitalité maghrébine et l'ingrédient roi du traditionnel thé à la menthe. Feuilles intensément parfumées au goût frais et digestif incomparable.",
    light_needs: 'Mi-ombre ou soleil doux.',
    watering_frequency: 'Arrosage régulier. Tous les 2-3 jours pour maintenir le substrat frais.',
    soil_type: 'Terreau humifère, riche et humide.',
    climate_adaptation: 'Tempéré à chaud.',
    toxicity_level: 'Non-toxique',
    care_difficulty: 'Très facile',
    image_url: 'menthe'
  }
];

export function findSpeciesById(id: number | string): Species {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  const found = CATALOG_SPECIES.find((s) => s.id === numId);
  return found || CATALOG_SPECIES[0]; // defaults to Olivier
}

export function findSpeciesByName(name: string): Species | undefined {
  if (!name) return undefined;
  const lower = name.toLowerCase();
  return CATALOG_SPECIES.find(
    (s) =>
      s.common_name.toLowerCase().includes(lower) ||
      s.scientific_name.toLowerCase().includes(lower) ||
      lower.includes(s.common_name.toLowerCase())
  );
}
