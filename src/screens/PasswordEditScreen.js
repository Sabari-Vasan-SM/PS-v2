import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { createPassword, getPasswordById, updatePassword } from '../services/passwordService';

export default function PasswordEditScreen({ route, navigation }) {
  const { mode, id } = route.params || { mode: 'create' };
  const [site, setSite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && id) {
      (async () => {
        const row = await getPasswordById(id);
        if (row) {
          setSite(row.site);
          setUsername(row.username);
          setPassword('');
        }
      })();
    }
  }, [mode, id]);

  async function handleSave() {
    if (!site || !username) return Alert.alert('Validation', 'Site and username required');
    setLoading(true);
    try {
      if (mode === 'create') {
        await createPassword({ site, username, password });
      } else {
        await updatePassword(id, { site, username, password });
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === 'create' ? 'Add Password' : 'Edit Password'}</Text>
      <TextInput placeholder="Site (e.g. example.com)" style={styles.input} value={site} onChangeText={setSite} />
      <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername} />
      <TextInput placeholder="Password (leave blank to keep)" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff' }}>Save</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', padding: 12, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#111827', padding: 14, borderRadius: 8, alignItems: 'center' }
});
