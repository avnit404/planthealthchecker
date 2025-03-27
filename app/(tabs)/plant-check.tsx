
import React, { useState } from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/ThemedText';

export default function PlantCheckScreen() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const API_KEY = "CVLs8IAfB4VSO4gpLXqX625SutHekQj6neZROnk9jLpupOljC8";

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const identifyPlant = async () => {
    try {
      const response = await fetch('https://plant.id/api/v3/identification', {
        method: 'POST',
        headers: {
          'Api-Key': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: [image.base64],
          latitude: 49.207,
          longitude: 16.608,
          similar_images: true,
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const checkHealth = async () => {
    try {
      const response = await fetch('https://plant.id/api/v3/health_assessment', {
        method: 'POST',
        headers: {
          'Api-Key': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: [image.base64],
          latitude: 49.207,
          longitude: 16.608,
          similar_images: true,
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image" onPress={pickImage} />
      {image && (
        <>
          <Image source={{ uri: image.uri }} style={styles.image} />
          <Button title="Identify Plant" onPress={identifyPlant} />
          <Button title="Check Health" onPress={checkHealth} />
        </>
      )}
      {result && (
        <ThemedText>{JSON.stringify(result, null, 2)}</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});
