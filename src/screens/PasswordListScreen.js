import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase';
import { useAuth } from '../services/useAuth';
import { getPasswords } from '../services/passwordService';

export default function PasswordListScreen({ navigation }) {
  const { session } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const items = await getPasswords();
      if (mounted) setData(items || []);
      setLoading(false);
    }
    load();

    const channel = supabase.channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'passwords' }, () => load())
      .subscribe();

    return () => {
      mounted = false;
      try { channel.unsubscribe(); } catch (e) {}
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Passwords</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate('PasswordEdit', { mode: 'create' })} style={styles.addBtn}>
            <Text style={{ color: '#fff' }}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => supabase.auth.signOut()} style={styles.logoutBtn}>
            <Text style={{ color: '#333' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : (
        <FlatList
          data={data}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PasswordDetail', { id: item.id })}>
              <Text style={styles.site}>{item.site}</Text>
              <Text style={styles.user}>{item.username}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      {!loading && data.length === 0 && (
        <View style={{ padding: 20 }}><Text style={{ color: '#6b7280' }}>No passwords yet. Tap Add to create one.</Text></View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700' },
  addBtn: { backgroundColor: '#111827', padding: 10, borderRadius: 8 },
  logoutBtn: { backgroundColor: '#e5e7eb', padding: 10, borderRadius: 8, marginLeft: 8 },
  card: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  site: { fontSize: 16, fontWeight: '600' },
  user: { color: '#6b7280' }
});
