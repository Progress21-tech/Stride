import { supabase } from './supabase';
import { User, Application, Goal, Task, CheckIn, EmergencyPass, Resource, AuditEvent } from './types';

// ============================================================================
// 1. USER & PROFILE OPERATIONS
// ============================================================================
export async function getProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    whatsappNumber: data.whatsapp_number,
    timezone: data.timezone,
    role: data.role,
    status: data.status,
    createdAt: data.created_at,
  };
}

// ============================================================================
// 2. APPLICATION OPERATIONS (PRD Section 10 & 11)
// ============================================================================
export async function submitApplication(payload: {
  userId: string;
  userName: string;
  userEmail: string;
  whatsappNumber: string;
  timezone: string;
  currentTechStatus: string;
  primaryAreaOfInterest: string;
  dailyLearningCapacity: string;
  whyAccountabilityNow: string;
  dailyReportsCommitment: boolean;
  saturdayCallCommitment: boolean;
  emergencyPassAcceptance: boolean;
  disciplinePlan: string;
}): Promise<Application> {
  // Score Calculation Rule Engine (PRD Section 10.2)
  let score = 70;
  if (payload.whyAccountabilityNow.split(' ').length >= 50) score += 15;
  if (payload.dailyReportsCommitment && payload.saturdayCallCommitment && payload.emergencyPassAcceptance) score += 15;

  const { data, error } = await supabase
    .from('applications')
    .insert([
      {
        user_id: payload.userId,
        current_tech_status: payload.currentTechStatus,
        primary_area_of_interest: payload.primaryAreaOfInterest,
        daily_learning_capacity: payload.dailyLearningCapacity,
        why_accountability_now: payload.whyAccountabilityNow,
        daily_reports_commitment: payload.dailyReportsCommitment,
        saturday_call_commitment: payload.saturdayCallCommitment,
        emergency_pass_acceptance: payload.emergencyPassAcceptance,
        discipline_plan: payload.disciplinePlan,
        score,
        status: 'SUBMITTED',
      },
    ])
    .select()
    .single();

  if (error) throw error;

  await logAuditEvent(payload.userId, 'APPLICATION_SUBMITTED', 'APPLICATION', data.id, {
    track: payload.primaryAreaOfInterest,
    score,
  });

  return {
    id: data.id,
    userId: data.user_id,
    userName: payload.userName,
    userEmail: payload.userEmail,
    whatsappNumber: payload.whatsappNumber,
    timezone: payload.timezone,
    currentTechStatus: data.current_tech_status,
    primaryAreaOfInterest: data.primary_area_of_interest,
    dailyLearningCapacity: data.daily_learning_capacity,
    whyAccountabilityNow: data.why_accountability_now,
    dailyReportsCommitment: data.daily_reports_commitment,
    saturdayCallCommitment: data.saturday_call_commitment,
    emergencyPassAcceptance: data.emergency_pass_acceptance,
    disciplinePlan: data.discipline_plan,
    score: data.score,
    status: data.status,
    createdAt: data.created_at,
  };
}

export async function saveReflectionAnswer(applicationId: string, reflectionAnswer: string) {
  const { error } = await supabase
    .from('applications')
    .update({ reflection_answer: reflectionAnswer, status: 'UNDER_REVIEW' })
    .eq('id', applicationId);

  if (error) throw error;
}

export async function fetchApplicationById(applicationId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*, users(name, email, whatsapp_number, timezone)')
    .eq('id', applicationId)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchAuditEventsForObject(objectType: string, objectId: string) {
  const { data, error } = await supabase
    .from('audit_events')
    .select('*')
    .eq('object_type', objectType)
    .eq('object_id', objectId)
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching audit events:', error);
    return [];
  }
  return data;
}

// ============================================================================
// 3. TASKS & GOAL OPERATIONS (PRD Section 13)
// ============================================================================
export async function getTodayTasks(userId: string): Promise<Task[]> {
  const todayStr = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('due_date', todayStr)
    .order('created_at', { ascending: true });

  if (error || !data) return [];
  return data.map((t) => ({
    id: t.id,
    userId: t.user_id,
    weeklyObjectiveId: t.weekly_objective_id,
    title: t.title,
    dueDate: t.due_date,
    status: t.status,
    completedAt: t.completed_at,
  }));
}

