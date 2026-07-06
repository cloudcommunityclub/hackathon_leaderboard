import { channels } from '../lib/constants';

interface ChannelRailProps {
  activeChannel: string;
  onSelectChannel: (id: string) => void;
}

export function ChannelRail({ activeChannel, onSelectChannel }: ChannelRailProps) {
  return (
    <div className="w-[15%] bg-discord-sidebar flex flex-col border-r border-discord-border shrink-0">
      <div className="p-4 border-b border-discord-border">
        <h2 className="text-sm font-semibold text-white font-display">Channels</h2>
        <p className="text-xs text-discord-muted mt-1">Digital India Build Server</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {(['WELCOME', 'BUILD', 'VENUE', 'FINAL'] as const).map((group) => {
          const groupChannels = channels.filter((c) => c.group === group);
          return (
            <div key={group}>
              <p className="text-xs font-medium text-discord-muted mb-2 px-1 tracking-wider">{group}</p>
              <div className="space-y-0.5">
                {groupChannels.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => onSelectChannel(ch.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center ${
                      activeChannel === ch.id
                        ? 'bg-discord-panel-soft text-white'
                        : 'text-discord-muted hover:bg-discord-panel hover:text-white'
                    }`}
                  >
                    <span className="text-xs mr-1.5 text-brand-blurple font-bold">#</span>
                    <span className="truncate">{ch.name}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
