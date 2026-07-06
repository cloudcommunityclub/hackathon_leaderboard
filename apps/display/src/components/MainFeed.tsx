import { motion, AnimatePresence } from 'framer-motion';
import { Team, Welcome, BotMessage } from '@build-server/shared';
import { channels, botAuthors } from '../lib/constants';

interface MainFeedProps {
  activeChannel: string;
  welcome: Welcome | null;
  teams: Team[];
  messages: BotMessage[];
  onShowCursor: () => void;
}

export function MainFeed({ activeChannel, welcome, teams, messages, onShowCursor }: MainFeedProps) {
  const currentChannel = channels.find((c) => c.id === activeChannel) || channels[0];
  const isWelcomeActive = !!welcome;

  const teamsByTrack = teams.reduce<Record<string, Team[]>>((acc, team) => {
    acc[team.track] = acc[team.track] || [];
    acc[team.track].push(team);
    return acc;
  }, {});

  return (
    <div className="flex-1 flex flex-col bg-discord-bg relative min-w-0">
      {/* Channel Header */}
      <div className="h-14 border-b border-discord-border flex items-center px-6 gap-3 shrink-0">
        <span className="text-brand-blurple text-lg font-medium">#</span>
        <h2 className="text-base font-semibold text-white">{currentChannel.name}</h2>
        <p className="text-sm text-discord-muted ml-3 truncate">{currentChannel.description}</p>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onShowCursor}
            className="text-xs px-3 py-1.5 rounded-md bg-brand-blurple text-white hover:opacity-90 transition-opacity font-medium shadow-sm"
          >
            Show Cursor
          </button>
        </div>
      </div>

      {/* Channel Content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {isWelcomeActive && welcome ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center p-8 z-10 bg-discord-bg/95 backdrop-blur-sm"
            >
              <div className="max-w-3xl w-full">
                <div className="bg-discord-panel-soft border border-discord-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blurple/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
                  <div className="flex items-start gap-6 relative z-10">
                    <div className="w-20 h-20 rounded-full bg-brand-blurple flex items-center justify-center text-3xl shrink-0 shadow-lg shadow-brand-blurple/30 animate-bounce">
                      🚀
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-green-400 text-sm font-semibold mb-2 tracking-wide uppercase flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                        → {welcome.template || 'New Builder Arrived!'}
                      </p>
                      <h3 className="text-5xl font-bold text-white font-display tracking-tight truncate">
                        {welcome.teamName}
                      </h3>
                      <p className="text-discord-muted text-lg mt-2 font-medium">
                        {welcome.college} · <span className="text-brand-blurple font-semibold">{welcome.track}</span>
                      </p>
                      <div className="mt-6 inline-flex items-center gap-3 bg-discord-panel border border-discord-border rounded-xl px-5 py-3 shadow-inner">
                        <span className="text-sm font-semibold text-white">{welcome.ctaLabel || 'Scan to wave at this team! 👋'}</span>
                      </div>
                      <p className="text-xs text-discord-muted mt-3 font-mono">Scan QR code on the right to send your build energy</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeChannel === 'hall-of-builders' ? (
            <motion.div
              key="hall"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full overflow-y-auto p-6"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white font-display">Hall of Builders</h3>
                <p className="text-sm text-discord-muted mt-1">All teams active on the build floor</p>
              </div>
              {Object.entries(teamsByTrack).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-discord-muted">
                  <p className="text-base">No teams checked in yet.</p>
                  <p className="text-xs mt-1">Check-in at the registration desk to appear on the live wall!</p>
                </div>
              ) : (
                Object.entries(teamsByTrack).map(([track, trackTeams]) => (
                  <div key={track} className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-brand-blurple" />
                      <p className="text-xs font-bold text-discord-muted uppercase tracking-wider">{track}</p>
                      <span className="text-xs font-mono bg-discord-panel px-2 py-0.5 rounded text-discord-muted">
                        {trackTeams.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {trackTeams.map((team) => (
                        <motion.div
                          key={team.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                            team.status === 'online'
                              ? 'bg-discord-panel/90 border-discord-border shadow-sm hover:border-brand-blurple/50'
                              : 'bg-discord-panel/30 border-discord-border/40 opacity-70'
                          }`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full border-2 shrink-0 ${
                              team.status === 'online'
                                ? 'bg-brand-online border-brand-online shadow-[0_0_8px_rgba(35,165,90,0.6)]'
                                : 'bg-transparent border-discord-muted'
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">{team.name}</p>
                            <p className="text-xs text-discord-muted truncate">{team.college}</p>
                          </div>
                          {team.table && (
                            <span className="text-[10px] bg-discord-sidebar border border-discord-border text-discord-muted px-1.5 py-0.5 rounded font-mono shrink-0">
                              {team.table}
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key={activeChannel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full overflow-y-auto p-6 space-y-3"
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-discord-muted text-sm gap-2">
                  <div className="w-12 h-12 rounded-full bg-discord-panel flex items-center justify-center text-xl">
                    💬
                  </div>
                  <p>No messages in #{activeChannel} yet.</p>
                  <p className="text-xs text-discord-muted/70">When automated bots or ops post updates, they will appear here live.</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const authorInfo = botAuthors[msg.author] || { emoji: '📢', color: 'text-white' };
                  return (
                    <motion.div
                      key={msg.id || idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(idx * 0.03, 0.3), duration: 0.3 }}
                      className="flex items-start gap-3 bg-discord-panel/40 hover:bg-discord-panel/70 rounded-lg p-4 border border-transparent hover:border-discord-border/50 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-discord-panel-soft flex items-center justify-center text-sm shrink-0 shadow-sm">
                        {authorInfo.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className={`text-sm font-semibold ${authorInfo.color}`}>{msg.author}</span>
                          <span className="text-xs text-discord-muted font-mono">{msg.timestamp}</span>
                        </div>
                        <p className="text-sm text-discord-text mt-1 whitespace-pre-wrap leading-relaxed font-mono bg-discord-sidebar/50 p-2.5 rounded border border-discord-border/40">
                          {msg.content}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
