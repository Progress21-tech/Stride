'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Clock,
  Sparkles,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { submitApplication } from '@/lib/stride-db';
import { supabase } from '@/lib/supabase';

const TOTAL_QUESTIONS = 12;

export default function ApplyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    timezone: 'Africa/Lagos (UTC+1)',
    techStatus: 'Complete Beginner',
    interest: 'Frontend Development',
    capacity: '2 hours/day',
    why: '',
    commitDaily: true,
    commitSaturday: true,
    commitEmergency: true,
    disciplinePlan: '',
  });

  // Load persisted draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('stride_onboarding_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to restore draft', e);
      }
    }
  }, []);

  // Save draft whenever formData changes
  const updateField = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    localStorage.setItem('stride_onboarding_draft', JSON.stringify(updated));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.fullName.trim().length >= 2;
      case 2: return formData.email.includes('@');
      case 3: return formData.whatsapp.trim().length >= 5;
      case 4: return !!formData.timezone;
      case 5: return !!formData.techStatus;
      case 6: return !!formData.interest;
      case 7: return formData.capacity.trim().length > 0;
      case 8: return true;
      case 9: return formData.commitDaily;
      case 10: return formData.commitSaturday;
      case 11: return formData.commitEmergency;
      case 12: return formData.disciplinePlan.trim().length >= 10;
      default: return true;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep <= TOTAL_QUESTIONS + 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Your session has expired. Please sign in again before submitting your application.');
      }

      const appRecord = await submitApplication({
        userId: user.id,
        userName: formData.fullName,
        userEmail: formData.email,
        whatsappNumber: formData.whatsapp,
        timezone: formData.timezone,
        currentTechStatus: formData.techStatus,
        primaryAreaOfInterest: formData.interest,
        dailyLearningCapacity: formData.capacity,
        whyAccountabilityNow: formData.why,
        dailyReportsCommitment: formData.commitDaily,
        saturdayCallCommitment: formData.commitSaturday,
        emergencyPassAcceptance: formData.commitEmergency,
        disciplinePlan: formData.disciplinePlan,
      });

      // Clear draft & navigate to Waiting Experience
      localStorage.removeItem('stride_onboarding_draft');
      localStorage.setItem('stride_user_application', JSON.stringify(appRecord));

      router.replace('/application-status');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = Math.min(100, Math.round((currentStep / (TOTAL_QUESTIONS + 1)) * 100));

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 space-y-6">

      {/* Header & Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
          <span className="flex items-center gap-1.5 font-semibold text-[#18A957]">
            <FileText className="w-3.5 h-3.5" /> Admission Screening
          </span>
          <span>
            {currentStep <= TOTAL_QUESTIONS ? `Question ${currentStep} of ${TOTAL_QUESTIONS}` : 'Final Summary'}
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full h-2 bg-[var(--bg-subtle)] rounded-full overflow-hidden border border-[var(--border-color)]">
          <div
            className="h-full bg-[#18A957] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Main Guided Form Container */}
      <div className="glass-card rounded-2xl p-6 sm:p-10 space-y-8 relative shadow-lg">

        {/* Step 1: Full Name */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#18A957] font-semibold">1. Identity</span>
              <h2 className="text-2xl font-bold text-[var(--text-main)]">What is your full name?</h2>
              <p className="text-sm text-[var(--text-muted)]">
                We use your name for group member verification and cohort reports.
              </p>
            </div>
            <input
              type="text"
              autoFocus
              value={formData.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              placeholder="e.g. David Okonjo"
              className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-4 py-3.5 text-base text-[var(--text-main)] focus:outline-none focus:border-[#18A957] transition"
              onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
            />
          </div>
        )}

        {/* Step 2: Email Address */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#18A957] font-semibold">2. Account Contact</span>
              <h2 className="text-2xl font-bold text-[var(--text-main)]">What is your primary email address?</h2>
              <p className="text-sm text-[var(--text-muted)]">
                This is where you will receive application updates and Saturday review invites.
              </p>
            </div>
            <input
              type="email"
              autoFocus
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="david@example.com"
              className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-4 py-3.5 text-base text-[var(--text-main)] focus:outline-none focus:border-[#18A957] transition"
              onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
            />
          </div>
        )}

        {/* Step 3: WhatsApp Number */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#18A957] font-semibold">3. Community Reach</span>
              <h2 className="text-2xl font-bold text-[var(--text-main)]">What is your WhatsApp number?</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Used for urgent check-in reminders, accountability partner syncs, and cohort announcements.
              </p>
            </div>
            <input
              type="text"
              autoFocus
              value={formData.whatsapp}
              onChange={(e) => updateField('whatsapp', e.target.value)}
              placeholder="+234 803 123 4567"
              className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-4 py-3.5 text-base text-[var(--text-main)] focus:outline-none focus:border-[#18A957] transition"
              onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
            />
          </div>
        )}

        {/* Step 4: Timezone */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#18A957] font-semibold">4. Deadline Alignment</span>
              <h2 className="text-2xl font-bold text-[var(--text-main)]">What is your current location / timezone?</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Daily reporting deadline is calculated at 11:59 PM in your local timezone.
              </p>
            </div>
            <select
              value={formData.timezone}
              onChange={(e) => updateField('timezone', e.target.value)}
              className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-4 py-3.5 text-base text-[var(--text-main)] focus:outline-none focus:border-[#18A957] transition"
            >
              <option value="Africa/Lagos (UTC+1)">Africa/Lagos (UTC+1)</option>
              <option value="Europe/London (UTC+0)">Europe/London (UTC+0)</option>
              <option value="America/New_York (UTC-5)">America/New_York (UTC-5)</option>
              <option value="America/Chicago (UTC-6)">America/Chicago (UTC-6)</option>
              <option value="America/Los_Angeles (UTC-8)">America/Los_Angeles (UTC-8)</option>
              <option value="Asia/Dubai (UTC+4)">Asia/Dubai (UTC+4)</option>
            </select>
          </div>
        )}

        {/* Step 5: Current Tech Status */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#18A957] font-semibold">5. Experience Context</span>
              <h2 className="text-2xl font-bold text-[var(--text-main)]">What is your current tech background status?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Complete Beginner',
                'Still Exploring Options',
                'Enrolled in Course',
                'Self-Taught / Practicing'
              ].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => updateField('techStatus', status)}
                  className={`p-4 rounded-xl border text-left text-sm font-medium transition flex items-center justify-between ${formData.techStatus === status
                    ? 'border-[#18A957] bg-[#18A957]/10 text-[#18A957] font-semibold'
                    : 'border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-main)] hover:border-[#18A957]/50'
                    }`}
                >
                  <span>{status}</span>
                  {formData.techStatus === status && <CheckCircle2 className="w-4 h-4 text-[#18A957]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Primary Area of Interest */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#18A957] font-semibold">6. Learning Track</span>
              <h2 className="text-2xl font-bold text-[var(--text-main)]">Which primary learning track are you pursuing?</h2>
              <p className="text-sm text-[var(--text-muted)]">
                This determines your introductory video orientation and course recommendation path.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Frontend Development', desc: 'HTML, CSS, JavaScript, React, accessibility' },
                { title: 'Backend Development', desc: 'APIs, Node.js, Python, databases, authentication' },
                { title: 'Full-Stack Development', desc: 'Frontend, backend, deployment, and product delivery' },
                { title: 'Mobile App Development', desc: 'React Native, Flutter, mobile UX, and app stores' },
                { title: 'Data Analysis', desc: 'SQL, spreadsheets, Python, dashboards, and insights' },
                { title: 'Data Science', desc: 'Statistics, Python, experimentation, and predictive models' },
                { title: 'Machine Learning', desc: 'Model training, evaluation, feature engineering, and ML systems' },
                { title: 'AI Engineering', desc: 'LLM applications, RAG, agents, evaluation, and deployment' },
                { title: 'AI Automation', desc: 'Workflow automation, APIs, agents, and no-code integrations' },
                { title: 'Generative AI & LLMs', desc: 'Prompting, fine-tuning, embeddings, and multimodal apps' },
                { title: 'Cloud Engineering', desc: 'AWS, Azure, containers, networking, and cloud architecture' },
                { title: 'DevOps & Platform Engineering', desc: 'CI/CD, Docker, Kubernetes, observability, and reliability' },
                { title: 'Cybersecurity', desc: 'Networking, threat modeling, ethical hacking, and defense' },
                { title: 'Data Engineering', desc: 'Pipelines, warehousing, Spark, orchestration, and data quality' },
                { title: 'Database Engineering', desc: 'SQL, data modeling, performance, and distributed databases' },
                { title: 'Product Design', desc: 'Figma, UX research, prototyping, and design systems' },
                { title: 'Product Management', desc: 'Discovery, roadmaps, prioritization, and product strategy' },
                { title: 'QA & Test Automation', desc: 'Testing strategy, Playwright, Cypress, APIs, and quality' },
                { title: 'Blockchain Development', desc: 'Smart contracts, Web3 apps, wallets, and protocol basics' },
                { title: 'Game Development', desc: 'Game design, Unity, Unreal, gameplay, and interactive systems' }
              ].map((track) => (
                <button
                  key={track.title}
                  type="button"
                  onClick={() => updateField('interest', track.title)}
                  className={`p-4 rounded-xl border text-left transition space-y-1 ${formData.interest === track.title
                    ? 'border-[#18A957] bg-[#18A957]/10 text-[var(--text-main)]'
                    : 'border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:border-[#18A957]/50'
                    }`}
                >
                  <div className="font-semibold text-sm text-[var(--text-main)] flex items-center justify-between">
                    {track.title}
                    {formData.interest === track.title && <CheckCircle2 className="w-4 h-4 text-[#18A957]" />}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">{track.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Daily Capacity */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#18A957] font-semibold">7. Time Commitment</span>
              <h2 className="text-2xl font-bold text-[var(--text-main)]">How many hours can you realistically commit each day?</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Be honest. A consistent 1-2 hours per day is far better than unsustainable bursts.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['1 hour/day', '1.5 hours/day', '2 hours/day', '3+ hours/day'].map((cap) => (
                <button
                  key={cap}
                  type="button"
                  onClick={() => updateField('capacity', cap)}
                  className={`p-3.5 rounded-xl border text-center text-xs font-medium transition ${formData.capacity === cap
                    ? 'border-[#18A957] bg-[#18A957]/10 text-[#18A957] font-semibold'
                    : 'border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-main)]'
                    }`}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 8: Motivation */}
        {currentStep === 8 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#18A957] font-semibold">8. Motivation</span>
              <h2 className="text-2xl font-bold text-[var(--text-main)]">Why are you pursuing this learning track right now?</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Share what you want to learn, build, or change. A short, honest answer is enough.
              </p>
            </div>

            <textarea
              rows={5}
              autoFocus
              value={formData.why}
              onChange={(e) => updateField('why', e.target.value)}
              placeholder="I have started multiple courses on Udemy and YouTube over the past 6 months, but I consistently drop out after week 2 when motivation fades. I realize I lack structure, clear daily deadlines, and a group of peers to report my progress to..."
              className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl p-4 text-sm text-[var(--text-main)] focus:outline-none focus:border-[#18A957] transition"
            ></textarea>

          </div>
        )}

        {/* Step 9: Daily Reporting Commitment */}
        {currentStep === 9 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#18A957] font-semibold">9. Daily Operating Agreement</span>
              <h2 className="text-2xl font-bold text-[var(--text-main)]">Daily Check-In Commitment</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Members agree to log their learning hours, completed tasks, and blockers every day before 11:59 PM in their timezone.
              </p>
            </div>

            <div
              onClick={() => updateField('commitDaily', !formData.commitDaily)}
              className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:border-[#18A957] transition cursor-pointer flex items-start gap-4"
            >
              <input
                type="checkbox"
                checked={formData.commitDaily}
                onChange={(e) => updateField('commitDaily', e.target.checked)}
                className="mt-1 w-5 h-5 rounded accent-[#18A957]"
              />
              <div className="space-y-1">
                <div className="font-semibold text-sm text-[var(--text-main)]">
                  I agree to log my daily check-in by 11:59 PM every single day.
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  Failure to report without an approved emergency pass impacts your consistency record.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 10: Saturday Call Commitment */}
        {currentStep === 10 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#18A957] font-semibold">10. Weekly Review Agreement</span>
              <h2 className="text-2xl font-bold text-[var(--text-main)]">Saturday Peer Review Call</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Every Saturday, members join a structured Google Meet session to review weekly completion rates and adjust next week's plan.
              </p>
            </div>

            <div
              onClick={() => updateField('commitSaturday', !formData.commitSaturday)}
              className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:border-[#18A957] transition cursor-pointer flex items-start gap-4"
            >
              <input
                type="checkbox"
                checked={formData.commitSaturday}
                onChange={(e) => updateField('commitSaturday', e.target.checked)}
                className="mt-1 w-5 h-5 rounded accent-[#18A957]"
              />
              <div className="space-y-1">
                <div className="font-semibold text-sm text-[var(--text-main)]">
                  I agree to attend the mandatory Saturday group review meetings.
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  Absences must be logged with group admins in advance.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 11: Emergency Pass Policy */}
        {currentStep === 11 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#18A957] font-semibold">11. Attendance Policy</span>
              <h2 className="text-2xl font-bold text-[var(--text-main)]">Emergency Pass Acceptance</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Life happens. Stride allows a maximum of 2 emergency passes per calendar month to excuse unavoidable missed days.
              </p>
            </div>

            <div
              onClick={() => updateField('commitEmergency', !formData.commitEmergency)}
              className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:border-[#18A957] transition cursor-pointer flex items-start gap-4"
            >
              <input
                type="checkbox"
                checked={formData.commitEmergency}
                onChange={(e) => updateField('commitEmergency', e.target.checked)}
                className="mt-1 w-5 h-5 rounded accent-[#18A957]"
              />
              <div className="space-y-1">
                <div className="font-semibold text-sm text-[var(--text-main)]">
                  I accept the rule of maximum 2 emergency passes per month.
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  Unexplained defaults beyond allowance will result in removal from the cohort.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 12: Discipline Plan */}
        {currentStep === 12 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#18A957] font-semibold">12. Resilience Strategy</span>
              <h2 className="text-2xl font-bold text-[var(--text-main)]">What is your discipline plan when motivation inevitably drops?</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Describe your exact backup plan (e.g., studying in 25-min pomodoros, contacting your accountability partner, reducing daily scope).
              </p>
            </div>

            <textarea
              rows={4}
              autoFocus
              value={formData.disciplinePlan}
              onChange={(e) => updateField('disciplinePlan', e.target.value)}
              placeholder="When motivation drops, I will reduce my target to just 30 minutes of focused study instead of quitting entirely. I will also post a blocker message to my group leader right away..."
              className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl p-4 text-sm text-[var(--text-main)] focus:outline-none focus:border-[#18A957] transition"
            ></textarea>
          </div>
        )}

        {/* Step 13: Final Commitment Summary Screen (PRD Section 8.2) */}
        {currentStep === 13 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#18A957] font-semibold">Review & Submit</span>
              <h2 className="text-2xl font-bold text-[var(--text-main)]">Final Commitment Summary</h2>
              <p className="text-sm text-[var(--text-muted)]">
                You are applying to a structured accountability group. Review your responses before submitting for admin review.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl p-5 space-y-4 text-xs text-[var(--text-main)]">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-[var(--border-color)]">
                <div>
                  <div className="text-[var(--text-muted)] font-medium">Applicant Name</div>
                  <div className="font-semibold text-sm">{formData.fullName}</div>
                </div>
                <div>
                  <div className="text-[var(--text-muted)] font-medium">Email</div>
                  <div className="font-semibold text-sm">{formData.email}</div>
                </div>
                <div>
                  <div className="text-[var(--text-muted)] font-medium">Learning Track</div>
                  <div className="font-semibold text-[#18A957]">{formData.interest}</div>
                </div>
                <div>
                  <div className="text-[var(--text-muted)] font-medium">Daily Capacity</div>
                  <div className="font-semibold">{formData.capacity}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[var(--text-muted)] font-medium">Motivation Statement</div>
                <div className="italic bg-[var(--bg-surface)] p-3 rounded border border-[var(--border-color)]">
                  "{formData.why}"
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[var(--text-muted)] font-medium">Discipline Plan</div>
                <div className="italic bg-[var(--bg-surface)] p-3 rounded border border-[var(--border-color)]">
                  "{formData.disciplinePlan}"
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded bg-[#18A957]/10 text-[#18A957] font-semibold border border-[#18A957]/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Daily 11:59 PM Check-in
                </span>
                <span className="px-2.5 py-1 rounded bg-[#18A957]/10 text-[#18A957] font-semibold border border-[#18A957]/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Saturday Review Call
                </span>
                <span className="px-2.5 py-1 rounded bg-[#18A957]/10 text-[#18A957] font-semibold border border-[#18A957]/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Max 2 Passes/Month
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-sm font-semibold rounded-xl bg-[#18A957] hover:bg-[#15944c] text-white shadow-md transition flex items-center justify-center gap-2"
              >
                {loading ? 'Submitting Application...' : 'Confirm Commitment & Submit Application'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        {currentStep <= TOTAL_QUESTIONS && (
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border border-[var(--border-color)] transition flex items-center gap-1.5 ${currentStep === 1
                ? 'opacity-40 cursor-not-allowed text-[var(--text-muted)]'
                : 'text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
                }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-6 py-2.5 text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 ${canProceed()
                ? 'bg-[#18A957] hover:bg-[#15944c] text-white'
                : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] opacity-60 cursor-not-allowed'
                }`}
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
