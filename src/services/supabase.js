import { createClient } from '@supabase/supabase-js';

// Prefer environment variables for configuration. This allows using Expo/EAS secrets
// or CI secrets and keeps keys out of source control.
// You can set these in PowerShell before starting Expo:
// $env:EXPO_PUBLIC_SUPABASE_URL="https://..."
// $env:EXPO_PUBLIC_SUPABASE_KEY="<your_publishable_or_anon_key>"

// Fallbacks (for quick local testing). Replace only if you understand the security implications.
const FALLBACK_SUPABASE_URL = 'https://dqsllenrklajenanpfnv.supabase.co';
const FALLBACK_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxc2xsZW5ya2xhamVuYW5wZm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5ODcyNDAsImV4cCI6MjA3NjU2MzI0MH0.5qXjGKeAjt9649NkUVxP64H0gJZ719fcuwggw0VWuEc';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
// Accept either EXPO_PUBLIC_SUPABASE_KEY or EXPO_PUBLIC_SUPABASE_ANON_KEY for compatibility
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_KEY;

// IMPORTANT SECURITY NOTE:
// - Use the project's public/anon/publishable key for client apps (Expo, web, mobile).
// - NEVER embed the `service_role` key in client apps — it has elevated privileges and must stay server-side.
// - For production, prefer storing keys as Expo/EAS secrets or environment variables, not in source.

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
