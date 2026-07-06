interface AdminHeaderProps {
  teamsOnline: number;
  totalTeams: number;
  activeChannel: string;
  phase: string;
}

export function AdminHeader({ teamsOnline, totalTeams, activeChannel, phase }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6 justify-between shrink-0 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-brand-blurple flex items-center justify-center font-bold text-white shadow">
          ⚙️
        </div>
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">Digital India Build Server — Admin Console</h1>
          <p className="text-xs text-slate-400 leading-tight">
            Active: <span className="text-brand-blurple font-semibold">#{activeChannel}</span> · Phase:{' '}
            <span className="text-green-400 font-semibold uppercase">{phase.replace('_', ' ')}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/60">
        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
        <div className="text-right">
          <p className="text-sm font-bold text-white leading-tight">
            {teamsOnline} / {totalTeams} Teams Online
          </p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider leading-tight">Live Floor Sync</p>
        </div>
      </div>
    </header>
  );
}
