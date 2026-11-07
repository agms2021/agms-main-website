import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kpvjenicwrzuzrxvucmf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_4981M7nv9Kqd5DASiR4ikg_xOpbIiBL';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface CitizenUser {
  id: string;
  email?: string;
  phone?: string;
  fullName: string;
  role: 'citizen';
  source: 'website';
  accountId: string;
}

export interface CitizenApplication {
  id: string;
  service_name: string;
  status: string;
  created_at: string;
  expected_timeline?: string;
  tracking_id?: string;
  total_charge?: number;
}

/**
 * Register a new citizen from the public website
 * Attaches source='website' and scopes to the current tenant accountId
 */
export async function registerCitizen(params: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  accountId: string;
  district?: string;
  taluka?: string;
  village?: string;
  address?: string;
  alternatePhone?: string;
}): Promise<{ user: CitizenUser | null; error: string | null }> {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      accountId,
      district,
      taluka,
      village,
      address,
      alternatePhone
    } = params;

    // 1. Sign up user via Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          role: 'citizen',
          source: 'website',
          account_id: accountId,
          district: district || 'Nashik',
          taluka: taluka || 'Sinnar',
          village: village || '',
          address: address || '',
          alternate_phone: alternatePhone || '',
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'Registration failed. Please try again.' };
    }

    // 2. Mirror into CRM 'contacts' table via secure CRM Portal API
    try {
      await fetch('https://crm.agmultiservices.online/api/portal/citizen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId,
          fullName,
          phone,
          email,
          district: district || 'Nashik',
          taluka: taluka || 'Sinnar',
          village: village || null,
          address: address || null,
          alternatePhone: alternatePhone || null,
          source: 'website',
        }),
      });
    } catch (e) {
      console.warn('Could not mirror contact to CRM contacts table', e);
    }

    const citizen: CitizenUser = {
      id: data.user.id,
      email: data.user.email,
      phone: phone,
      fullName: fullName,
      role: 'citizen',
      source: 'website',
      accountId: accountId,
    };

    return { user: citizen, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error during registration';
    return { user: null, error: message };
  }
}

/**
 * Login existing citizen with email and password
 */
export async function loginCitizen(params: {
  email: string;
  password: string;
}): Promise<{ user: CitizenUser | null; error: string | null }> {
  try {
    const { email, password } = params;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'User not found' };
    }

    const metadata = data.user.user_metadata || {};
    const citizen: CitizenUser = {
      id: data.user.id,
      email: data.user.email,
      phone: metadata.phone || '',
      fullName: metadata.full_name || data.user.email?.split('@')[0] || 'नागरिक',
      role: 'citizen',
      source: metadata.source || 'website',
      accountId: metadata.account_id || '',
    };

    return { user: citizen, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    return { user: null, error: message };
  }
}

/**
 * Reset password via email
 */
export async function resetCitizenPassword(email: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Password reset failed';
    return { success: false, error: message };
  }
}

/**
 * Sign out current citizen
 */
export async function logoutCitizen(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Fetch citizen applications from CRM by phone or email
 */
export async function fetchCitizenApplications(phoneOrEmail: string): Promise<CitizenApplication[]> {
  try {
    if (!phoneOrEmail) return [];
    const cleanQuery = phoneOrEmail.replace(/\D/g, '');

    const url = `https://crm.agmultiservices.online/api/portal/citizen?phone=${cleanQuery}&email=${encodeURIComponent(phoneOrEmail)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.applications)) {
        return data.applications;
      }
    }
    return [];
  } catch {
    return [];
  }
}

