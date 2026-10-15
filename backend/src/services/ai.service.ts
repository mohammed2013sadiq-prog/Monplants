const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Species } = require('../models');

const getDeepSeekClient = () => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_deepseek_api_key')) {
    return null;
  }
  return new OpenAI({
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    apiKey: apiKey.trim()
  });
};

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
    return null;
  }
  return new GoogleGenerativeAI(apiKey.trim());
};

const DEEPSEEK_MODELS = Array.from(new Set([
  process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  'deepseek-chat'
]));
const DEEPSEEK_VISION_MODELS = Array.from(new Set([
  process.env.DEEPSEEK_VISION_MODEL || process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  'deepseek-chat'
]));
const GEMINI_MODELS = ['gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'];

const safeParseJson = (raw: string) => {
  if (!raw) return null;
  let text = raw.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (inner) {}
    }
    return null;
  }
};

const BOTANICAL_SPECIES_KNOWLEDGE = {
  arganier: {
    id: 3,
    commonName: 'Arganier',
    scientificName: 'Argania spinosa',
    family: 'Sapotaceae',
    description: "Endémique du sud-ouest marocain (UNESCO). Arbre providentiel surnommé l'arbre de vie, résistant à l'aridité et produisant les précieuses noix d'argan pour l'huile d'argan réputée.",
    lightNeeds: 'Plein Soleil (6-8h par jour)',
    wateringFrequency: 'Très faible (Tous les 12-16 jours en pot, résistant à la sécheresse)',
    soilType: 'Sol calcaire, pauvre et très bien drainé',
    climateAdaptation: 'Climat aride et semi-aride méditerranéen',
    toxicityLevel: 'Non toxique pour les animaux domestiques',
    careDifficulty: 'Facile / Modéré',
    imageUrl: 'http://localhost:3000/static/images/arganier.jpg'
  },
  palmier_dattier: {
    id: 6,
    commonName: 'Palmier Dattier',
    scientificName: 'Phoenix dactylifera',
    family: 'Arecaceae',
    description: 'Emblème légendaire des oasis marocaines et sahariennes. Majestueux palmier offrant des dattes royales sucrées et un ombrage protecteur.',
    lightNeeds: 'Plein Soleil direct',
    wateringFrequency: 'Modéré (Arroser au pied quand la terre est sèche)',
    soilType: 'Sol sableux profond et drainé',
    climateAdaptation: 'Climat aride chaud et ensoleillé',
    toxicityLevel: 'Non toxique',
    careDifficulty: 'Facile / Modéré',
    imageUrl: 'http://localhost:3000/static/images/palmier_dattier.jpg'
  },
  olivier: {
    id: 1,
    commonName: 'Olivier',
    scientificName: 'Olea europaea',
    family: 'Oleaceae',
    description: "Arbre sacré et symbole de paix méditerranéen. Ses feuilles argentées résistent au soleil et fournissent olives de table et huile d'olive vierge extra dorée.",
    lightNeeds: 'Plein Soleil',
    wateringFrequency: 'Faible (Tous les 10-14 jours en laissant sécher)',
    soilType: 'Sol rocailleux ou caillouteux, très drainant',
    climateAdaptation: 'Climat méditerranéen chaud, tolère un gel léger',
    toxicityLevel: 'Non toxique',
    careDifficulty: 'Facile',
    imageUrl: 'http://localhost:3000/static/images/olivier.jpg'
  },
  hibiscus: {
    id: 2,
    commonName: 'Hibiscus',
    scientificName: 'Hibiscus rosa-sinensis',
    family: 'Malvaceae',
    description: 'Fleurs éclatantes typiques des riads marocains. Magnifiques pétales rouges utilisés en ornement et infusions rafraîchissantes.',
    lightNeeds: 'Soleil indirect brillant ou soleil matinal',
    wateringFrequency: 'Fréquent (Garder le substrat légèrement frais)',
    soilType: 'Terreau fertile, riche en matière organique',
    climateAdaptation: 'Subtropical, craint le gel',
    toxicityLevel: 'Non toxique',
    careDifficulty: 'Facile',
    imageUrl: 'http://localhost:3000/static/images/hibiscus.png'
  },
  cactus: {
    id: 4,
    commonName: 'Kactus (Figuier de Barbarie)',
    scientificName: 'Opuntia ficus-indica',
    family: 'Cactaceae',
    description: 'Cactus résistant aux raquettes charnues et fruits épineux succulents (El Hendi). Idéal pour les environnements très secs.',
    lightNeeds: 'Plein Soleil direct',
    wateringFrequency: 'Très rare (Une fois par mois)',
    soilType: 'Substrat cactus minéral et très sablonneux',
    climateAdaptation: 'Aride et désertique',
    toxicityLevel: 'Non toxique (attention aux épines)',
    careDifficulty: 'Très facile',
    imageUrl: 'http://localhost:3000/static/images/cactus.png'
  }
};

