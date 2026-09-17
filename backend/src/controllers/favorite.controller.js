const { Favorite, Species } = require('../models');

const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Species,
          as: 'species'
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    next(error);
  }
};

const addFavorite = async (req, res, next) => {
  try {
    const { species_id } = req.body;
    if (!species_id) {
      return res.status(400).json({
        success: false,
        message: 'species_id is required.'
      });
    }

    // Check if already favorited
    const existing = await Favorite.findOne({
      where: { user_id: req.user.id, species_id }
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Species already in favorites.',
        data: existing
      });
    }

    const favorite = await Favorite.create({
      user_id: req.user.id,
      species_id
    });

    const fullFavorite = await Favorite.findByPk(favorite.id, {
      include: [{ model: Species, as: 'species' }]
    });

    res.status(201).json({
      success: true,
      data: fullFavorite
    });
  } catch (error) {
    next(error);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    const { speciesId } = req.params;
    const favorite = await Favorite.findOne({
      where: { user_id: req.user.id, species_id: speciesId }
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found.'
      });
    }

    await favorite.destroy();
    res.status(200).json({
      success: true,
      message: 'Species removed from favorites.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite
};
