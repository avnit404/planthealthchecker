
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

export default function PlantHealthScreen() {
  const [image, setImage] = useState(null);
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
      const response = await fetch(result.assets[0].uri);
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
      setHealth(data.result);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View style={[styles.glassCard, { opacity: image ? 0.98 : 0.9 }]}>
        <ThemedText style={styles.title}>Plant Health Check</ThemedText>
        
        <Animated.View style={[styles.uploadArea, animatedStyles]}>
          <TouchableOpacity 
            style={styles.uploadButton} 
            onPress={pickImage}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            {!image ? (
              <>
                <MaterialCommunityIcons name="leaf-circle" size={40} color="#fff" />
                <ThemedText style={styles.uploadText}>Upload Plant Image</ThemedText>
              </>
            ) : (
              <Image source={{ uri: image }} style={styles.image} />
            )}
          </TouchableOpacity>
        </Animated.View>

        {health && (
          <Animated.View 
            entering={withSequence(
              withTiming({ transform: [{ translateY: 20 }] }),
              withSpring({ transform: [{ translateY: 0 }] })
            )}
            style={styles.healthCard}
          >
            <View style={styles.statusContainer}>
              <MaterialCommunityIcons 
                name={health.status === "Healthy" ? "check-circle" : "alert-circle"} 
                size={24} 
                color={health.status === "Healthy" ? "#4CAF50" : "#f44336"} 
              />
              <ThemedText style={styles.statusText}>{health.status}</ThemedText>
            </View>
            
            {health.recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD700" />
                <ThemedText style={styles.recommendationText}>{rec}</ThemedText>
              </View>
            ))}
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
  healthCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  recommendationText: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 10,
    fontSize: 16,
  },
});
