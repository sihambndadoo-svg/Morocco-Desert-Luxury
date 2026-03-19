import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env, hasSupabaseCredentials } from '@/lib/env';

let serviceClient: SupabaseClient<any, 'public', any> | null = null;

export function getServiceSupabase() {
  if (!hasSupabaseCredentials) {
    return null;
  }

  if (!serviceClient) {
    serviceClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  return serviceClient;
}
