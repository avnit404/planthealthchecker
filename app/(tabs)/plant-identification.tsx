import React, { useState } from 'react';
import { ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Animated, { 
  FadeInDown,
  FadeInUp
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function PlantIdentificationScreen() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      identifyPlant(result.assets[0].uri);
    }
  };

  const identifyPlant = async (imageUri) => {
    setLoading(true);
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const apiResponse = await fetch('https://plant.id/api/v3/identification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': 'CVLs8IAfB4VSO4gpLXqX625SutHekQj6neZROnk9jLpupOljC8',
        },
        body: JSON.stringify({
          images: [base64Image],
          latitude: 49.207,
          longitude: 16.608,
          similar_images: true,
        }),
      });

      const data = await apiResponse.json();
      setResult(data.result);
    } catch (error) {
      alert('Error identifying plant: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <Animated.View entering={FadeInDown} style={styles.header}>
          <ThemedText style={styles.title}>Plant Identification</ThemedText>
          <ThemedText style={styles.subtitle}>Upload a photo to identify your plant</ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.uploadSection}>
          <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
            <MaterialCommunityIcons name="camera-plus" size={40} color="#4CAF50" />
            <ThemedText style={styles.uploadText}>Upload Photo</ThemedText>
          </TouchableOpacity>

          {image && (
            <Image source={{ uri: image }} style={styles.image} />
          )}

          {loading && (
            <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
          )}

          {result && (
            <Animated.View entering={FadeInUp} style={styles.resultCard}>
              <ThemedText style={styles.resultTitle}>{result.plantName}</ThemedText>
              <ThemedText style={styles.resultDetail}>{result.scientificName}</ThemedText>
              <ThemedText style={styles.resultDescription}>{result.description}</ThemedText>
              {result.similarImages && result.similarImages.map((img, index) => (
                <Image key={index} source={{uri: img}} style={styles.similarImage} />
              ))}
            </Animated.View>
          )}
        </Animated.View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  uploadSection: {
    alignItems: 'center',
    width: '100%',
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    width: '100%',
    marginBottom: 16,
    minHeight: 120,
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
  },
  image: {
    width: '100%',
    height: width * 0.7,
    borderRadius: 12,
    marginBottom: 16,
  },
  loader: {
    marginVertical: 16,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultDetail: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
  },
  resultDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  similarImage: {
    width: width - 80,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  warning: {
    color: '#f44336',
    marginTop: 10,
    fontSize: 14,
  },
});