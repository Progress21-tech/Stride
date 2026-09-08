'use client';

import { useState, useEffect } from 'react';
import { Users, MessageSquare, Bell, Link as LinkIcon, Search, UserCheck, Share2, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { INITIAL_MEMBERS, INITIAL_CHECKINS, INITIAL_GOALS, INITIAL_RESOURCES } from '@/lib/store';
import { User, CheckIn, Goal } from '@/lib/types';

interface MemberWithStats {
  user: User;
  latestCheckIn?: CheckIn;
  goal?: Goal;
  streak: number;
  completionRate: number;
}

export default function CommunityPage() {
  const [members, setMembers] = useState<MemberWithStats[]>([]);
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'directory' | 'announcements'>('directory');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadCommunityData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data: fetchedMembers, error: memErr } = user
          ? await supabase
              .from('users')
              .select('*')
              .eq('role', 'MEMBER')
              .order('created_at', { ascending: false })
          : { data: INITIAL_MEMBERS.filter(u => u.role === 'MEMBER'), error: null };

        const memberList = (fetchedMembers || INITIAL_MEMBERS.filter(u => u.role === 'MEMBER')) as any[];

        const enrichedMembers: MemberWithStats[] = await Promise.all(
          memberList.map(async (member: any) => {
            const typedMember: User = {
              id: member.id,
              email: member.email,
              name: member.name,
              whatsappNumber: member.whatsapp_number,
              timezone: member.timezone,
              role: member.role,
              status: member.status,
              createdAt: member.created_at,
            };

            const { data: checkIns } = await supabase
              .from('check_ins')
              .select('*')
              .eq('user_id', member.id)
              .order('date', { ascending: false })
              .limit(30);

            const memberCheckIns: CheckIn[] = (checkIns || INITIAL_CHECKINS.filter(c => c.userId === member.id));

            let streak = 0;
            if (memberCheckIns.length > 0) {
              const today = new Date().toISOString().split('T')[0];
              const dates = new Set(
                memberCheckIns
                  .filter((c: any) => ['YES', 'PARTIAL', 'EMERGENCY_PASS'].includes(c.completion_status))
                  .map((c: any) => c.date)
              );
              let current = new Date().getTime();
              while (true) {
                const dStr = new Date(current).toISOString().split('T')[0];
                if (dates.has(dStr)) {
                  streak++;
                  current -= 86400000;
                } else {
                  break;
                }
              }
            }

            const goals = member.id === user?.id
              ? (INITIAL_GOALS.filter(g => g.userId === member.id))
              : [];

            return {
              user: typedMember,
              latestCheckIn: memberCheckIns[0] as CheckIn,
              goal: goals[0],
              streak,
              completionRate: 85,
            };
          })
        );

        setMembers(enrichedMembers);

        const { data: meetData } = await supabase
          .from('meetings')
          .select('meet_url, schedule')
          .eq('active', true)
          .single();

        setAnnouncements([
          `Saturday Review Call: ${meetData?.schedule || 'Every Saturday at 4:00 PM UTC'}`,
          meetData?.meet_url
            ? `Google Meet link: ${meetData.meet_url}`
            : 'Google Meet link available in admin console',
        ]);
      } catch (err) {
        console.error('Error loading community data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCommunityData();
  }, []);

  const filteredMembers = members.filter(m =>
    m.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'UNDER_REVIEW': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'SUSPENDED': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xs text-[var(--text-muted)]">Loading community...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-mono uppercase text-[#18A957] font-semibold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Accountability Group
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] mt-1">Community Hub</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">{members.length} active members in your cohort</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-[#18A957]/10 text-[#18A957] border border-[#18A957]/20 font-mono">
            Cohort Active
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-[var(--bg-subtle)] rounded-lg p-1 border border-[var(--border-color)] text-xs font-medium">
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex-1 px-3 py-1.5 rounded-lg transition ${
            activeTab === 'directory'
              ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          Member Directory
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex-1 px-3 py-1.5 rounded-lg transition ${
            activeTab === 'announcements'
              ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          Announcements
        </button>
      </div>

      {activeTab === 'directory' && (
        <>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-lg pl-9 pr-3 py-2 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#18A957]"
            />
          </div>

          <div className="glass-card rounded-xl border border-[var(--border-color)] overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[var(--bg-subtle)] border-b border-[var(--border-color)]">
                  <th className="text-left p-3 font-mono uppercase text-[var(--text-muted)]">Member</th>
                  <th className="text-left p-3 font-mono uppercase text-[var(--text-muted)]">Status</th>
                  <th className="text-left p-3 font-mono uppercase text-[var(--text-muted)]">Streak</th>
                  <th className="text-left p-3 font-mono uppercase text-[var(--text-muted)]">Goal</th>
                  <th className="text-left p-3 font-mono uppercase text-[var(--text-muted)]">Last Check-in</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredMembers.map((member) => (
                  <tr key={member.user.id} className="hover:bg-[var(--bg-subtle)]/50 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center text-xs font-bold text-[#18A957]">
                          {member.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium text-[var(--text-main)]">{member.user.name}</div>
                          <div className="text-[10px] text-[var(--text-muted)]">{member.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getStatusColor(member.user.status)}`}>
                        {member.user.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-[var(--text-main)] font-mono">{member.streak} days</span>
                    </td>
                    <td className="p-3 text-[var(--text-muted)]">
                      {member.goal?.title || '—'}
                    </td>
                    <td className="p-3 text-[var(--text-muted)]">
                      {member.latestCheckIn
                        ? new Date(member.latestCheckIn.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'No check-in yet'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-8 text-xs text-[var(--text-muted)]">
              No members match "{searchTerm}"
            </div>
          )}

          <div className="glass-card rounded-xl p-4 border border-[var(--border-color)] space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-main)]">
              <LinkIcon className="w-3.5 h-3.5 text-[#18A957]" /> Weekly Review
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              Next session: Every Saturday at 4:00 PM UTC
            </div>
            <a
              href="https://meet.google.com/abc-defg-hij"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-[#18A957] hover:bg-[#15944c] text-white transition flex items-center gap-1.5 w-fit"
            >
              Join Google Meet <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </>
      )}

      {activeTab === 'announcements' && (
        <div className="space-y-3">
          {announcements.map((announcement, idx) => (
            <div key={idx} className="glass-card rounded-xl p-4 border border-[var(--border-color)] space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-main)]">
                <Bell className="w-3.5 h-3.5 text-[#18A957]" />
                Announcement
              </div>
              <p className="text-xs text-[var(--text-muted)]">{announcement}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
