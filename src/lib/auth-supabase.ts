import { supabase } from './supabase';

// Email & Password Sign Up
export async function signUpWithEmail(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) throw error;
  return data;
}

// Email & Password Sign In
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data.session) {
    throw new Error('Login succeeded, but no session was created. Confirm the email address in Supabase Auth, then try again.');
  }
  return data;
}

// Google OAuth Sign In
export async function signInWithGoogle() {
  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) throw error;
  return data;
}

// Sign Out
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Get Current Logged In User
export async function getCurrentAuthSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}