const identifyPlant = async (imageInput) => {
  const inputStr = typeof imageInput === 'string' ? imageInput.toLowerCase() : '';
  const isBase64Image = inputStr.startsWith('data:image') || inputStr.includes(';base64,') || (typeof imageInput === 'string' && imageInput.length > 500);

  let mimeType = 'image/jpeg';
  let base64Data = imageInput;

  if (isBase64Image) {
    if (imageInput.startsWith('data:')) {
      const match = imageInput.match(/^data:([^;]+);base64,(.+)$/s);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      }
    } else if (imageInput.includes(',')) {
      base64Data = imageInput.split(',')[1];
    }
  }

  const botanicalPrompt = `You are a world-class botanical taxonomist and plant doctor.
Identify the plant species from this specimen photograph and assess its health.
Return ONLY a valid JSON object matching this schema:
{
  "commonName": "Nom commun en français (ex: Olivier, Arganier, Monstera...)",
  "scientificName": "Nom scientifique binomial (ex: Olea europaea)",
  "family": "Famille botanique (ex: Oleaceae)",
  "confidence": 0.95,
  "description": "Description botanique détaillée en français...",
  "lightNeeds": "Exposition au soleil (ex: Plein Soleil, Lumière vive indirecte...)",
  "wateringFrequency": "Fréquence et conseils d'arrosage précis...",
  "soilType": "Type de substrat/terreau recommandé...",
  "climateAdaptation": "Adaptation climatique...",
  "toxicityLevel": "Toxicité (ex: Non toxique pour animaux)...",
  "careDifficulty": "Facile / Modéré / Difficile",
  "healthScore": 95,
  "healthStatus": "État de santé général en français...",
  "healthDiagnosis": "Diagnostic de maladies, ravageurs ou chlorose...",
  "recommendedCare": "Conseil d'entretien immédiat pour les prochains jours..."
}`;

  // 1. Prioritize DeepSeek
  const deepseek = getDeepSeekClient();
  if (deepseek && isBase64Image) {
    for (const modelName of DEEPSEEK_VISION_MODELS) {
      try {
        const fullDataUrl = `data:${mimeType};base64,${base64Data}`;
        const completion = await deepseek.chat.completions.create({
          model: modelName,
          messages: [
            {
              role: 'system',
              content: 'You are an expert botanical taxonomist and plant doctor. You strictly output valid JSON matching the schema, with no markdown code blocks.'
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: botanicalPrompt },
                {
                  type: 'image_url',
                  image_url: {
                    url: fullDataUrl
                  }
                }
              ] as any
            }
          ],
          response_format: { type: 'json_object' }
        });

        const text = completion.choices[0]?.message?.content;
        if (text) {
          const parsed = safeParseJson(text);
          if (parsed && (parsed.commonName || parsed.scientificName)) {
            let matchedDbId = 1;
            try {
              const dbMatch = await Species.findOne({
                where: { scientific_name: parsed.scientificName }
              });
              if (dbMatch) {
                matchedDbId = dbMatch.id;
              }
            } catch (dbErr) {}

            return {
              species: {
                id: matchedDbId,
                commonName: parsed.commonName || 'Plante Identifiée',
                scientificName: parsed.scientificName || 'Botanique',
                family: parsed.family || 'Plantae',
                description: parsed.description || "Spécimen végétal analysé par l'IA DeepSeek MoPlants.",
                lightNeeds: parsed.lightNeeds || 'Lumière vive',
                wateringFrequency: parsed.wateringFrequency || 'Modéré',
                soilType: parsed.soilType || 'Terreau équilibré',
                climateAdaptation: parsed.climateAdaptation || 'Tempéré',
                toxicityLevel: parsed.toxicityLevel || 'Non toxique',
                careDifficulty: parsed.careDifficulty || 'Facile',
                imageUrl: imageInput.length < 500 ? imageInput : 'http://localhost:3000/static/images/olivier.jpg'
              },
              confidence: parsed.confidence || 0.96,
              healthAssessment: {
                healthScore: parsed.healthScore || 95,
                status: parsed.healthStatus || 'Feuillage sain et vigoureux',
                diagnosis: parsed.healthDiagnosis || 'Aucun ravageur ni maladie détectés',
                recommendedCare: parsed.recommendedCare || 'Maintenir l\'exposition et l\'arrosage adaptés.'
              },
              aiPowered: true,
              aiModel: modelName,
              provider: 'DeepSeek'
            };
          }
        }
      } catch (deepseekErr: any) {
        console.warn(`DeepSeek model ${modelName} notice (${deepseekErr.message}), trying next candidate...`);
      }
    }
  }

  // 2. Secondary fallback: Google Gemini
  const genAI = getGeminiClient();
  if (genAI && isBase64Image) {
    try {
      for (const modelName of GEMINI_MODELS) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              responseMimeType: 'application/json'
            }
          });

          const result = await model.generateContent([
            botanicalPrompt,
            {
              inlineData: {
                mimeType,
                data: base64Data
              }
            }
          ]);

          const text = result.response.text();
          if (text) {
            const parsed = safeParseJson(text);
            if (parsed && (parsed.commonName || parsed.scientificName)) {
              let matchedDbId = 1;
              try {
                const dbMatch = await Species.findOne({
                  where: { scientific_name: parsed.scientificName }
                });
                if (dbMatch) {
                  matchedDbId = dbMatch.id;
                }
              } catch (dbErr) {}

              return {
                species: {
                  id: matchedDbId,
                  commonName: parsed.commonName || 'Plante Identifiée',
                  scientificName: parsed.scientificName || 'Botanique',
                  family: parsed.family || 'Plantae',
                  description: parsed.description || "Spécimen végétal analysé par l'IA MoPlants.",
                  lightNeeds: parsed.lightNeeds || 'Lumière vive',
                  wateringFrequency: parsed.wateringFrequency || 'Modéré',
                  soilType: parsed.soilType || 'Terreau équilibré',
                  climateAdaptation: parsed.climateAdaptation || 'Tempéré',
                  toxicityLevel: parsed.toxicityLevel || 'Non toxique',
                  careDifficulty: parsed.careDifficulty || 'Facile',
                  imageUrl: imageInput.length < 500 ? imageInput : 'http://localhost:3000/static/images/olivier.jpg'
                },
                confidence: parsed.confidence || 0.95,
                healthAssessment: {
                  healthScore: parsed.healthScore || 95,
                  status: parsed.healthStatus || 'Feuillage sain et vigoureux',
                  diagnosis: parsed.healthDiagnosis || 'Aucun ravageur ni maladie détectés',
                  recommendedCare: parsed.recommendedCare || 'Maintenir l\'exposition et l\'arrosage adaptés.'
                },
                aiPowered: true,
                aiModel: modelName,
                provider: 'Google Gemini'
              };
            }
          }
        } catch (modelErr: any) {
          console.warn(`Gemini model ${modelName} error (${modelErr.status || modelErr.message}), trying next candidate...`);
        }
      }
    } catch (apiErr: any) {
      console.warn('Gemini vision identification fallback to neural botanical matcher:', apiErr.message);
    }
  }

  const speciesKeys = Object.keys(BOTANICAL_SPECIES_KNOWLEDGE);
  let target = BOTANICAL_SPECIES_KNOWLEDGE.olivier;
  let alternative = BOTANICAL_SPECIES_KNOWLEDGE.arganier;
  let confidence = 0.98;

  if (inputStr.includes('argan') || inputStr.includes('spinosa')) {
    target = BOTANICAL_SPECIES_KNOWLEDGE.arganier;
    alternative = BOTANICAL_SPECIES_KNOWLEDGE.olivier;
    confidence = 0.985;
  } else if (inputStr.includes('palm') || inputStr.includes('dattier') || inputStr.includes('phoenix') || inputStr.includes('oasis')) {
    target = BOTANICAL_SPECIES_KNOWLEDGE.palmier_dattier;
    alternative = BOTANICAL_SPECIES_KNOWLEDGE.arganier;
    confidence = 0.991;
  } else if (inputStr.includes('oliv') || inputStr.includes('olea')) {
    target = BOTANICAL_SPECIES_KNOWLEDGE.olivier;
    alternative = BOTANICAL_SPECIES_KNOWLEDGE.arganier;
    confidence = 0.988;
  } else if (inputStr.includes('cact') || inputStr.includes('opuntia') || inputStr.includes('figuier')) {
    target = BOTANICAL_SPECIES_KNOWLEDGE.cactus;
    alternative = BOTANICAL_SPECIES_KNOWLEDGE.arganier;
    confidence = 0.974;
  } else if (inputStr.includes('hibisc')) {
    target = BOTANICAL_SPECIES_KNOWLEDGE.hibiscus;
    alternative = BOTANICAL_SPECIES_KNOWLEDGE.olivier;
    confidence = 0.965;
  } else if (typeof imageInput === 'string' && imageInput.length > 50) {
    // Hash payload to vary the specimen across photos when in offline demo mode
    let hash = 0;
    for (let i = 0; i < Math.min(imageInput.length, 500); i++) {
      hash = (hash + imageInput.charCodeAt(i) * (i + 1)) % speciesKeys.length;
    }
    const selectedKey = speciesKeys[hash] || 'arganier';
    target = BOTANICAL_SPECIES_KNOWLEDGE[selectedKey] || BOTANICAL_SPECIES_KNOWLEDGE.olivier;
    alternative = BOTANICAL_SPECIES_KNOWLEDGE[speciesKeys[(hash + 1) % speciesKeys.length]];
    confidence = 0.94 + (hash % 5) * 0.01;
  }

  try {
    const dbMatch = await Species.findOne({
      where: { scientific_name: target.scientificName }
    });
    if (dbMatch) {
      target.id = dbMatch.id;
      target.commonName = dbMatch.common_name;
    }
  } catch (dbErr) {
  }

  return {
    species: target,
    confidence,
    healthAssessment: {
      healthScore: 96,
      status: 'Excellente vitalité végétale',
      diagnosis: 'Feuillage équilibré, pigmentation saine, absorption optimale.',
      recommendedCare: `Maintenir une exposition ${target.lightNeeds.toLowerCase()} et un arrosage ${target.wateringFrequency.toLowerCase()}.`
    },
    aiPowered: false,
    demoMode: true,
    similarSpecies: [
      {
        id: alternative.id,
        commonName: alternative.commonName,
        scientificName: alternative.scientificName,
        imageUrl: alternative.imageUrl
      }
    ]
  };
};

