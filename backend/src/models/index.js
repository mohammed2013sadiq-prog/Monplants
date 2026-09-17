const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const User = require('./User');
const Species = require('./Species');
const UserPlant = require('./UserPlant');
const Favorite = require('./Favorite');
const Reminder = require('./Reminder');
const Journal = require('./Journal');

// --- Relationships ---

// User Relationships
User.hasMany(UserPlant, { foreignKey: 'user_id', as: 'plants', onDelete: 'CASCADE' });
UserPlant.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Favorite, { foreignKey: 'user_id', as: 'favorites', onDelete: 'CASCADE' });
Favorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Species Relationships
Species.hasMany(UserPlant, { foreignKey: 'species_id', as: 'userPlants', onDelete: 'CASCADE' });
UserPlant.belongsTo(Species, { foreignKey: 'species_id', as: 'species' });

Species.hasMany(Favorite, { foreignKey: 'species_id', as: 'favoritedBy', onDelete: 'CASCADE' });
Favorite.belongsTo(Species, { foreignKey: 'species_id', as: 'species' });

// UserPlant Relationships
UserPlant.hasMany(Reminder, { foreignKey: 'user_plant_id', as: 'reminders', onDelete: 'CASCADE' });
Reminder.belongsTo(UserPlant, { foreignKey: 'user_plant_id', as: 'plant' });

UserPlant.hasMany(Journal, { foreignKey: 'user_plant_id', as: 'journalEntries', onDelete: 'CASCADE' });
Journal.belongsTo(UserPlant, { foreignKey: 'user_plant_id', as: 'plant' });

// Initial Seed Function for Mediterranean / Moroccan Flora
const seedInitialData = async () => {
  try {
    const count = await Species.count();
    if (count === 0) {
      console.log('Seeding initial plant species...');
      await Species.bulkCreate([
        {
          scientific_name: 'Olea europaea',
          common_name: 'Olivier',
          family: 'Oleaceae',
          description:
            "Symbole universel de paix, de longévité et de sagesse, l'Olivier prospère dans tout le bassin méditerranéen marocain (Meknès, Fès, Beni Mellal). Arbre noble au feuillage argenté persistant, il produit de savoureuses olives de table et une huile d'olive vierge extra dorée réputée pour ses précieux antioxydants.",
          light_needs: 'Plein Soleil. Préfère une exposition directe, chaude et bien aérée.',
          watering_frequency: 'Faible. Arrosage tous les 10 à 14 jours ; tolère la sécheresse une fois établi.',
          soil_type: 'Sol rocailleux, calcaire ou caillouteux, très filtrant et drainant.',
          climate_adaptation: 'Climat méditerranéen chaud. Résiste au vent et au froid jusqu\'à -8°C.',
          toxicity_level: 'Non-toxique pour les animaux',
          care_difficulty: 'Facile',
          image_url: 'http://localhost:3000/static/images/olivier.jpg'
        },
        {
          scientific_name: 'Hibiscus rosa-sinensis',
          common_name: 'Hibiscus',
          family: 'Malvaceae',
          description:
            "Fleur flamboyante des riads et cours intérieures marocaines, l'Hibiscus émerveille par ses grandes corolles rouges écarlates et son feuillage vert brillant. Utilisé en ornement et réputé en infusion rafraîchissante et tonique (Karkadé).",
          light_needs: 'Lumière vive ou soleil matinal doux.',
          watering_frequency: 'Fréquent. Garder le terreau frais sans laisser d\'eau stagnante.',
          soil_type: 'Terreau fertile, riche en matière organique et bien aéré.',
          climate_adaptation: 'Subtropical. À abriter impérativement en dessous de 10°C.',
          toxicity_level: 'Non-toxique pour les animaux',
          care_difficulty: 'Facile',
          image_url: 'http://localhost:3000/static/images/hibiscus.png'
        },
        {
          scientific_name: 'Argania spinosa',
          common_name: 'Arganier',
          family: 'Sapotaceae',
          description:
            "Endémique du sud-ouest marocain (Souss-Massa) et classé au patrimoine mondial de l'UNESCO, l'Arganier est l'arbre emblématique du Maroc. Connu comme « l'arbre de vie », il défie l'aridité et produit des fruits précieux dont les amandons fournissent la célèbre huile d'argan, véritable or liquide aux vertus cosmétiques et nutritionnelles.",
          light_needs: 'Plein Soleil. Préfère 6 à 8 heures d\'ensoleillement direct quotidien.',
          watering_frequency: 'Très faible. Arroser modérément tous les 12 à 15 jours en laissant sécher le sol.',
          soil_type: 'Sol calcaire, aride, pauvre et parfaitement drainé.',
          climate_adaptation: 'Climat aride et semi-aride méditerranéen. Grande résistance thermique.',
          toxicity_level: 'Non-toxique pour les animaux',
          care_difficulty: 'Facile',
          image_url: 'http://localhost:3000/static/images/arganier.jpg'
        },
        {
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
          image_url: 'http://localhost:3000/static/images/cactus.png'
        },
        {
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
          image_url: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=800&q=80'
        },
        {
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
          image_url: 'http://localhost:3000/static/images/palmier_dattier.jpg'
        }
      ]);
      console.log('Seeded initial plant species successfully.');
    }
    // Seed Default Demo User if none exists
    const userCount = await User.count();
    if (userCount === 0) {
      console.log('Seeding demo botanical explorer user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      await User.create({
        full_name: 'Botanical Explorer',
        email: 'demo@moplants.app',
        password: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      });
      console.log('Seeded demo user successfully (demo@moplants.app / password123).');
    }
  } catch (error) {
    console.error('Error during initial data seeding:', error.message);
  }
};

module.exports = {
  sequelize,
  User,
  Species,
  UserPlant,
  Favorite,
  Reminder,
  Journal,
  seedInitialData
};
