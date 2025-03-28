import React, { useState } from 'react';
import { ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, View } from 'react-native';
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
      if (data.result?.classification?.suggestions?.[0]) {
        const suggestion = data.result.classification.suggestions[0];
        setResult({
          plantName: suggestion.name,
          scientificName: suggestion.name,
          probability: suggestion.probability,
          similarImages: suggestion.similar_images?.map(img => ({
            url: img.url_small,
            citation: img.citation,
            license: img.license_name,
            similarity: img.similarity
          })) || [],
          location: {
            latitude: data.input.latitude,
            longitude: data.input.longitude
          },
          dateTime: new Date(data.input.datetime)
        });
      }
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

              <View style={styles.confidentBar}>
                <Animated.View 
                  style={[styles.confidentFill, { width: `${result.probability * 100}%` }]} 
                />
              </View>
              <ThemedText style={styles.resultDescription}>
                Confidence: {(result.probability * 100).toFixed(1)}%
              </ThemedText>

              <ThemedText style={styles.locationText}>
                Location: {result.location.latitude.toFixed(3)}, {result.location.longitude.toFixed(3)}
              </ThemedText>

              <ThemedText style={styles.dateText}>
                Date: {result.dateTime.toLocaleDateString()}
              </ThemedText>

              <ThemedText style={styles.similarImagesTitle}>Similar Plants</ThemedText>
              {result.similarImages && result.similarImages.map((img, index) => (
                <View key={index} style={styles.similarImageContainer}>
                  <Image source={{uri: img.url}} style={styles.similarImage} />
                  <ThemedText style={styles.similarityText}>
                    Similarity: {(img.similarity * 100).toFixed(1)}%
                  </ThemedText>
                  <ThemedText style={styles.citationText}>
                    Photo by: {img.citation} ({img.license})
                  </ThemedText>
                </View>
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
    backgroundColor: '#FFDDAB',
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor:"#FFDDAB",
  },
  confidentBar: {
    height: 6,
    backgroundColor: '#FFDDAB',
    borderRadius: 3,
    marginVertical: 16,
    overflow: 'hidden',
  },
  confidentFill: {
    height: '100%',
    backgroundColor: '#945034',
    borderRadius: 3,
  },
  locationText: {
    fontSize: 14,
    color: '#666d87',
    marginTop: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#666d87',
    marginBottom: 16,
  },
  similarImagesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1a2138',
  },
  similarImageContainer: {
    marginBottom: 16,
  },
  similarityText: {
    fontSize: 14,
    color: '#4a5578',
    marginTop: 4,
  },
  citationText: {
    fontSize: 12,
    color: '#666d87',
    marginTop: 2,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    color: '#945034',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#945034',
    textAlign: 'center',
    maxWidth: '80%',
  },
  uploadSection: {
    alignItems: 'center',
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginBottom: 24,
    width: width - 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#e1e5ee',
    borderStyle: 'dashed',
  },
  uploadText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4a5578',
    fontWeight: '600',
  },
  image: {
    width: width - 32,
    height: 350,
    borderRadius: 24,
    marginBottom: 24,
  },
  loader: {
    marginVertical: 24,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    color: '#945034',
  },
  resultDetail: {
    fontSize: 18,
    color: '#4a5578',
    marginBottom: 16,
    fontWeight: '600',
  },
  resultDescription: {
    fontSize: 15,
    lineHeight: 24,
    color: '#666d87',
  },
  similarImage: {
    width: width - 80,
    height: 200,
    borderRadius: 20,
    marginTop: 16,
  },
});