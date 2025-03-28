
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function PlantIdentificationScreen() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // TODO: Add API call to identify plant
      setResult({
        name: "Sample Plant",
        scientificName: "Plantus Exampleus",
        description: "A beautiful plant species..."
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Plant Identification</ThemedText>
      
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <ThemedText>Upload Image</ThemedText>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}

      {result && (
        <View style={styles.resultCard}>
          <ThemedText type="subtitle">{result.name}</ThemedText>
          <ThemedText>{result.scientificName}</ThemedText>
          <ThemedText>{result.description}</ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  uploadButton: {
    padding: 15,
    backgroundColor: '#0a7ea4',
    borderRadius: 10,
    marginVertical: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginVertical: 20,
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
