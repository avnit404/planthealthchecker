
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
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  uploadSection: {
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: width - 40,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
  },
  uploadText: {
    marginTop: 10,
    fontSize: 16,
  },
  image: {
    width: width - 40,
    height: 300,
    borderRadius: 20,
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  },
  resultCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 20,
    borderRadius: 20,
    width: width - 40,
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultDetail: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  resultDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
