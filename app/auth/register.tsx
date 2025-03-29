import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Platform, Pressable } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      setError('');
      if (!email || !password || !confirmPassword) {
        setError('Please enter email, password, and confirm password');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      const errorCode = error.code;
      switch (errorCode) {
        case 'auth/email-already-in-use':
          setError('An account already exists with this email');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address');
          break;
        case 'auth/weak-password':
          setError('Password is too weak');
          break;
        default:
          setError('Failed to create account. Please try again');
      }
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: '#f0f0f0' }]}> {/* Changed background color */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <ThemedText type="title" style={styles.title}>Create Account</ThemedText>

      {error ? (
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>{/* Add an icon here if desired */}</View>
          <ThemedText style={styles.error}>{error}</ThemedText>
        </View>
      ) : null}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#666"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={styles.passwordInput}
          placeholderTextColor="#666"
        />
        <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <MaterialCommunityIcons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="#666"
          />
        </Pressable>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.passwordInput}
          placeholderTextColor="#666"
        />
        <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
          <MaterialCommunityIcons
            name={showConfirmPassword ? 'eye-off' : 'eye'}
            size={24}
            color="#666"
          />
        </Pressable>
      </View>

      <TouchableOpacity onPress={handleRegister} style={styles.button}>
        <ThemedText style={styles.buttonText}>Register</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/login')}>
        <ThemedText style={styles.link}>Already have an account? Login</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFDDAB',
  },
  title: {
    fontSize: 36,
    marginBottom: 32,
    textAlign: 'center',
    color: '#945034',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#945034',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 24,
    textAlign: 'center',
    color: '#945034',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3f3',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  error: {
    color: '#d32f2f',
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
  errorIcon: {
    width: 24,
    height: 24,
    tintColor: '#d32f2f',
  }
});