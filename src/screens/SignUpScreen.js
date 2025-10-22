import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../services/useAuth';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { signUp } = useAuth();

  async function handleSignUp() {
    setError(null);
    if (!email || !password) return setError('Email and password required');
    if (password.length < 6) return setError('Password must be 6+ chars');
    if (password !== confirm) return setError('Passwords do not match');

    setLoading(true);
    try {
      const res = await signUp(email, password);
      // supabase-js v2 returns { data, error }
      console.log('signUp response', res);
      const { data, error } = res;
      if (error) {
        setError(error.message || String(error));
      } else if (data?.user && !data?.session) {
        // user created but no session — likely requires email confirmation
        setError('Account created. Please check your email to confirm your account before signing in.');
        navigation.navigate('SignIn');
      } else if (data?.session) {
        // user signed up and is signed in
        navigation.navigate('Passwords');
      } else {
        // fallback
        navigation.navigate('SignIn');
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput placeholder="Confirm Password" style={styles.input} value={confirm} onChangeText={setConfirm} secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign up</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={{ marginTop: 12 }}>
        <Text style={{ color: '#666' }}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', padding: 12, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#111827', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  error: { color: 'crimson', marginBottom: 8 }
});
