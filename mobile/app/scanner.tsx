import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../src/constants/colors';
import { usePlantStore } from '../src/store/plantStore';
import { PLANT_IMAGES } from '../src/constants/plantImages';

export default function ScannerScreen() {
  const router = useRouter();
  const { identifyPlantPhoto, isLoading } = usePlantStore();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [flashMode, setFlashMode] = useState(false);

  // Gallery Picker
  const pickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Photo Library Access',
          'Choose a plant specimen to test botanical identification:',
          [
            { text: '🌿 Arganier', onPress: () => setSelectedImage('arganier') },
            { text: '🌴 Palmier Dattier', onPress: () => setSelectedImage('palmier_dattier') },
            { text: '🫒 Olivier', onPress: () => setSelectedImage('olivier') },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (e) {
      setSelectedImage('olivier');
    }
  };

  // Camera Picker / Specimen Capture
  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Select Botanical Specimen',
          'Choose a specimen to test AI identification, or select from gallery:',
          [
            {
              text: '🌿 Arganier (Argania spinosa)',
              onPress: () => setSelectedImage('arganier')
            },
            {
              text: '🌴 Palmier Dattier (Phoenix)',
              onPress: () => setSelectedImage('palmier_dattier')
            },
            {
              text: '🫒 Olivier (Olea europaea)',
              onPress: () => setSelectedImage('olivier')
            },
            {
              text: 'Photo Gallery',
              onPress: pickFromGallery
            },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (e) {
      setSelectedImage('olivier');
    }
  };

  // Trigger Identification
  const handleIdentify = async () => {
    const imageToAnalyze = selectedImage || 'olivier';

    const result = await identifyPlantPhoto(imageToAnalyze);
    router.push({
      pathname: '/result',
      params: {
        image: imageToAnalyze,
        speciesData: JSON.stringify(result)
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Overlay Controls */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconCircle}
        >
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFlashMode(!flashMode)}
          style={styles.iconCircle}
        >
          <Ionicons
            name={flashMode ? 'flash' : 'flash-off'}
            size={22}
            color={flashMode ? '#FBBF24' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>

      {/* Viewfinder / Preview Frame */}
      <View style={styles.cameraViewport}>
        {selectedImage ? (
          <Image
            source={
              selectedImage === 'arganier'
                ? PLANT_IMAGES.arganier
                : selectedImage === 'palmier_dattier'
                ? PLANT_IMAGES.palmier_dattier
                : selectedImage === 'olivier'
                ? PLANT_IMAGES.olivier
                : { uri: selectedImage }
            }
            style={styles.previewImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.mockFeed}>
            {/* Background botanical foliage preview */}
            <Image
              source={PLANT_IMAGES.olivier}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
            <View style={styles.overlayTint} />
          </View>
        )}

        {/* Viewfinder Target Brackets */}
        <View style={styles.targetFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          <Text style={styles.frameInstruction}>POSITION PLANT IN FRAME</Text>
        </View>
      </View>

      {/* Specimen Quick Selector */}
      <View style={styles.specimenPickerRow}>
        <TouchableOpacity
          style={[styles.specimenChip, selectedImage === 'arganier' && styles.specimenChipActive]}
          onPress={() => setSelectedImage('arganier')}
        >
          <Text style={[styles.specimenChipText, selectedImage === 'arganier' && styles.specimenChipTextActive]}>
            🌿 Arganier
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.specimenChip, selectedImage === 'palmier_dattier' && styles.specimenChipActive]}
          onPress={() => setSelectedImage('palmier_dattier')}
        >
          <Text style={[styles.specimenChipText, selectedImage === 'palmier_dattier' && styles.specimenChipTextActive]}>
            🌴 Palmier
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.specimenChip, selectedImage === 'olivier' && styles.specimenChipActive]}
          onPress={() => setSelectedImage('olivier')}
        >
          <Text style={[styles.specimenChipText, selectedImage === 'olivier' && styles.specimenChipTextActive]}>
            🫒 Olivier
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mode Switcher */}
      <View style={styles.modeRow}>
        <Text style={styles.modeText}>PHOTO</Text>
        <Text style={[styles.modeText, styles.modeActive]}>SCAN</Text>
        <Text style={styles.modeText}>CARE</Text>
      </View>

      {/* Bottom Shutter & Gallery Controls */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={pickFromGallery}
          style={styles.actionCircle}
        >
          <Ionicons name="images-outline" size={24} color="#FFFFFF" />
          <Text style={styles.controlLabel}>Gallery</Text>
        </TouchableOpacity>

        {/* Center Shutter Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={selectedImage ? handleIdentify : takePhoto}
          style={styles.shutterOuter}
        >
          <View style={styles.shutterInner}>
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : selectedImage ? (
              <Ionicons name="sparkles" size={26} color={Colors.primary} />
            ) : (
              <View style={styles.shutterDot} />
            )}
          </View>
        </TouchableOpacity>

        {selectedImage ? (
          <TouchableOpacity
            onPress={() => setSelectedImage(null)}
            style={styles.actionCircle}
          >
            <Ionicons name="refresh-outline" size={24} color="#FFFFFF" />
            <Text style={styles.controlLabel}>Retake</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleIdentify}
            style={styles.actionCircle}
          >
            <Ionicons name="sparkles-outline" size={24} color="#BCEECF" />
            <Text style={[styles.controlLabel, { color: '#BCEECF' }]}>Demo AI</Text>
          </TouchableOpacity>
        )}
      </View>

      {selectedImage && (
        <View style={styles.identifyBanner}>
          <TouchableOpacity
            style={styles.identifyBannerBtn}
            onPress={handleIdentify}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="scan" size={20} color="#FFFFFF" />
                <Text style={styles.identifyBannerText}>Analyze Botanical Species</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A'
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 54,
    paddingBottom: 16,
    zIndex: 10
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cameraViewport: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  previewImage: {
    ...StyleSheet.absoluteFill
  },
  mockFeed: {
    ...StyleSheet.absoluteFill
  },
  overlayTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  targetFrame: {
    width: 270,
    height: 310,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#BCEECF'
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3.5,
    borderLeftWidth: 3.5,
    borderTopLeftRadius: 16
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3.5,
    borderRightWidth: 3.5,
    borderTopRightRadius: 16
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3.5,
    borderLeftWidth: 3.5,
    borderBottomLeftRadius: 16
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
    borderBottomRightRadius: 16
  },
  frameInstruction: {
    position: 'absolute',
    bottom: -36,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8
  },
  specimenPickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4
  },
  specimenChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  specimenChipActive: {
    backgroundColor: Colors.primary,
    borderColor: '#BCEECF'
  },
  specimenChipText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600'
  },
  specimenChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
    paddingVertical: 14
  },
  modeText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1
  },
  modeActive: {
    color: '#BCEECF'
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 30
  },
  actionCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60
  },
  controlLabel: {
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 4,
    fontWeight: '600'
  },
  shutterOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#BCEECF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  shutterDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary
  },
  identifyBanner: {
    paddingHorizontal: 20,
    paddingBottom: 24
  },
  identifyBannerBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  identifyBannerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  }
});
