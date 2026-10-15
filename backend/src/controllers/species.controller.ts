const speciesService = require('../services/species.service');

const getAll = async (req, res, next) => {
  try {
    const { search } = req.query;
    const species = await speciesService.getAllSpecies(search);
    res.status(200).json({
      success: true,
      count: species.length,
      data: species
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const species = await speciesService.getSpeciesById(req.params.id);
    res.status(200).json({
      success: true,
      data: species
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const species = await speciesService.createSpecies(req.body);
    res.status(201).json({
      success: true,
      data: species
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const species = await speciesService.updateSpecies(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: species
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await speciesService.deleteSpecies(req.params.id);
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
