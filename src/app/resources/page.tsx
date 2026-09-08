import { BookOpen } from 'lucide-react';
import { INITIAL_RESOURCES } from '@/lib/store';

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs font-mono uppercase text-emerald-400 mb-1 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Learning Direction
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Curated Learning Resources</h1>
          <p className="text-xs text-zinc-400 mt-1">Hand-curated courses and introductory roadmaps mapped by interest track.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_RESOURCES.map(res => (
            <div key={res.id} className="bg-zinc-900/80 rounded-xl p-5 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-emerald-400">{res.category}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">{res.cost}</span>
              </div>
              <h3 className="text-sm font-bold text-white">{res.title}</h3>
              <div className="text-xs text-zinc-400">{res.provider} • {res.duration}</div>
              {res.youtubeId || res.url.includes('youtube.com') ? (
                <div className="aspect-video overflow-hidden rounded-lg border border-zinc-800 bg-black">
                  <iframe
                    className="h-full w-full"
                    src={res.youtubeId
                      ? `https://www.youtube-nocookie.com/embed/${res.youtubeId}`
                      : `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(res.title)}`}
                    title={res.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              <p className="text-xs text-zinc-300 italic pt-1 border-t border-zinc-800/80">"{res.whyRecommended}"</p>
              <a href={res.url} target="_blank" rel="noreferrer" className="inline-flex text-xs font-semibold text-emerald-400 hover:underline">
                Watch on YouTube
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
