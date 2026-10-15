const plantService = require('../services/plant.service');

const getAll = async (req, res, next) => {
  try {
    const plants = await plantService.getUserPlants(req.user.id);
    res.status(200).json({
      success: true,
      count: plants.length,
      data: plants
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const plant = await plantService.getUserPlantById(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      data: plant
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { species_id, nickname, image_url } = req.body;
    if (!species_id) {
      return res.status(400).json({
        success: false,
        message: 'species_id is required.'
      });
    }

    const plant = await plantService.createUserPlant(req.user.id, {
      species_id,
      nickname,
      image_url
    });

    res.status(201).json({
      success: true,
      data: plant
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const plant = await plantService.updateUserPlant(req.params.id, req.user.id, req.body);
    res.status(200).json({
      success: true,
      data: plant
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await plantService.deleteUserPlant(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