export async function createDailyTask(userId: string, title: string): Promise<Task> {
  const todayStr = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('tasks')
    .insert([
      {
        user_id: userId,
        title,
        due_date: todayStr,
        status: 'PLANNED',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    dueDate: data.due_date,
    status: data.status,
  };
}

export async function updateTaskStatus(taskId: string, status: Task['status']) {
  const completedAt = status === 'COMPLETED' ? new Date().toISOString() : null;
  const { error } = await supabase
    .from('tasks')
    .update({ status, completed_at: completedAt })
    .eq('id', taskId);

  if (error) throw error;
}

// ============================================================================
// 4. DAILY CHECK-IN & STREAK CALCULATOR (PRD Section 14)
// ============================================================================
export async function submitCheckIn(payload: {
  userId: string;
  completionStatus: 'YES' | 'PARTIAL' | 'NO' | 'EMERGENCY_PASS';
  learnings: string;
  completedWork: string;
  learningTimeMinutes: number;
  blockers?: string;
  nextPriority?: string;
}): Promise<CheckIn> {
  const dateStr = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('check_ins')
    .upsert(
      [
        {
          user_id: payload.userId,
          date: dateStr,
          completion_status: payload.completionStatus,
          learnings: payload.learnings,
          completed_work: payload.completedWork,
          learning_time_minutes: payload.learningTimeMinutes,
          blockers: payload.blockers || null,
          next_priority: payload.nextPriority || null,
        },
      ],
      { onConflict: 'user_id,date' }
    )
    .select()
    .single();

  if (error) throw error;

  await logAuditEvent(payload.userId, 'CHECKIN_SUBMITTED', 'CHECK_IN', data.id, {
    status: payload.completionStatus,
    time: payload.learningTimeMinutes,
  });

  return {
    id: data.id,
    userId: data.user_id,
    date: data.date,
    completionStatus: data.completion_status,
    learnings: data.learnings,
    completedWork: data.completed_work,
    learningTimeMinutes: data.learning_time_minutes,
    blockers: data.blockers,
    nextPriority: data.next_priority,
    createdAt: data.created_at,
  };
}

export async function calculateUserStreak(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('check_ins')
    .select('date, completion_status')
    .eq('user_id', userId)
    .in('completion_status', ['YES', 'PARTIAL', 'EMERGENCY_PASS'])
    .order('date', { ascending: false });

  if (error || !data || data.length === 0) return 0;

  const dates = data.map((d) => d.date);
  let streak = 0;
  let currentMs = new Date().getTime();

  while (true) {
    const dStr = new Date(currentMs).toISOString().split('T')[0];
    if (dates.includes(dStr)) {
      streak++;
      currentMs -= 86400000;
    } else {
      break;
    }
  }

  return streak;
}

// ============================================================================
// 5. EMERGENCY PASSES (PRD Section 14.3 — Max 2 per month)
// ============================================================================
export async function useEmergencyPass(userId: string, reason?: string): Promise<boolean> {
  const monthStr = new Date().toISOString().substring(0, 7);

  // Count passes used this month
  const { count, error: countErr } = await supabase
    .from('emergency_passes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('month', monthStr);

  if (countErr) throw countErr;
  if ((count || 0) >= 2) {
    throw new Error('Monthly emergency pass allowance reached (2 passes max per calendar month).');
  }

  const { data, error } = await supabase
    .from('emergency_passes')
    .insert([
      {
        user_id: userId,
        month: monthStr,
        reason: reason || 'Emergency pass requested by member',
      },
    ])
    .select()
    .single();

  if (error) throw error;

  await logAuditEvent(userId, 'EMERGENCY_PASS_USED', 'EMERGENCY_PASS', data.id, { month: monthStr });
  return true;
}

// ============================================================================
// 6. ADMIN OPERATIONS & AUDIT LOG (PRD Section 16)
// ============================================================================
export async function approveApplication(applicationId: string, reviewerId: string) {
  // Fetch application details
  const { data: app, error: appErr } = await supabase
    .from('applications')
    .select('*')
    .eq('id', applicationId)
    .single();

  if (appErr || !app) throw new Error('Application not found');

  // Update application status
  await supabase
    .from('applications')
    .update({ status: 'APPROVED', reviewer_id: reviewerId, reviewed_at: new Date().toISOString() })
    .eq('id', applicationId);

  // Provision User Status
  await supabase
    .from('users')
    .update({ status: 'ACTIVE', role: 'MEMBER' })
    .eq('id', app.user_id);

  // Log Audit Event
  await logAuditEvent(reviewerId, 'APPLICATION_APPROVED', 'APPLICATION', applicationId, {
    userId: app.user_id,
    track: app.primary_area_of_interest,
  });
}

export async function logAuditEvent(
  actorId: string,
  action: string,
  objectType: string,
  objectId: string,
  metadata?: any
) {
  await supabase.from('audit_events').insert([
    {
      actor_id: actorId,
      action,
      object_type: objectType,
      object_id: objectId,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  ]);
}
