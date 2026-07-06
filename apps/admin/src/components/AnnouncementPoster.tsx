import { useState } from 'react';
import { DisplayChannel } from '@build-server/shared';

interface AnnouncementPosterProps {
  onPost: (path: string, body: any) => Promise<void>;
}

const CHANNELS: { id: DisplayChannel; label: string }[] = [
  { id: 'announcements', label: '#announcements (General)' },
  { id: 'food-updates', label: '#food-updates (Catering)' },
  { id: 'mentor-desk', label: '#mentor-desk (Mentorship)' },
  { id: 'milestones', label: '#milestones (Achievements)' },
  { id: 'sponsor-drops', label: '#sponsor-drops (Swag & Prizes)' },
  { id: 'help-desk', label: '#help-desk (Support)' },
];

export function AnnouncementPoster({ onPost }: AnnouncementPosterProps) {
  const [content, setContent] = useState('');
  const [channel, setChannel] = useState<string>('announcements');
  const [isEmergency, setIsEmergency] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setStatusMsg(null);
    try {
      await onPost('/api/admin/announcement', {
        content,
        channel,
        isEmergency,
        createdBy: 'Ops Command',
      });
      setContent('');
      setStatusMsg('✨ Announcement broadcasted successfully!');
      setTimeout(() => setStatusMsg(null), 4000);
    } catch {
      setStatusMsg('❌ Failed to send announcement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-lg backdrop-blur-sm md:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📢</span>
            <span>Broadcast Announcement</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Send live announcements or bot messages directly to specific venue channels.
          </p>
        </div>
        {statusMsg && <span className="text-xs font-semibold text-green-400 animate-fade-in">{statusMsg}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type announcement message here..."
          onKeyDown={(e) => e.key === 'Enter' && !loading && handlePost()}
          className="md:col-span-2 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-blurple transition-colors"
        />
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className="px-3 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-blurple transition-colors"
        >
          {CHANNELS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <button
          disabled={loading || !content.trim()}
          onClick={handlePost}
          className={`px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
            !content.trim() || loading
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-brand-blurple hover:bg-brand-blurple/90 text-white shadow-brand-blurple/30 active:scale-[0.98]'
          }`}
        >
          <span>🚀</span>
          <span>{loading ? 'Sending...' : 'Broadcast'}</span>
        </button>
      </div>

      <label className="inline-flex items-center gap-2.5 text-sm text-slate-300 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isEmergency}
          onChange={(e) => setIsEmergency(e.target.checked)}
          className="w-4 h-4 rounded border-slate-700 text-brand-blurple focus:ring-brand-blurple focus:ring-offset-slate-900 bg-slate-900"
        />
        <span className={isEmergency ? 'text-red-400 font-semibold' : ''}>
          Mark as Emergency / High Priority Alert
        </span>
      </label>
    </section>
  );
}
