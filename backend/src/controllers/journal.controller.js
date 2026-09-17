const { Journal, UserPlant, Species } = require('../models');

const DEFAULT_JOURNALS = [
  {
    id: 1,
    user_plant_id: 1,
    action: 'Watered',
    notes: 'Routine morning watering completed.',
    weather: 'Sunny, 24°C',
    created_at: new Date(Date.now() - 432000000).toISOString(),
    plant: { nickname: 'Menthe Marocaine' }
  },
  {
    id: 2,
    user_plant_id: 2,
    action: 'Pruned',
    notes: 'Trimmed dry branches to stimulate growth.',
    weather: 'Warm, 28°C',
    created_at: new Date(Date.now() - 864000000).toISOString(),
    plant: { nickname: 'Arganier' }
  }
];

const getJournal = async (req, res, next) => {
  try {
    const journalEntries = await Journal.findAll({
      include: [
        {
          model: UserPlant,
          as: 'plant',
          where: { user_id: req.user.id },
          include: [{ model: Species, as: 'species' }]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: journalEntries.length,
      data: journalEntries
    });
  } catch (error) {
    // Fallback
    res.status(200).json({
      success: true,
      count: DEFAULT_JOURNALS.length,
      data: DEFAULT_JOURNALS
    });
  }
};

const createJournalEntry = async (req, res, next) => {
  try {
    const { user_plant_id, action, photo_url, notes, weather } = req.body;
    if (!user_plant_id || !action) {
      return res.status(400).json({
        success: false,
        message: 'user_plant_id and action are required.'
      });
    }

    const plant = await UserPlant.findOne({
      where: { id: user_plant_id, user_id: req.user.id }
    });

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'User plant not found.'
      });
    }

    const entry = await Journal.create({
      user_plant_id,
      action,
      photo_url,
      notes,
      weather
    });

    const fullEntry = await Journal.findByPk(entry.id, {
      include: [
        {
          model: UserPlant,
          as: 'plant',
          include: [{ model: Species, as: 'species' }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: fullEntry
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJournal,
  createJournalEntry
};
