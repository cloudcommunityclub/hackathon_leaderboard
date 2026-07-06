export function ServerRail() {
  return (
    <div className="w-[72px] bg-discord-rail flex flex-col items-center py-3 gap-2 border-r border-discord-border shrink-0 select-none z-20">
      {/* Top Discord Home / Main Server Icon */}
      <ServerIcon active label="DI" title="Digital India Build Server" isHome />
      
      {/* Horizontal Divider */}
      <div className="w-8 h-[2px] bg-[#35363c] rounded my-1 shrink-0" />

      {/* Server List */}
      <ServerIcon label="GL" title="GitLab Live Activity" badge={4} />
      <ServerIcon label="FD" title="Food & Catering" />
      <ServerIcon label="MD" title="Mentor Desk" />
      <ServerIcon label="AV" title="Stage AV & Production" />
      
      <div className="flex-1" />

      {/* Bottom Plus / Explore Icons */}
      <div className="w-12 h-12 rounded-[24px] bg-discord-sidebar text-brand-online hover:bg-brand-online hover:text-white hover:rounded-[16px] transition-all duration-200 flex items-center justify-center text-xl font-bold cursor-pointer shadow-sm group relative">
        <span className="w-1 h-5 bg-white rounded-r-full absolute left-0 -ml-[12px] opacity-0 group-hover:opacity-100 transition-all duration-200" />
        <span>+</span>
      </div>
      <div className="w-12 h-12 rounded-[24px] bg-discord-sidebar text-discord-muted hover:bg-brand-blurple hover:text-white hover:rounded-[16px] transition-all duration-200 flex items-center justify-center text-lg cursor-pointer shadow-sm group relative">
        <span className="w-1 h-5 bg-white rounded-r-full absolute left-0 -ml-[12px] opacity-0 group-hover:opacity-100 transition-all duration-200" />
        <span>🧭</span>
      </div>
    </div>
  );
}

function ServerIcon({
  label,
  active,
  badge,
  isHome,
  title,
}: {
  label: string;
  active?: boolean;
  badge?: number;
  isHome?: boolean;
  title?: string;
}) {
  return (
    <div className="relative flex items-center justify-center w-full group cursor-pointer" title={title}>
      {/* Left White Pill Indicator */}
      <span
        className={`w-1 bg-white rounded-r-full absolute left-0 transition-all duration-200 ${
          active
            ? 'h-10 opacity-100'
            : 'h-5 opacity-0 group-hover:opacity-100 group-hover:h-5'
        }`}
      />

      {/* Server Icon Box */}
      <div
        className={`w-12 h-12 flex items-center justify-center text-sm font-bold transition-all duration-200 relative shadow-sm ${
          active
            ? 'bg-brand-blurple text-white rounded-[16px] shadow-brand-blurple/30'
            : isHome
              ? 'bg-brand-blurple/80 text-white rounded-[24px] group-hover:rounded-[16px] group-hover:bg-brand-blurple'
              : 'bg-discord-sidebar text-discord-text rounded-[24px] group-hover:rounded-[16px] group-hover:bg-brand-blurple group-hover:text-white'
        }`}
      >
        {isHome ? <span className="text-xl">🇮🇳</span> : <span>{label}</span>}

        {/* Notification Pill Badge */}
        {badge ? (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-brand-danger text-[11px] font-bold text-white flex items-center justify-center rounded-full border-2 border-discord-rail px-1 shadow-sm">
            {badge}
          </span>
        ) : null}
      </div>
    </div>
  );
}
