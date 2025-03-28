
import React, { useState } from 'react';
import { ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, withSequence, withSpring, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function PlantHealthScreen() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState(null);
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
      analyzeHealth(result.assets[0].uri);
    }
  };

  const analyzeHealth = async (imageUri) => {
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

      const apiResponse = await fetch('https://plant.id/api/v3/health_assessment', {
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
      if (data.result?.disease?.suggestions) {
        const issues = data.result.disease.suggestions;
        const isHealthy = data.result.is_healthy.binary;
        const healthProbability = data.result.is_healthy.probability;
        
        setHealth({
          status: isHealthy ? "Plant is Healthy" : "Health Issues Detected",
          issues: issues.map(issue => `${issue.name} (${(issue.probability * 100).toFixed(1)}%)`),
          recommendations: [
            `Overall Health: ${(healthProbability * 100).toFixed(1)}%`,
            "Consult a plant specialist for treatment options"
          ]
        });
      } else {
        setHealth({
          status: "Analysis Failed",
          issues: ["Could not analyze the plant health"],
          recommendations: ["Please try with a different image"]
        });
      }
    } catch (error) {
      alert('Error analyzing plant health: ' + error.message);
      setHealth({
        status: "Error",
        issues: ["Error analyzing plant"],
        recommendations: ["Please try again"]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <Animated.View entering={FadeInDown} style={styles.header}>
          <ThemedText style={styles.title}>Plant Health Check</ThemedText>
          <ThemedText style={styles.subtitle}>Upload a photo to check plant health</ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.uploadSection}>
          <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
            <MaterialCommunityIcons name="heart-pulse" size={40} color="#4CAF50" />
            <ThemedText style={styles.uploadText}>Upload Photo</ThemedText>
          </TouchableOpacity>

          {image && (
            <Image source={{ uri: image }} style={styles.image} />
          )}

          {loading && (
            <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
          )}

          {health && health.issues && (
            <Animated.View entering={FadeInUp} style={styles.resultCard}>
              <ThemedText style={styles.resultTitle}>{health.status}</ThemedText>
              
              {health.issues.map((issue, index) => (
                <ThemedText key={index} style={styles.resultDetail}>{issue}</ThemedText>
              ))}

              <View style={styles.confidentBar}>
                <Animated.View 
                  style={[styles.confidentFill, { width: health.recommendations[0].includes('Confidence') ? 
                    `${parseFloat(health.recommendations[0].split(':')[1])}%` : '0%' }]} 
                />
              </View>

              {health.recommendations.map((rec, index) => (
                <ThemedText key={index} style={styles.recommendationText}>{rec}</ThemedText>
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
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f9fc',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    color: '#1a2138',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666d87',
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
    color: '#1a2138',
  },
  resultDetail: {
    fontSize: 18,
    color: '#4a5578',
    marginBottom: 16,
    fontWeight: '600',
  },
  recommendationText: {
    fontSize: 15,
    color: '#666d87',
    marginTop: 8,
  },
  confidentBar: {
    height: 8,
    backgroundColor: '#e1e5ee',
    borderRadius: 4,
    marginVertical: 8,
  },
  confidentFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
});
