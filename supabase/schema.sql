-- ============================================================================
-- STRIDE PLATFORM — PRODUCTION SUPABASE / POSTGRESQL SCHEMA WITH AUTH SYNC
-- 100% Idempotent Script — Safe to run multiple times in Supabase SQL Editor
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. USERS & PROFILES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  whatsapp_number TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  role TEXT NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('APPLICANT', 'MEMBER', 'ADMIN', 'SUPER_ADMIN')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'UNDER_REVIEW', 'SUSPENDED', 'WITHDRAWN')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- AUTOMATIC AUTH USER SYNC TRIGGER (Handles Email/Password + Google OAuth)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    'APPLICANT',
    'ACTIVE'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2. APPLICATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  current_tech_status TEXT NOT NULL,
  primary_area_of_interest TEXT NOT NULL,
  daily_learning_capacity TEXT NOT NULL,
  why_accountability_now TEXT NOT NULL,
  daily_reports_commitment BOOLEAN NOT NULL DEFAULT TRUE,
  saturday_call_commitment BOOLEAN NOT NULL DEFAULT TRUE,
  emergency_pass_acceptance BOOLEAN NOT NULL DEFAULT TRUE,
  discipline_plan TEXT NOT NULL,
  reflection_answer TEXT,
  score INTEGER NOT NULL DEFAULT 80,
  status TEXT NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'CLARIFICATION_REQUIRED', 'APPROVED', 'REJECTED', 'WITHDRAWN')),
  reviewer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. GOALS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  target_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. MILESTONES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED')),
  display_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. WEEKLY OBJECTIVES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weekly_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES public.milestones(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'COMPLETED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. WEEKLY PLANS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weekly_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REVIEWED', 'COMPLETED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. TASKS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  weekly_plan_id UUID REFERENCES public.weekly_plans(id) ON DELETE SET NULL,
  weekly_objective_id UUID REFERENCES public.weekly_objectives(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'TODAY', 'COMPLETED', 'PARTIALLY_COMPLETED', 'RESCHEDULED', 'MISSED', 'CANCELLED')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. CHECK-INS TABLE (1 per member per local date)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completion_status TEXT NOT NULL CHECK (completion_status IN ('YES', 'PARTIAL', 'NO', 'EMERGENCY_PASS')),
  learnings TEXT NOT NULL,
  completed_work TEXT NOT NULL,
  learning_time_minutes INTEGER NOT NULL DEFAULT 0,
  blockers TEXT,
  next_priority TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_daily_checkin UNIQUE (user_id, date)
);

-- ----------------------------------------------------------------------------
-- 9. EMERGENCY PASSES TABLE (Max 2 per month)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.emergency_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  month VARCHAR(7) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT,
  approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 10. RESOURCES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  provider TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Beginner' CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  duration TEXT,
  why_recommended TEXT,
  cost TEXT NOT NULL DEFAULT 'Free',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  is_intro_video BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.resources DROP CONSTRAINT IF EXISTS resources_category_check;

-- ----------------------------------------------------------------------------
-- 11. RECOMMENDATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 12. MEETINGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Saturday Accountability Review',
  meet_url TEXT NOT NULL,
  schedule TEXT NOT NULL DEFAULT 'Every Saturday at 4:00 PM UTC',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 13. NOTIFICATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'IN_APP',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'SENT' CHECK (status IN ('PENDING', 'SENT', 'FAILED'))
);

-- ----------------------------------------------------------------------------
-- 14. AUDIT EVENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  object_type TEXT NOT NULL,
  object_id TEXT NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_tasks_user_due ON public.tasks(user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON public.check_ins(user_id, date);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES — IDEMPOTENT (DROP IF EXISTS THEN CREATE)
-- ----------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile" ON public.users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can edit own profile" ON public.users;
CREATE POLICY "Users can edit own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can create own applications" ON public.applications;
CREATE POLICY "Users can create own applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own applications" ON public.applications;
CREATE POLICY "Users can read own applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own pending applications" ON public.applications;
CREATE POLICY "Users can update own pending applications" ON public.applications FOR UPDATE USING (auth.uid() = user_id AND status IN ('DRAFT', 'SUBMITTED', 'CLARIFICATION_REQUIRED')) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own goals" ON public.goals;
CREATE POLICY "Users can read own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own goals" ON public.goals;
CREATE POLICY "Users can create own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own goals" ON public.goals;
CREATE POLICY "Users can update own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own goals" ON public.goals;
CREATE POLICY "Users can delete own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own tasks" ON public.tasks;
CREATE POLICY "Users can read own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can access own milestones" ON public.milestones;
CREATE POLICY "Users can access own milestones" ON public.milestones FOR ALL USING (EXISTS (SELECT 1 FROM public.goals WHERE goals.id = milestones.goal_id AND goals.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.goals WHERE goals.id = milestones.goal_id AND goals.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can access own weekly objectives" ON public.weekly_objectives;
CREATE POLICY "Users can access own weekly objectives" ON public.weekly_objectives FOR ALL USING (EXISTS (SELECT 1 FROM public.milestones JOIN public.goals ON goals.id = milestones.goal_id WHERE milestones.id = weekly_objectives.milestone_id AND goals.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.milestones JOIN public.goals ON goals.id = milestones.goal_id WHERE milestones.id = weekly_objectives.milestone_id AND goals.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can access own weekly plans" ON public.weekly_plans;
CREATE POLICY "Users can access own weekly plans" ON public.weekly_plans FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own check-ins" ON public.check_ins;
CREATE POLICY "Users can read own check-ins" ON public.check_ins FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can access own emergency passes" ON public.emergency_passes;
CREATE POLICY "Users can access own emergency passes" ON public.emergency_passes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Members can view active resources" ON public.resources;
CREATE POLICY "Members can view active resources" ON public.resources FOR SELECT USING (active = TRUE);

DROP POLICY IF EXISTS "Users can access own recommendations" ON public.recommendations;
CREATE POLICY "Users can access own recommendations" ON public.recommendations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Members can view active meetings" ON public.meetings;
CREATE POLICY "Members can view active meetings" ON public.meetings FOR SELECT USING (active = TRUE);

DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own audit events" ON public.audit_events;
CREATE POLICY "Users can read own audit events" ON public.audit_events FOR SELECT USING (auth.uid() = actor_id);

DROP POLICY IF EXISTS "Users can create own audit events" ON public.audit_events;
CREATE POLICY "Users can create own audit events" ON public.audit_events FOR INSERT WITH CHECK (auth.uid() = actor_id);

DROP POLICY IF EXISTS "Admins have full access to users" ON public.users;
CREATE POLICY "Admins have full access to users" ON public.users FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
);

DROP POLICY IF EXISTS "Admins have full access to applications" ON public.applications;
CREATE POLICY "Admins have full access to applications" ON public.applications FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
);

DROP POLICY IF EXISTS "Admins have full access to operational data" ON public.milestones;
CREATE POLICY "Admins have full access to operational data" ON public.milestones FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')));

DROP POLICY IF EXISTS "Admins have full access to audit events" ON public.audit_events;
CREATE POLICY "Admins have full access to audit events" ON public.audit_events FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')));
