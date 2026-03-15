// RegisterScreen
// - Purpose: Allows new users to create an account. On success, stores JWT and navigates to main app.

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import authApi from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email.trim() || !password) return Alert.alert('Validation', 'Email and password are required');
    setLoading(true);
    try {
      const data = await authApi.register(email.trim(), password);
      await login(data.token);
    } catch (err) {
      Alert.alert('Registration failed', String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Button title="Register" onPress={handleRegister} />
          <View style={{ height: 12 }} />
          <Button title="Back to Login" onPress={() => navigation.navigate('Login')} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginVertical: 8,
  },
});
