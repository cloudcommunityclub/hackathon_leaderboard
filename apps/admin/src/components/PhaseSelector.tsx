import { EventPhase } from '@build-server/shared';

interface PhaseSelectorProps {
  currentPhase: string;
  onSelectPhase: (phase: string) => Promise<void>;
}

const PHASES: { id: EventPhase; label: string; desc: string; icon: string }[] = [
  { id: 'check_in', label: 'Check-In', desc: 'Arrivals & Hall of Builders', icon: '🎟️' },
  { id: 'coding', label: 'Coding Mode', desc: 'GitLab live, Milestones & Mentor', icon: '💻' },
  { id: 'meal', label: 'Meal & Break', desc: 'Food updates & announcements', icon: '🍕' },
  { id: 'mentor', label: 'Mentor Hours', desc: 'Help desk & active mentor sessions', icon: '🧑‍🏫' },
  { id: 'submission', label: 'Submission', desc: 'Final countdown & submission stats', icon: '⏳' },
  { id: 'post_submission', label: 'Ceremony', desc: 'Winners, awards & recap', icon: '🏆' },
];

export function PhaseSelector({ currentPhase, onSelectPhase }: PhaseSelectorProps) {
  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>📅</span>
          <span>Event Phase Switcher</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Switching the event phase automatically updates the Auto Pilot rotation pool across all public displays.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PHASES.map((p) => {
          const active = currentPhase === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelectPhase(p.id)}
              className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between ${
                active
                  ? 'bg-brand-blurple/20 border-brand-blurple text-white shadow-lg shadow-brand-blurple/20 ring-1 ring-brand-blurple'
                  : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{p.icon}</span>
                {active && (
                  <span className="w-2 h-2 rounded-full bg-brand-blurple shadow-[0_0_8px_rgba(88,101,242,1)]" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">{p.label}</p>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{p.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
