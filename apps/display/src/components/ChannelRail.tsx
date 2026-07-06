import { channels } from '../lib/constants';

interface ChannelRailProps {
  activeChannel: string;
  onSelectChannel: (id: string) => void;
}

export function ChannelRail({ activeChannel, onSelectChannel }: ChannelRailProps) {
  return (
    <div className="w-60 bg-discord-sidebar flex flex-col border-r border-discord-border shrink-0 select-none z-10">
      {/* Top Server Header Dropdown */}
      <div className="h-12 border-b border-discord-border px-4 flex items-center justify-between cursor-pointer hover:bg-discord-hover/40 transition-colors shrink-0 shadow-sm">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-white truncate leading-tight">Digital India Build Server</h2>
        </div>
        <span className="text-discord-muted text-xs font-bold ml-2">⌄</span>
      </div>

      {/* Events & Server Boosts Section */}
      <div className="px-2 py-2 space-y-0.5 border-b border-discord-border/40 shrink-0">
        <div className="w-full text-left px-2 py-1.5 rounded-[4px] text-xs font-semibold text-discord-muted hover:bg-discord-hover/50 hover:text-white transition-colors flex items-center gap-2 cursor-pointer">
          <span className="text-base leading-none">📅</span>
          <span className="truncate flex-1">Events</span>
          <span className="text-[10px] font-mono bg-brand-blurple/20 text-brand-blurple px-1.5 py-0.2 rounded-full font-bold">
            78 Live
          </span>
        </div>
        <div className="w-full text-left px-2 py-1.5 rounded-[4px] text-xs font-semibold text-discord-muted hover:bg-discord-hover/50 hover:text-white transition-colors flex items-center gap-2 cursor-pointer">
          <span className="text-base leading-none">🚀</span>
          <span className="truncate flex-1">Server Boosts</span>
          <span className="text-[10px] font-mono bg-pink-500/20 text-pink-400 px-1.5 py-0.2 rounded-full font-bold">
            Level 3
          </span>
        </div>
      </div>

      {/* Channel Categories List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 custom-scrollbar min-h-0">
        {(['WELCOME', 'BUILD', 'VENUE', 'FINAL'] as const).map((group) => {
          const groupChannels = channels.filter((c) => c.group === group);
          const categoryName =
            group === 'WELCOME'
              ? 'TEXT CHANNELS'
              : group === 'BUILD'
                ? 'BUILD FLOOR CHANNELS'
                : group === 'VENUE'
                  ? 'VENUE UPDATES'
                  : 'CEREMONY CHANNELS';

          return (
            <div key={group} className="space-y-0.5">
              {/* Category Header */}
              <div className="px-1.5 py-1 flex items-center justify-between text-[11px] font-bold text-discord-muted uppercase tracking-wider hover:text-white cursor-pointer group">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] transition-transform group-hover:translate-x-0.5">⌄</span>
                  <span>{categoryName}</span>
                </div>
                <span className="text-base leading-none opacity-0 group-hover:opacity-100 hover:text-white">+</span>
              </div>

              {/* Channels */}
              <div className="space-y-0.5">
                {groupChannels.map((ch) => {
                  const active = activeChannel === ch.id;
                  const isVoice = ch.id === 'mentor-desk' || ch.id === 'help-desk';
                  return (
                    <button
                      key={ch.id}
                      onClick={() => onSelectChannel(ch.id)}
                      className={`w-full text-left px-2 py-1.5 rounded-[4px] text-sm transition-all flex items-center justify-between group ${
                        active
                          ? 'bg-discord-panel-soft text-white font-semibold'
                          : 'text-discord-muted hover:bg-discord-hover/60 hover:text-discord-text font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className={`text-base leading-none shrink-0 ${active ? 'text-white font-bold' : 'text-[#80848e]'}`}>
                          {isVoice ? '🔊' : '#'}
                        </span>
                        <span className="truncate">{ch.name}</span>
                      </div>
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Iconic Bottom User Profile Bar (#232428) */}
      <div className="h-[52px] bg-discord-userbar px-2.5 flex items-center justify-between shrink-0 border-t border-discord-border/30">
        <div className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:bg-white/5 p-1 rounded-md transition-colors flex-1">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-brand-blurple flex items-center justify-center text-xs font-bold text-white shadow-inner">
              SD
            </div>
            <span className="w-3 h-3 rounded-full bg-brand-online border-2 border-discord-userbar absolute -bottom-0.5 -right-0.5 shadow-sm" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate leading-tight">Stage Display #1</p>
            <p className="text-[10px] text-discord-muted truncate leading-tight">Online · AV Kiosk</p>
          </div>
        </div>

        {/* Mic / Deafen / Settings Buttons */}
        <div className="flex items-center gap-0.5 shrink-0 text-discord-muted">
          <button title="Mute" className="p-1.5 hover:text-white hover:bg-discord-hover rounded transition-colors text-xs">
            🎤
          </button>
          <button title="Deafen" className="p-1.5 hover:text-white hover:bg-discord-hover rounded transition-colors text-xs">
            🎧
          </button>
          <button title="User Settings" className="p-1.5 hover:text-white hover:bg-discord-hover rounded transition-colors text-xs">
            ⚙️
          </button>
        </div>
      </div>
    </div>
  );
}
