#!/usr/bin/env node
// server/confirmUser.js
// Usage (server ONLY):
//   set SUPABASE_URL=https://... (Windows CMD) or $env:SUPABASE_URL=... (PowerShell)
//   set SUPABASE_SERVICE_ROLE_KEY=... (server env)
//   node server/confirmUser.js <user-id>

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set as environment variables.');
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

async function confirmUser(userId) {
  try {
    const { data, error } = await admin.auth.admin.updateUserById(userId, { email_confirm: true });
    if (error) {
      console.error('Error confirming user:', error);
      process.exit(2);
    }
    
    console.log('User confirmed:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(99);
  }
}

const userId = process.argv[2];
if (!userId) {
  console.error('Usage: node server/confirmUser.js <user-id>');
  process.exit(1);
}

confirmUser(userId).then(() => process.exit(0));
