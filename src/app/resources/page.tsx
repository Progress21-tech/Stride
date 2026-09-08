'use client';

import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { INITIAL_RESOURCES } from '@/lib/store';

type Resource = {
  id: string;
  title: string;
  url: string;
  provider: string;
  category: string;
  level: string;
  duration?: string;
  why_recommended?: string;
  cost: string;
  youtube_id?: string;
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [track, setTrack] = useState('your selected track');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResources() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: application } = await supabase
        .from('applications')
        .select('primary_area_of_interest')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      const selectedTrack = application?.primary_area_of_interest;
      if (selectedTrack) setTrack(selectedTrack);
      const query = supabase.from('resources').select('*').eq('active', true).order('created_at', { ascending: false });
      const { data } = selectedTrack ? await query.eq('category', selectedTrack) : await query.eq('category', '__none__');
      const databaseResources = data || [];
      if (databaseResources.length > 0) {
        setResources(databaseResources);
      } else {
        const localResources = INITIAL_RESOURCES
          .filter((resource) => resource.category === selectedTrack)
          .map((resource) => ({
            id: resource.id,
            title: resource.title,
            url: resource.url,
            provider: resource.provider,
            category: resource.category,
            level: resource.level,
            duration: resource.duration,
            why_recommended: resource.whyRecommended,
            cost: resource.cost,
            youtube_id: resource.youtubeId,
          }));
        setResources(localResources);
      }
      setLoading(false);
    }
    loadResources();
  }, []);

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs font-mono uppercase text-emerald-400 mb-1 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Learning Direction
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">Curated Learning Resources</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Resources for {track}, selected from your onboarding track.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading && <div className="text-sm text-[var(--text-muted)]">Loading your resources...</div>}
          {!loading && resources.length === 0 && <div className="text-sm text-[var(--text-muted)]">No resources have been added for this track yet.</div>}
          {resources.map(res => (
            <div key={res.id} className="bg-[var(--card-bg)] rounded-xl p-5 border border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#18A957]">{res.category}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-main)] border border-[var(--border-color)]">{res.cost}</span>
              </div>
              <h3 className="text-sm font-bold text-[var(--text-main)]">{res.title}</h3>
              <div className="text-xs text-[var(--text-muted)]">{res.provider} • {res.duration}</div>
              {res.youtube_id && (
                <div className="aspect-video overflow-hidden rounded-lg border border-[var(--border-color)] bg-black">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${res.youtube_id}`}
                    title={res.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              <p className="text-xs text-[var(--text-muted)] italic pt-1 border-t border-[var(--border-color)]">"{res.why_recommended}"</p>
              {res.youtube_id && <a href={res.url} target="_blank" rel="noreferrer" className="inline-flex text-xs font-semibold text-emerald-400 hover:underline">
                Open on YouTube
              </a>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
