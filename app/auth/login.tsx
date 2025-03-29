import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setError('');
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      const errorCode = error.code;
      switch (errorCode) {
        case 'auth/invalid-email':
          setError('Please enter a valid email address');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/invalid-credential':
          setError('Invalid email or password');
          break;
        default:
          setError('Failed to login. Please try again');
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <ThemedText type="title" style={styles.title}>Welcome Back</ThemedText>

      {error ? (
        <View style={styles.errorContainer}>
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

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#666"
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <ThemedText style={styles.buttonText}>Login</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/register')}>
        <ThemedText style={styles.link}>Don't have an account? Register</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#4CAF50',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  error: {
    color: '#d32f2f',
    marginLeft: 8,
    flex: 1,
  }
});