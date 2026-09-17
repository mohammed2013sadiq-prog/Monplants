import { ImageSourcePropType } from 'react-native';

export const PLANT_IMAGES = {
  arganier: require('../../assets/plants/arganier.jpg'),
  olivier: require('../../assets/plants/olivier.jpg'),
  palmier_dattier: require('../../assets/plants/palmier_dattier.jpg'),
  olive_tree: require('../../assets/plants/olive_tree.png'),
  cactus: require('../../assets/plants/cactus.png'),
  hibiscus: require('../../assets/plants/hibiscus.png'),
};

export const AVATAR_IMAGES = {
  ai_bot: require('../../assets/avatar/ai_avatar.jpg'),
};

/**
 * Resolves a plant name, species object, or URL to the best-fitting image source
 */
export function resolvePlantImage(nameOrUrl?: string): ImageSourcePropType {
  if (!nameOrUrl) return PLANT_IMAGES.olivier;

  const str = String(nameOrUrl).toLowerCase();

  // If user took a picture or picked from device
  if (str.startsWith('file://') || str.startsWith('content://') || str.startsWith('ph://')) {
    return { uri: nameOrUrl };
  }

  // Intercept known species keywords
  if (str.includes('argan')) {
    return PLANT_IMAGES.arganier;
  }
  if (str.includes('palm') || str.includes('dattier') || str.includes('phoenix')) {
    return PLANT_IMAGES.palmier_dattier;
  }
  if (str.includes('oliv') || str.includes('olea')) {
    return PLANT_IMAGES.olivier;
  }
  if (str.includes('cact') || str.includes('opuntia') || str.includes('figuier')) {
    return PLANT_IMAGES.cactus;
  }
  if (str.includes('hibisc') || str.includes('1550950158-d0d960dff51b')) {
    return PLANT_IMAGES.hibiscus;
  }

  // If it's a valid remote URL or data URI (non-burger)
  if (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('data:')) {
    return { uri: nameOrUrl };
  }

  return PLANT_IMAGES.olivier;
}

