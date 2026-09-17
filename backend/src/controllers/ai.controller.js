const aiService = require('../services/ai.service');

const identify = async (req, res, next) => {
  try {
    const { image } = req.body;
    const result = await aiService.identifyPlant(image);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const chat = async (req, res, next) => {
  try {
    const { message } = req.body;
    const result = await aiService.chatResponse(message);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  identify,
  chat
};
