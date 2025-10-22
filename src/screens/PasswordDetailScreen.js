import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../services/supabase';
import { getPasswordById, decryptPassword, deletePassword } from '../services/passwordService';
import * as Clipboard from 'expo-clipboard';

export default function PasswordDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const row = await getPasswordById(id);
      if (mounted) setItem(row);
      setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  async function handleCopy() {
    if (!item) return;
    const plain = await decryptPassword(item.encrypted_password);
    await Clipboard.setStringAsync(plain);
    Alert.alert('Copied', 'Password copied to clipboard');
  }

  async function handleDelete() {
    Alert.alert('Delete', 'Delete this password?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deletePassword(id); navigation.goBack(); } }
    ]);
  }

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  if (!item) return <View style={{ padding: 20 }}><Text>Not found</Text></View>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={styles.site}>{item.site}</Text>
      <Text style={styles.user}>{item.username}</Text>
      <View style={{ height: 12 }} />
      <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}><Text style={{ color: '#fff' }}>Copy Password</Text></TouchableOpacity>
      <View style={{ height: 12 }} />
      <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('PasswordEdit', { mode: 'edit', id })}><Text>Edit</Text></TouchableOpacity>
      <View style={{ height: 12 }} />
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}><Text style={{ color: 'crimson' }}>Delete</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  site: { fontSize: 20, fontWeight: '700' },
  user: { color: '#6b7280', marginBottom: 12 },
  copyBtn: { backgroundColor: '#111827', padding: 12, borderRadius: 8, alignItems: 'center' },
  editBtn: { padding: 12, borderRadius: 8, alignItems: 'center', backgroundColor: '#f3f4f6' },
  deleteBtn: { padding: 12, borderRadius: 8, alignItems: 'center' }
});
