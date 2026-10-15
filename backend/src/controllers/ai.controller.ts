const aiService = require('../services/ai.service');

const identify = async (req: any, res: any, next: any) => {
  try {
    const { image } = req.body;
    const result = await aiService.identifyPlant(image);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const chat = async (req: any, res: any, next: any) => {
  try {
    const { message } = req.body;
    const result = await aiService.chatResponse(message);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getStatus = async (req: any, res: any) => {
  const hasDeepSeek = !!process.env.DEEPSEEK_API_KEY &&
                      process.env.DEEPSEEK_API_KEY.trim() !== '' &&
                      !process.env.DEEPSEEK_API_KEY.includes('your_deepseek_api_key');
  const hasGemini = !!process.env.GEMINI_API_KEY &&
                    process.env.GEMINI_API_KEY.trim() !== '' &&
                    !process.env.GEMINI_API_KEY.includes('your_gemini_api_key');

  const provider = hasDeepSeek
    ? 'DeepSeek'
    : (hasGemini ? 'Google Gemini (fallback)' : 'DeepSeek (Offline Fallback)');
  const model = hasDeepSeek
    ? (process.env.DEEPSEEK_MODEL || 'deepseek-chat')
    : (hasGemini ? 'gemini-flash-latest' : 'botanical-expert-v1');

  res.status(200).json({
    status: 'ok',
    provider,
    primaryProvider: 'DeepSeek',
    isRealAIActive: hasDeepSeek || hasGemini,
    isDeepSeekActive: hasDeepSeek,
    isGeminiFallbackActive: hasGemini,
    model,
    features: ['botanical_vision_identification', 'conversational_botanist_chat']
  });
};

module.exports = {
  identify,
  chat,
  getStatus
};