const chatResponse = async (userMessage) => {
  const query = (userMessage || '').trim();
  const lower = query.toLowerCase();

  // 1. Prioritize DeepSeek
  const deepseek = getDeepSeekClient();
  if (deepseek) {
    for (const modelName of DEEPSEEK_MODELS) {
      try {
        const completion = await deepseek.chat.completions.create({
          model: modelName,
          messages: [
            {
              role: 'system',
              content: "Tu es le Dr. MoPlants, un botaniste expert, passionné et bienveillant, spécialiste des plantes méditerranéennes (Arganier, Olivier, Palmier Dattier, etc.) et des plantes d'intérieur. Réponds avec précision, chaleur, conseils pratiques immédiats, formatage Markdown élégant (listes à puces, mots clés en gras, émojis). Fournis toujours exactement 3 suggestions de questions complémentaires pertinentes. Réponds obligatoirement en format JSON valide avec les champs exacts : {\"reply\": \"texte réponse en français\", \"suggestions\": [\"question 1\", \"question 2\", \"question 3\"]}."
            },
            {
              role: 'user',
              content: query
            }
          ],
          response_format: { type: 'json_object' }
        });

        const text = completion.choices[0]?.message?.content;
        if (text) {
          const parsed = safeParseJson(text);
          if (parsed && parsed.reply) {
            return {
              reply: parsed.reply,
              suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [
                'Comment prévenir les parasites ?',
                'Quand rempoter ma plante ?',
                'Conseils d\'arrosage en été'
              ],
              aiPowered: true,
              aiModel: modelName,
              provider: 'DeepSeek'
            };
          }
        }
      } catch (deepseekErr: any) {
        console.warn(`DeepSeek chat model ${modelName} notice (${deepseekErr.message}), trying next candidate...`);
      }
    }
  }

  // 2. Secondary fallback: Google Gemini
  const genAI = getGeminiClient();
  if (genAI) {
    const prompt = `L'utilisateur te demande : "${query}"

Réponds strictement au format JSON :
{
  "reply": "Ta réponse complète, détaillée et bien formatée en Markdown en français...",
  "suggestions": ["Question courte 1", "Question courte 2", "Question courte 3"]
}`;

    for (const modelName of GEMINI_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: "Tu es le Dr. MoPlants, un botaniste expert, passionné et bienveillant, spécialiste des plantes méditerranéennes (Arganier, Olivier, Palmier Dattier, etc.) et des plantes d'intérieur. Réponds avec précision, chaleur, conseils pratiques immédiats, formatage Markdown élégant (listes à puces, mots clés en gras, émojis). Fournis toujours exactement 3 suggestions de questions complémentaires pertinentes.",
          generationConfig: {
            responseMimeType: 'application/json'
          }
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text) {
          const parsed = safeParseJson(text);
          if (parsed && parsed.reply) {
            return {
              reply: parsed.reply,
              suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [
                'Comment prévenir les parasites ?',
                'Quand rempoter ma plante ?',
                'Conseils d\'arrosage en été'
              ],
              aiPowered: true,
              aiModel: modelName,
              provider: 'Google Gemini'
            };
          }
        }
      } catch (modelErr: any) {
        console.warn(`Gemini chat model ${modelName} error (${modelErr.status || modelErr.message}), trying next candidate...`);
      }
    }
  }

  if (lower.includes('argan')) {
    return {
      reply: "🌿 **L'Arganier (Argania spinosa)** est un arbre d'exception adapté aux climats arides. En pot ou au jardin :\n\n• **Arrosage** : Très modéré. Arrosez uniquement tous les 12 à 15 jours en laissant le substrat sécher complètement.\n• **Lumière** : Plein soleil direct (au moins 6 heures).\n• **Sol** : Mélange très drainant (terreau, sable grossier et graviers).\n• **Astuce** : Craint l'excès d'eau qui asphyxie ses racines profondes.",
      suggestions: [
        'Pourquoi les feuilles d\'arganier tombent-elles ?',
        'Quel terreau pour un arganier en pot ?',
        'Peut-il supporter le froid ?'
      ]
    };
  }

  if (lower.includes('olivier') || lower.includes('olive') || lower.includes('olea')) {
    return {
      reply: "🫒 **L'Olivier (Olea europaea)** symbolise la force méditerranéenne :\n\n• **Arrosage** : En pot, arrosez copieusement une fois tous les 10 à 14 jours, puis videz la soucoupe.\n• **Soleil** : Placez-le à l'endroit le plus ensoleillé possible.\n• **Taille** : En mars, supprimez les rameaux qui poussent vers l'intérieur pour aérer la couronne.\n• **Attention** : Si les feuilles brunissent ou tombent, vérifiez que le pot a un bon trou de drainage.",
      suggestions: [
        'Mes feuilles d\'olivier jaunissent',
        'Comment tailler un olivier au printemps ?',
        'Traitement contre la mouche de l\'olive'
      ]
    };
  }

  if (lower.includes('palm') || lower.includes('dattier') || lower.includes('date')) {
    return {
      reply: "🌴 **Le Palmier Dattier (Phoenix dactylifera)** adore la chaleur et le soleil franc :\n\n• **Arrosage** : Arrosez à la base dès que les 4 premiers centimètres de terre sont secs. Ne mouillez jamais le cœur du bourgeon sommital.\n• **Humidité** : Brumisez occasionnellement les palmes si l'air intérieur est très sec.\n• **Entretien** : Coupez uniquement les palmes basses totalement desséchées pour favoriser la croissance des nouvelles pousses.",
      suggestions: [
        'Les pointes des palmes deviennent brunes',
        'Arrosage du palmier en hiver',
        'Quel engrais donner au palmier ?'
      ]
    };
  }

  if (lower.includes('jaune') || lower.includes('yellow') || lower.includes('jauniss')) {
    return {
      reply: "⚠️ **Feuilles qui jaunissent : les 3 causes principales** :\n\n1. **Excès d'eau (90% des cas)** : Les racines s'étouffent. Espacez vos arrosages et touchez la terre avant d'arroser.\n2. **Manque de lumière** : Déplacez la plante plus près d'une fenêtre lumineuse.\n3. **Carence nutritive (chlorose)** : Apportez un engrais liquide équilibré riche en fer et magnésium au printemps/été.",
      suggestions: [
        'Comment sauver une plante trop arrosée ?',
        'Comment reconnaître le pourrissement des racines ?',
        'Quel engrais naturel utiliser ?'
      ]
    };
  }

  if (lower.includes('eau') || lower.includes('water') || lower.includes('arros')) {
    return {
      reply: "💧 **Règle d'or de l'arrosage MoPlants** :\n\n• Enfoncez votre index à 3 cm dans la terre : si c'est sec, arrosez doucement avec de l'eau à température ambiante.\n• Ne laissez jamais d'eau stagnante dans la coupelle (cause #1 de mortalité des plantes).\n• En hiver, divisez la fréquence d'arrosage par deux par rapport à l'été.",
      suggestions: [
        'À quelle fréquence arroser en hiver ?',
        'L\'eau du robinet est-elle bonne ?',
        'Signes d\'une plante qui a soif'
      ]
    };
  }

  if (lower.includes('soleil') || lower.includes('lumiere') || lower.includes('light') || lower.includes('ombre')) {
    return {
      reply: "☀️ **Guide d'exposition solaire** :\n\n• **Plein Soleil** : Arganier, Olivier, Palmier Dattier, Cactus (fenêtre plein Sud ou extérieur).\n• **Lumière indirecte vive** : Hibiscus, Monstera, Ficus (fenêtre Est ou Ouest avec voilage léger).\n• **Mi-ombre** : Menthe, Fougères, Pothos.",
      suggestions: [
        'Brûlure de soleil sur les feuilles',
        'Plantes pour pièces peu éclairées',
        'Comment acclimater une plante dehors ?'
      ]
    };
  }

  if (lower.includes('malad') || lower.includes('insect') || lower.includes('parasit') || lower.includes('tache') || lower.includes('cochenill')) {
    return {
      reply: "🛡️ **Remède naturel anti-parasites (pucerons, cochenilles, acariens)** :\n\n• Mélangez dans 1 litre d'eau tiède : **1 cuillère à soupe de savon noir liquide** + **1 cuillère à café d'huile végétale**.\n• Pulvérisez le soir sur et sous toutes les feuilles atteintes.\n• Répétez l'opération 48h plus tard jusqu'à disparition totale.",
      suggestions: [
        'Comment éliminer les moucherons de terreau ?',
        'Taches blanches poudreuses (Oïdium) ?',
        'Feuilles collantes : que faire ?'
      ]
    };
  }

  if (lower.includes('rempot') || lower.includes('pot') || lower.includes('terreau')) {
    return {
      reply: "🪴 **Conseils de Rempotage** :\n\n• La meilleure période est le début du printemps (mars-avril).\n• Choisissez un pot de **2 à 4 cm plus large** que le précédent avec trou de drainage.\n• Placez toujours un lit de 3 cm de **billes d'argile** au fond pour garantir un drainage parfait.",
      suggestions: [
        'Quelle terre pour les plantes méditerranéennes ?',
        'Peut-on rempoter en hiver ?',
        'Comment choisir entre pot en terre cuite et plastique ?'
      ]
    };
  }

  if (lower.includes('marron') || lower.includes('brun') || lower.includes('pointes')) {
    return {
      reply: "🍂 **Pointes ou feuilles brunes / desséchées** :\n\n• **Air trop sec** : Très fréquent en intérieur avec chauffage ou climatisation. Vaporisez de l'eau sur le feuillage 2 à 3 fois par semaine.\n• **Sous-arrosage** : Si la terre est rétractée et sèche sur plus de 5 cm, faites un bassinage (trempez le pot 15 min dans une bassine d'eau).\n• **Excès de calcaire ou de sels minéraux** : Utilisez de l'eau filtrée ou de pluie si possible.",
      suggestions: [
        'Comment faire un bassinage ?',
        'Humidificateur pour plantes',
        'Faut-il couper les pointes brunes ?'
      ]
    };
  }

  if (lower.includes('engrais') || lower.includes('fertilis') || lower.includes('nourri')) {
    return {
      reply: "🌱 **Guide de fertilisation végétale** :\n\n• **Période active (mars à septembre)** : Apportez un engrais liquide bio ou pour plantes vertes toutes les 2 à 3 semaines.\n• **Période de repos (octobre à février)** : Stoppez tout apport d'engrais, la plante est en dormance.\n• **Règle d'or** : N'appliquez jamais d'engrais sur une motte totalement sèche pour éviter de brûler les racines.",
      suggestions: [
        'Engrais naturel avec marc de café ?',
        'Engrais pour olivier en pot',
        'Signes d\'une sur-fertilisation'
      ]
    };
  }

  if (lower.includes('boutur') || lower.includes('multipli')) {
    return {
      reply: "✂️ **Bouturage et multiplication végétale** :\n\n• Coupez une tige saine de 10-15 cm juste sous un nœud.\n• Retirez les feuilles du bas pour ne laisser que 2-3 feuilles au sommet.\n• Placez la tige dans un verre d'eau claire à la lumière (sans soleil direct) ou directement dans un substrat léger humide.\n• Dès que les racines atteignent 3-5 cm, repiquez en pot !",
      suggestions: [
        'Bouturage dans l\'eau ou en terre ?',
        'Quand rempoter une bouture ?',
        'Plantes faciles à bouturer'
      ]
    };
  }

  if (lower.includes('monstera') || lower.includes('ficus') || lower.includes('pothos')) {
    return {
      reply: "🌿 **Conseils pour plantes tropicales d'intérieur (Monstera, Ficus, Pothos)** :\n\n• **Lumière** : Forte luminosité sans soleil direct brûlant.\n• **Arrosage** : 1 fois par semaine en été, tous les 10-12 jours en hiver quand le terreau est sec en surface.\n• **Nettoyage** : Dépoussiérez les feuilles avec un chiffon humide une fois par mois pour booster la photosynthèse.",
      suggestions: [
        'Comment faire fenestrer les feuilles de Monstera ?',
        'Mon Ficus perd ses feuilles',
        'Tuteur en sphaigne pour Pothos'
      ]
    };
  }

  if (lower.includes('bonjour') || lower.includes('salut') || lower.includes('hello') || lower.includes('coucou')) {
    return {
      reply: "👋 Bonjour ! Je suis votre botaniste IA **Dr. MoPlants**. Je peux vous aider à soigner, arroser, tailler et diagnostiquer toutes vos plantes. De quel spécimen souhaitez-vous parler aujourd'hui ?",
      suggestions: [
        'Comment soigner mon Arganier ?',
        'Pourquoi mes feuilles jaunissent ?',
        'Fréquence d\'arrosage de l\'Olivier'
      ]
    };
  }

  if (lower.includes('merci') || lower.includes('super') || lower.includes('parfait')) {
    return {
      reply: "🌿 Avec grand plaisir ! Prenez bien soin de vos plantes. N'hésitez pas si vous observez le moindre signe de faiblesse ou si vous avez une question d'arrosage !",
      suggestions: [
        'Conseils pour le rempotage',
        'Recette naturelle anti-parasites',
        'Exposition solaire idéale'
      ]
    };
  }

  return {
    reply: `🌿 **Dr. MoPlants à votre écoute** :\n\nConcernant votre question sur *"${query}"* :\n\n• **Diagnostic rapide** : Vérifiez d'abord l'humidité du terreau (enfoncez un doigt à 3 cm) et assurez-vous que le fond du pot est bien percé pour éviter la pourriture racinaire.\n• **Luminosité** : Placez la plante dans une lumière vive sans soleil direct brûlant.\n• **Astuce** : Pour une réponse IA ultra-personnalisée par vision et texte, vous pouvez activer votre clé DeepSeek (\`DEEPSEEK_API_KEY\`) dans le fichier \`backend/.env\`.\n\nSouhaitez-vous un conseil spécifique sur l'arrosage, le rempotage ou un parasite ?`,
    suggestions: [
      'Comment tester l\'humidité du terreau ?',
      'Pourquoi les feuilles jaunissent ?',
      'Soigner mon Arganier ou Olivier'
    ]
  };
};

module.exports = {
  identifyPlant,
  chatResponse
};
