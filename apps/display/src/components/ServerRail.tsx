export function ServerRail() {
  return (
    <div className="w-[4%] min-w-[52px] bg-discord-sidebar flex flex-col items-center py-4 gap-4 border-r border-discord-border shrink-0">
      <ServerIcon active label="Build" />
      <ServerIcon label="Git" badge={3} />
      <ServerIcon label="Food" />
      <ServerIcon label="Mentor" />
      <div className="flex-1" />
      <ServerIcon label="Ops" muted />
    </div>
  );
}

function ServerIcon({ label, active, badge, muted }: { label: string; active?: boolean; badge?: number; muted?: boolean }) {
  return (
    <div
      className={`relative w-10 h-10 rounded-[24px] flex items-center justify-center text-sm font-bold font-display transition-all cursor-pointer ${
        active
          ? 'bg-brand-blurple text-white shadow-lg shadow-brand-blurple/30 rounded-[16px]'
          : muted
            ? 'text-discord-muted hover:bg-discord-hover hover:text-white hover:rounded-[16px]'
            : 'bg-discord-panel text-discord-muted hover:bg-discord-hover hover:text-white hover:rounded-[16px]'
      }`}
    >
      {label[0]}
      {badge ? (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-brand-danger text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-discord-sidebar px-1">
          {badge}
        </span>
      ) : null}
    </div>
  );
}
