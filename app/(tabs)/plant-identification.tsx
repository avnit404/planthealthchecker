
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function PlantIdentificationScreen() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const buttonScale = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult({
        name: "Sample Plant",
        scientificName: "Plantus Exampleus",
        description: "A beautiful plant species..."
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View 
        style={[styles.glassCard, { opacity: image ? 0.98 : 0.9 }]}
      >
        <ThemedText style={styles.title}>Plant Identification</ThemedText>
        
        <Animated.View style={[styles.uploadArea, animatedStyles]}>
          <TouchableOpacity 
            style={styles.uploadButton} 
            onPress={pickImage}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            {!image ? (
              <>
                <MaterialCommunityIcons name="image-plus" size={40} color="#fff" />
                <ThemedText style={styles.uploadText}>Upload Image</ThemedText>
              </>
            ) : (
              <Image source={{ uri: image }} style={styles.image} />
            )}
          </TouchableOpacity>
        </Animated.View>

        {result && (
          <Animated.View 
            entering={withSequence(
              withTiming({ transform: [{ translateY: 20 }] }),
              withSpring({ transform: [{ translateY: 0 }] })
            )}
            style={styles.resultCard}
          >
            <ThemedText style={styles.plantName}>{result.name}</ThemedText>
            <ThemedText style={styles.scientificName}>{result.scientificName}</ThemedText>
            <ThemedText style={styles.description}>{result.description}</ThemedText>
          </Animated.View>
        )}
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
  },
  glassCard: {
    width: '100%',
    padding: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
    textShadow: '0 0 10px rgba(255,255,255,0.3)',
  },
  uploadArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  uploadButton: {
    width: width * 0.8,
    height: width * 0.6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
  },
  uploadText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
  },
  plantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 10,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
});
