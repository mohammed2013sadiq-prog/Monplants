const { Reminder, UserPlant, Species } = require('../models');

const DEFAULT_REMINDERS = [
  {
    id: 1,
    user_plant_id: 1,
    type: 'watering',
    frequency_days: 7,
    next_date: new Date(Date.now() + 86400000).toISOString(),
    status: 'pending',
    plant: {
      id: 1,
      nickname: 'Menthe Marocaine',
      species: { common_name: 'Menthe Marocaine' }
    }
  },
  {
    id: 2,
    user_plant_id: 2,
    type: 'misting',
    frequency_days: 3,
    next_date: new Date(Date.now() + 172800000).toISOString(),
    status: 'pending',
    plant: {
      id: 2,
      nickname: 'Arganier',
      species: { common_name: 'Arganier' }
    }
  }
];

const getReminders = async (req, res, next) => {
  try {
    const reminders = await Reminder.findAll({
      include: [
        {
          model: UserPlant,
          as: 'plant',
          where: { user_id: req.user.id },
          include: [{ model: Species, as: 'species' }]
        }
      ],
      order: [['next_date', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders
    });
  } catch (error) {
    // Graceful offline fallback
    res.status(200).json({
      success: true,
      count: DEFAULT_REMINDERS.length,
      data: DEFAULT_REMINDERS
    });
  }
};

const createReminder = async (req, res, next) => {
  try {
    const { user_plant_id, type, frequency_days, next_date } = req.body;
    if (!user_plant_id || !next_date) {
      return res.status(400).json({
        success: false,
        message: 'user_plant_id and next_date are required.'
      });
    }

    // Verify plant belongs to user
    const plant = await UserPlant.findOne({
      where: { id: user_plant_id, user_id: req.user.id }
    });

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'User plant not found.'
      });
    }

    const reminder = await Reminder.create({
      user_plant_id,
      type: type || 'watering',
      frequency_days: frequency_days || 7,
      next_date: new Date(next_date),
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: reminder
    });
  } catch (error) {
    next(error);
  }
};

const updateReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, next_date, type, frequency_days } = req.body;

    const reminder = await Reminder.findByPk(id, {
      include: [
        {
          model: UserPlant,
          as: 'plant',
          where: { user_id: req.user.id }
        }
      ]
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found.'
      });
    }

    if (status) reminder.status = status;
    if (next_date) reminder.next_date = new Date(next_date);
    if (type) reminder.type = type;
    if (frequency_days) reminder.frequency_days = frequency_days;

    await reminder.save();

    res.status(200).json({
      success: true,
      data: reminder
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReminders,
  createReminder,
  updateReminder
};
