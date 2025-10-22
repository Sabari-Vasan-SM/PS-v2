import { supabase } from './supabase';
import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';

const KEY_NAME = 'pwmgr_encryption_key_v1';

async function getOrCreateKey() {
  let key = await SecureStore.getItemAsync(KEY_NAME);
  if (!key) {
    key = CryptoJS.lib.WordArray.random(16).toString();
    await SecureStore.setItemAsync(KEY_NAME, key, { keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY });
  }
  return key;
}

export async function encryptPassword(plain) {
  if (!plain) return '';
  try {
    const key = await getOrCreateKey();
    return CryptoJS.AES.encrypt(plain, key).toString();
  } catch (e) {
    // fallback to no-encryption (not ideal) if key fails
    return CryptoJS.AES.encrypt(plain, 'device_key_placeholder').toString();
  }
}

export async function decryptPassword(cipher) {
  if (!cipher) return '';
  try {
    const key = await getOrCreateKey();
    const bytes = CryptoJS.AES.decrypt(cipher, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    try {
      const bytes = CryptoJS.AES.decrypt(cipher, 'device_key_placeholder');
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e2) {
      return '';
    }
  }
}

export async function getPasswords() {
  const user = await supabase.auth.getUser();
  const userId = user?.data?.user?.id;
  if (!userId) return [];
  const { data, error } = await supabase.from('passwords').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getPasswordById(id) {
  const user = await supabase.auth.getUser();
  const userId = user?.data?.user?.id;
  if (!userId) return null;
  const { data, error } = await supabase.from('passwords').select('*').eq('id', id).eq('user_id', userId).single();
  if (error) return null;
  return data;
}

export async function createPassword({ site, username, password }) {
  const encrypted_password = await encryptPassword(password || '');
  const user = await supabase.auth.getUser();
  const userId = user?.data?.user?.id;
  if (!userId) throw new Error('Not authenticated');
  const { data, error } = await supabase.from('passwords').insert([{ site, username, encrypted_password, user_id: userId }]);
  if (error) throw error;
  return data;
}

export async function updatePassword(id, { site, username, password }) {
  const user = await supabase.auth.getUser();
  const userId = user?.data?.user?.id;
  if (!userId) throw new Error('Not authenticated');
  const updates = { site, username };
  if (password) updates.encrypted_password = await encryptPassword(password);
  const { data, error } = await supabase.from('passwords').update(updates).eq('id', id).eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function deletePassword(id) {
  const user = await supabase.auth.getUser();
  const userId = user?.data?.user?.id;
  if (!userId) throw new Error('Not authenticated');
  const { error } = await supabase.from('passwords').delete().eq('id', id).eq('user_id', userId);
  if (error) throw error;
}
