import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Button({ children, onPress, style, disabled }) {
  return (
    <TouchableOpacity style={[styles.btn, style, disabled && { opacity: 0.6 }]} onPress={onPress} disabled={disabled}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: '#111827', padding: 14, borderRadius: 8, alignItems: 'center' },
  text: { color: '#fff', fontWeight: '600' }
});
