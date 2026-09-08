import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export async function fetchUserCheckIns(userId: string) {
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching check-ins from Supabase:', error);
    return [];
  }
  return data;
}

export async function submitDailyCheckIn(checkInPayload: {
  user_id: string;
  date: string;
  completion_status: 'YES' | 'PARTIAL' | 'NO' | 'EMERGENCY_PASS';
  learnings: string;
  completed_work: string;
  learning_time_minutes: number;
  blockers?: string;
  next_priority?: string;
}) {
  const { data, error } = await supabase
    .from('check_ins')
    .upsert([checkInPayload], { onConflict: 'user_id,date' });

  if (error) throw error;
  return data;
}

export async function fetchPendingApplications() {
  const { data, error } = await supabase
    .from('applications')
    .select('*, users(name, email)')
    .eq('status', 'SUBMITTED')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending applications:', error);
    return [];
  }
  return data;
}
