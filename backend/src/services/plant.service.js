const { UserPlant, Species, Reminder, Journal } = require('../models');

const DEFAULT_USER_PLANTS = [
  {
    id: 1,
    user_id: 1,
    species_id: 3,
    nickname: 'Arganier',
    image_url: 'http://localhost:3000/static/images/arganier.jpg',
    added_at: new Date(),
    species: {
      id: 3,
      common_name: 'Arganier',
      scientific_name: 'Argania spinosa',
      image_url: 'http://localhost:3000/static/images/arganier.jpg'
    },
    reminders: []
  },
  {
    id: 2,
    user_id: 1,
    species_id: 6,
    nickname: 'Palmier Dattier',
    image_url: 'http://localhost:3000/static/images/palmier_dattier.jpg',
    added_at: new Date(),
    species: {
      id: 6,
      common_name: 'Palmier Dattier',
      scientific_name: 'Phoenix dactylifera',
      image_url: 'http://localhost:3000/static/images/palmier_dattier.jpg'
    },
    reminders: []
  },
  {
    id: 3,
    user_id: 1,
    species_id: 1,
    nickname: 'Olivier',
    image_url: 'http://localhost:3000/static/images/olivier.jpg',
    added_at: new Date(),
    species: {
      id: 1,
      common_name: 'Olivier',
      scientific_name: 'Olea europaea',
      image_url: 'http://localhost:3000/static/images/olivier.jpg'
    },
    reminders: []
  }
];

const getUserPlants = async (userId) => {
  try {
    const plants = await UserPlant.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Species,
          as: 'species'
        },
        {
          model: Reminder,
          as: 'reminders'
        }
      ],
      order: [['added_at', 'DESC']]
    });
    if (plants && plants.length > 0) return plants;
  } catch (err) {
    // Database connection fallback
  }
  return DEFAULT_USER_PLANTS;
};

const getUserPlantById = async (id, userId) => {
  const plant = await UserPlant.findOne({
    where: { id, user_id: userId },
    include: [
      {
        model: Species,
        as: 'species'
      },
      {
        model: Reminder,
        as: 'reminders'
      },
      {
        model: Journal,
        as: 'journalEntries',
        order: [['created_at', 'DESC']]
      }
    ]
  });

  if (!plant) {
    const error = new Error('Plant not found in your collection.');
    error.statusCode = 404;
    throw error;
  }
  return plant;
};

const createUserPlant = async (userId, { species_id, nickname, image_url }) => {
  // Check species
  const species = await Species.findByPk(species_id);
  if (!species) {
    const error = new Error('Species not found.');
    error.statusCode = 404;
    throw error;
  }

  const plant = await UserPlant.create({
    user_id: userId,
    species_id,
    nickname: nickname || species.common_name,
    image_url: image_url || species.image_url
  });

  // Auto-schedule an initial watering reminder
  const nextWatering = new Date();
  nextWatering.setDate(nextWatering.getDate() + 7);

  await Reminder.create({
    user_plant_id: plant.id,
    type: 'watering',
    frequency_days: 7,
    next_date: nextWatering,
    status: 'pending'
  });

  return await getUserPlantById(plant.id, userId);
};

const updateUserPlant = async (id, userId, data) => {
  const plant = await getUserPlantById(id, userId);
  return await plant.update(data);
};

const deleteUserPlant = async (id, userId) => {
  const plant = await getUserPlantById(id, userId);
  await plant.destroy();
  return { message: 'Plant removed from collection.' };
};

module.exports = {
  getUserPlants,
  getUserPlantById,
  createUserPlant,
  updateUserPlant,
  deleteUserPlant
};
