import React, { useState } from 'react';
import { 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  ActivityIndicator, 
  View, 
  Alert,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  withSpring, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function PlantHealthScreen() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState(null);
  const buttonScale = useSharedValue(1);
  const progressWidth = useSharedValue(0);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: withTiming(progressWidth.value, { duration: 500 }),
  }));

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
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
      analyzeHealth(imageUri);
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
        progressWidth.value = healthProbability * (width - 96);

        setHealth({
          status: isHealthy ? "Plant is Healthy" : "Health Issues Detected",
          issues: issues.map(issue => `${issue.name} (${(issue.probability * 100).toFixed(1)}%)`),
          confidence: healthProbability,
          recommendations: [
            `Overall Health: ${(healthProbability * 100).toFixed(1)}%`,
            "Consult a plant specialist for treatment options"
          ],
        });
      } else {
        setHealth({
          status: "Analysis Failed",
          issues: ["Could not analyze the plant health"],
          recommendations: ["Please try with a different image"],
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Error analyzing plant health: ' + error.message);
      setHealth({
        status: "Error",
        issues: ["Error analyzing plant"],
        recommendations: ["Please try again"],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.wrapper}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Plant Health Check</ThemedText>
          <ThemedText style={styles.subtitle}>
            Upload a photo to check plant health
          </ThemedText>
        </View>

        {/* Main Content */}
        <View style={styles.main}>
          <Animated.View 
            entering={FadeInDown.delay(200)} 
            style={[styles.uploadContainer, animatedButtonStyle]}
          >
            <TouchableOpacity 
              onPressIn={handlePressIn} 
              onPressOut={handlePressOut} 
              onPress={pickImage} 
              activeOpacity={0.8}
              style={styles.uploadButton}
            >
              <MaterialCommunityIcons name="upload" size={40} color="#fff" />
              <ThemedText style={styles.uploadText}>Select Photo</ThemedText>
            </TouchableOpacity>
            {image && (
              <Image source={{ uri: image }} style={styles.previewImage} />
            )}
          </Animated.View>

          {loading && (
            <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
          )}

          {health && (
            <Animated.View entering={FadeInUp} style={styles.resultContainer}>
              <ThemedText style={styles.healthStatus}>{health.status}</ThemedText>
              {health.issues.map((issue, index) => (
                <ThemedText key={index} style={styles.issueText}>{issue}</ThemedText>
              ))}
              <View style={styles.progressWrapper}>
                <Animated.View style={[styles.progressBar, animatedProgressStyle]} />
              </View>
              {health.recommendations.map((rec, index) => (
                <ThemedText key={index} style={styles.recommendationText}>
                  {rec}
                </ThemedText>
              ))}
            </Animated.View>
          )}
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#FFDDAB',
  },
  wrapper: {
    flex: 1,
    padding: Platform.select({ ios: 20, android: 16, default: 20 }),
    backgroundColor:"#FFDDAB",
  },
  header: {
    paddingVertical: Platform.select({ ios: 20, android: 16, default: 20 }),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: Platform.select({ ios: 20, android: 16, default: 20 }),
    alignItems: 'center',
  },
  title: {
    fontSize: Platform.select({ ios: 28, android: 24, default: 28 }),
    fontWeight: '700',
    color: '#945034',
    marginBottom: Platform.select({ ios: 10, android: 8, default: 10 }),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Platform.select({ ios: 16, android: 14, default: 16 }),
    color: '#945034',
    textAlign: 'center',
  },
  main: {
    flex: 1,
    alignItems: 'center',
  },
  uploadContainer: {
    width: '100%',
    backgroundColor: '#5F8B4C',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
    fontWeight: '500',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginTop: 20,
  },
  loader: {
    marginVertical: 20,
  },
  resultContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  healthStatus: {
    fontSize: 24,
    fontWeight: '700',
    color: '#945034',
    marginBottom: 10,
  },
  issueText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  progressWrapper: {
    width: '100%',
    height: 10,
    backgroundColor: '#FFDDAB',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 15,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#945034',
  },
  recommendationText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
});