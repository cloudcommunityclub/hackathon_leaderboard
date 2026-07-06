interface ConnectedDisplay {
  id: string;
  name?: string;
  location?: string;
  ip?: string;
  connectedAt?: string;
}

interface ConnectedDisplaysProps {
  displays: ConnectedDisplay[];
}

export function ConnectedDisplays({ displays }: ConnectedDisplaysProps) {
  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-lg backdrop-blur-sm md:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🖥️</span>
            <span>Connected Public Displays</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status of projector screens and TVs synced to the venue WebSocket gateway.
          </p>
        </div>
        <span className="text-xs font-mono bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-slate-300">
          {displays.length} Active Screen{displays.length === 1 ? '' : 's'}
        </span>
      </div>

      {displays.length === 0 ? (
        <div className="text-center py-10 bg-slate-900/40 border border-slate-800/80 rounded-xl text-slate-400 text-sm">
          <p className="text-base mb-1">No display screens connected yet.</p>
          <p className="text-xs text-slate-500">
            Open the public display client on a venue projector or TV to sync automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {displays.map((d, idx) => (
            <div
              key={d.id || idx}
              className="flex items-center justify-between bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm shadow-sm hover:border-brand-blurple/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-base shrink-0">
                  📺
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold truncate">{d.name || `Display #${idx + 1}`}</p>
                  <p className="text-xs text-slate-400 truncate">{d.location || d.ip || 'Main Stage / Lobby'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded-full shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] font-bold text-green-400 uppercase">Online</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
