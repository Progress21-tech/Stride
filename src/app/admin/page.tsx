'use client';

import { useState, useEffect } from 'react';
import { Shield, Inbox, Users, FileText, CheckCircle, X, HelpCircle, LayoutPanelLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { approveApplication, rejectApplication, requestClarification, fetchAuditEventsForObject } from '@/lib/stride-db';

export default function AdminPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [auditEvents, setAuditEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState<string>('');
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [appHistory, setAppHistory] = useState<Record<string, any[]>>({});
  const [loadError, setLoadError] = useState('');
  const [resourceForm, setResourceForm] = useState({ title: '', category: '', url: '', youtubeId: '' });
  const [meetingForm, setMeetingForm] = useState({ title: 'Saturday Review', meetUrl: '', schedule: '' });

  useEffect(() => {
    async function loadAdminData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setAdminId(user.id);

        // Fetch Applications pending review
        const { data: fetchedApps, error: appsError } = await supabase
          .from('applications')
          .select('*, applicant:users!applications_user_id_fkey(name, email, whatsapp_number, timezone)')
          .eq('status', 'SUBMITTED')
          .order('created_at', { ascending: false });

        if (appsError) throw new Error(`Pending applications could not be loaded: ${appsError.message}`);
        setApps(fetchedApps || []);

        // Fetch Approved Members
        const { data: fetchedMembers } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'MEMBER')
          .order('created_at', { ascending: false });

        setMembers(fetchedMembers || []);

        // Fetch Audit Log
        const { data: fetchedAudit } = await supabase
          .from('audit_events')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10);

        setAuditEvents(fetchedAudit || []);
      } catch (err: any) {
        console.error('Error loading Admin dashboard data:', err);
        setLoadError(err.message || 'Unable to load admin data.');
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const handleApprove = async (appId: string, name: string) => {
    try {
      await approveApplication(appId, adminId || '00000000-0000-0000-0000-000000000000');
      const approvedApp = apps.find((app) => app.id === appId);
      if (approvedApp?.applicant?.email) {
        const emailResponse = await fetch('/api/admin/send-approval-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: approvedApp.applicant.email, name }),
        });
        if (!emailResponse.ok) {
          const emailError = await emailResponse.json().catch(() => ({}));
          throw new Error(`Approved, but email failed: ${emailError.error || 'unknown error'}`);
        }
      }
      alert(`Approved application for ${name}! Member workspace provisioned and approval email sent.`);
      setApps(apps.filter(a => a.id !== appId));
    } catch (err: any) {
      alert(err.message || 'Failed to approve application.');
    }
  };

  const handleReject = async (appId: string, name: string) => {
    const notes = window.prompt(`Reject application for ${name}?\n\nEnter admin notes (optional, press Cancel to abort):`);
    if (notes === null) return;
    try {
      await rejectApplication(appId, adminId || '00000000-0000-0000-0000-000000000000', notes || undefined);
      alert(`Rejected application for ${name}.`);
      setApps(apps.filter(a => a.id !== appId));
      setExpandedApp(null);
    } catch (err: any) {
      alert(err.message || 'Failed to reject application.');
    }
  };

  const handleRequestClarification = async (appId: string, name: string) => {
    const notes = window.prompt(`Request clarification for ${name}?\n\nEnter your question / reason for clarification:`);
    if (!notes) return;
    try {
      await requestClarification(appId, adminId || '00000000-0000-0000-0000-000000000000', notes);
      alert(`Clarification requested for ${name}. Applicant will be notified.`);
      setApps(apps.filter(a => a.id !== appId));
      setExpandedApp(null);
    } catch (err: any) {
      alert(err.message || 'Failed to request clarification.');
    }
  };

  const handleAddResource = async (event: React.FormEvent) => {
    event.preventDefault();
    const { error } = await supabase.from('resources').insert({
      title: resourceForm.title,
      category: resourceForm.category,
      url: resourceForm.url,
      youtube_id: resourceForm.youtubeId || null,
      provider: 'Admin curated',
      level: 'Beginner',
      cost: 'Free',
      active: true,
      is_intro_video: Boolean(resourceForm.youtubeId),
    });
    if (error) alert(`Resource could not be added: ${error.message}`);
    else { alert('Resource added for that track.'); setResourceForm({ title: '', category: '', url: '', youtubeId: '' }); }
  };

  const handleSaveMeeting = async (event: React.FormEvent) => {
    event.preventDefault();
    await supabase.from('meetings').update({ active: false }).eq('active', true);
    const { error } = await supabase.from('meetings').insert({ title: meetingForm.title, meet_url: meetingForm.meetUrl, schedule: meetingForm.schedule, active: true });
    if (error) alert(`Review link could not be saved: ${error.message}`);
    else alert('Saturday review link published to members.');
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="text-xs font-mono uppercase text-amber-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Operations Console
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">Admin Overview Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <a href="/today" className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-2.5 py-1.5 text-[var(--text-main)] hover:bg-[var(--bg-subtle)]">
            <LayoutPanelLeft className="h-3.5 w-3.5" /> Member view
          </a>
          <span>Role: <span className="text-[var(--text-main)] font-medium">Group Admin</span></span>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-[var(--text-muted)]">Applications Pending</div>
          <div className="text-2xl font-bold text-amber-400">{apps.length}</div>
        </div>
        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-[var(--text-muted)]">Active Members</div>
          <div className="text-2xl font-bold text-emerald-400">{members.length}</div>
        </div>
        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-[var(--text-muted)]">At-Risk Members</div>
          <div className="text-2xl font-bold text-[var(--text-main)]">0</div>
        </div>
        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-[var(--text-muted)]">Saturday Review</div>
          <div className="text-sm font-bold text-[var(--text-main)] mt-1">Ready</div>
        </div>
        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-[var(--text-muted)]">Passes Used</div>
          <div className="text-2xl font-bold text-[var(--text-main)]">0</div>
        </div>
        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-[var(--text-muted)]">Audit Trace</div>
          <div className="text-2xl font-bold text-[var(--text-main)]">{auditEvents.length}</div>
        </div>
      </div>

      {/* Queue Section */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-[var(--text-main)] flex items-center gap-2">
          <Inbox className="w-4 h-4 text-amber-400" /> Applications Awaiting Review ({apps.length})
        </h2>

        <div className="space-y-4">
          {loadError && <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-300">{loadError}</div>}
          {loading && <div className="text-xs text-[var(--text-muted)] py-4">Loading queue...</div>}

          {!loading && apps.length === 0 && (
            <div className="text-xs text-[var(--text-muted)] italic py-2">No applications currently pending in queue.</div>
          )}

          {apps.map(app => {
            const isExpanded = expandedApp === app.id;
            const history = appHistory[app.id] || [];
            return (
              <div key={app.id} className="bg-[var(--card-bg)] rounded-xl p-5 border border-[var(--border-color)] space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                  <div>
                    <span className="text-sm font-bold text-[var(--text-main)]">{app.applicant?.name || 'Applicant'}</span>
                    <span className="text-xs text-[var(--text-muted)] ml-2">({app.applicant?.email})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                      Score: {app.score}/100
                    </span>
                    <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono">
                      {app.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[var(--text-main)]">
                  <div><span className="text-[var(--text-muted)]">Track:</span> {app.primary_area_of_interest}</div>
                  <div><span className="text-[var(--text-muted)]">Experience:</span> {app.current_tech_status}</div>
                  <div><span className="text-[var(--text-muted)]">Capacity:</span> {app.daily_learning_capacity}</div>
                  <div><span className="text-[var(--text-muted)]">Timezone:</span> {app.applicant?.timezone || 'UTC'}</div>
                </div>

                <p className="text-xs text-[var(--text-main)] bg-[var(--bg-subtle)] p-3 rounded border border-[var(--border-color)] font-mono">
                  "{app.why_accountability_now}"
                </p>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      if (isExpanded) {
                        setExpandedApp(null);
                      } else {
                        setExpandedApp(app.id);
                        fetchAuditEventsForObject('APPLICATION', app.id).then(events => {
                          setAppHistory(prev => ({ ...prev, [app.id]: events }));
                        });
                      }
                    }}
                    className="px-2.5 py-1.5 text-xs font-medium rounded bg-[var(--bg-subtle)] hover:bg-[var(--border-color)] text-[var(--text-main)] border border-[var(--border-color)] transition flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {isExpanded ? 'Hide Details' : 'View Full Application'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRequestClarification(app.id, app.applicant?.name || 'Applicant')}
                      className="px-3 py-1.5 text-xs font-medium rounded bg-[var(--bg-subtle)] hover:bg-[var(--border-color)] text-amber-600 dark:text-amber-400 border border-[var(--border-color)] transition flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> Request Clarification
                    </button>
                    <button
                      onClick={() => handleReject(app.id, app.applicant?.name || 'Applicant')}
                      className="px-3 py-1.5 text-xs font-medium rounded bg-[var(--bg-subtle)] hover:bg-[var(--border-color)] text-red-600 dark:text-red-400 border border-[var(--border-color)] transition"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(app.id, app.applicant?.name || 'Applicant')}
                      className="px-4 py-1.5 text-xs font-semibold rounded bg-[#18A957] hover:bg-[#15944c] text-white shadow-sm transition flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve & Provision
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="pt-3 border-t border-[var(--border-color)] space-y-4">
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[var(--text-muted)] font-medium">Discipline Plan:</span>
                        <p className="text-[var(--text-main)] mt-0.5 font-mono">{app.discipline_plan}</p>
                      </div>
                      {app.reflection_answer && (
                        <div>
                          <span className="text-[var(--text-muted)] font-medium">Reflection:</span>
                          <p className="text-[var(--text-main)] mt-0.5">{app.reflection_answer}</p>
                        </div>
                      )}
                      {app.reviewer_notes && (
                        <div>
                          <span className="text-[var(--text-muted)] font-medium">Admin Notes:</span>
                          <p className="text-[var(--text-main)] mt-0.5">{app.reviewer_notes}</p>
                        </div>
                      )}
                    </div>

                    {history.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-[var(--text-muted)]">Decision History:</div>
                        {history.map((event) => (
                          <div key={event.id} className="text-[10px] text-[var(--text-muted)] flex items-center gap-2">
                            <span className="font-mono">{new Date(event.timestamp).toLocaleString()}</span>
                            <span>—</span>
                            <span>{event.action}</span>
                            {event.metadata && (
                              <span className="text-[var(--text-muted)]">
                                {(() => { try { return JSON.stringify(JSON.parse(event.metadata)); } catch { return event.metadata; } })()}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleAddResource} className="glass-card space-y-3 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[var(--text-main)]">Add a track resource</h2>
          <input required value={resourceForm.title} onChange={(event) => setResourceForm({ ...resourceForm, title: event.target.value })} placeholder="Resource title" className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)] px-3 py-2 text-sm text-[var(--text-main)]" />
          <input required value={resourceForm.category} onChange={(event) => setResourceForm({ ...resourceForm, category: event.target.value })} placeholder="Exact onboarding track, e.g. AI Automation" className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)] px-3 py-2 text-sm text-[var(--text-main)]" />
          <input required type="url" value={resourceForm.url} onChange={(event) => setResourceForm({ ...resourceForm, url: event.target.value })} placeholder="https://..." className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)] px-3 py-2 text-sm text-[var(--text-main)]" />
          <input value={resourceForm.youtubeId} onChange={(event) => setResourceForm({ ...resourceForm, youtubeId: event.target.value })} placeholder="YouTube video ID (optional)" className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)] px-3 py-2 text-sm text-[var(--text-main)]" />
          <button className="rounded-lg bg-[#18A957] px-3 py-2 text-xs font-semibold text-white">Publish resource</button>
        </form>
        <form onSubmit={handleSaveMeeting} className="glass-card space-y-3 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[var(--text-main)]">Publish Saturday review</h2>
          <input required value={meetingForm.title} onChange={(event) => setMeetingForm({ ...meetingForm, title: event.target.value })} placeholder="Review title" className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)] px-3 py-2 text-sm text-[var(--text-main)]" />
          <input required type="url" value={meetingForm.meetUrl} onChange={(event) => setMeetingForm({ ...meetingForm, meetUrl: event.target.value })} placeholder="Google Meet or Zoom link" className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)] px-3 py-2 text-sm text-[var(--text-main)]" />
          <input required value={meetingForm.schedule} onChange={(event) => setMeetingForm({ ...meetingForm, schedule: event.target.value })} placeholder="Every Saturday at 4:00 PM UTC" className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)] px-3 py-2 text-sm text-[var(--text-main)]" />
          <button className="rounded-lg bg-[#18A957] px-3 py-2 text-xs font-semibold text-white">Publish review link</button>
        </form>
      </div>

      {/* Member Directory Table */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-[var(--text-main)] flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" /> Member Directory ({members.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-subtle)] text-[var(--text-muted)] uppercase font-mono border-b border-[var(--border-color)]">
              <tr>
                <th className="p-3">Member</th>
                <th className="p-3">Email</th>
                <th className="p-3">Timezone</th>
                <th className="p-3">Status</th>
                <th className="p-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-[var(--bg-subtle)] transition">
                  <td className="p-3 font-semibold text-[var(--text-main)]">{m.name}</td>
                  <td className="p-3 text-[var(--text-main)]">{m.email}</td>
                  <td className="p-3 text-[var(--text-muted)]">{m.timezone}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[var(--text-main)]">{m.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
