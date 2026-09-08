'use client';

import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ProgressPage() {
    const [stats, setStats] = useState({ checkIns: 0, tasks: 0, completedTasks: 0, minutes: 0, milestones: 0, completedMilestones: 0 });

    useEffect(() => {
        async function loadProgress() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const [{ data: checkIns }, { data: tasks }, { data: milestones }] = await Promise.all([
                supabase.from('check_ins').select('learning_time_minutes').eq('user_id', user.id),
                supabase.from('tasks').select('status').eq('user_id', user.id),
                supabase.from('milestones').select('status, goals!inner(user_id)').eq('goals.user_id', user.id),
            ]);
            setStats({
                checkIns: checkIns?.length || 0,
                tasks: tasks?.length || 0,
                completedTasks: tasks?.filter((task) => task.status === 'COMPLETED').length || 0,
                minutes: checkIns?.reduce((total, checkIn) => total + (checkIn.learning_time_minutes || 0), 0) || 0,
                milestones: milestones?.length || 0,
                completedMilestones: milestones?.filter((milestone) => milestone.status === 'COMPLETED').length || 0,
            });
        }
        loadProgress();
    }, []);

    const taskRate = stats.tasks ? Math.round((stats.completedTasks / stats.tasks) * 100) : 0;
    const hours = Math.floor(stats.minutes / 60);
    const minutes = stats.minutes % 60;

    return (
        <div className="space-y-6">
            <header className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#18A957]"><TrendingUp className="h-3.5 w-3.5" /> Historical evidence</div>
                <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">Your progress, as it is.</h1>
                <p className="text-sm text-[var(--text-muted)]">A live record of the work you have reported and completed.</p>
            </header>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    ['Check-ins submitted', `${stats.checkIns}`],
                    ['Task completion', `${taskRate}%`],
                    ['Learning time', `${hours}h ${minutes}m`],
                    ['Milestones completed', `${stats.completedMilestones} of ${stats.milestones}`],
                ].map(([label, value]) => <div key={label} className="glass-card rounded-xl p-5"><div className="text-xs text-[var(--text-muted)]">{label}</div><div className="mt-2 text-3xl font-bold text-[var(--text-main)]">{value}</div></div>)}
            </div>
        </div>
    );
}
