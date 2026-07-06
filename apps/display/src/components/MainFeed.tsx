import React, { useEffect, useRef, useState } from 'react';
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

// Exact Discord welcome phrase templates
const WELCOME_PHRASES = [
  'just showed up!',
  'joined the party.',
  'is here.',
  'appeared.',
  'just landed.',
  'just slid into the server.',
  'made it!',
  'hop in.',
];

const WAVE_EMOJIS = ['🤖', '🏄', '🤠', '🚀', '🔥', '🍟', '🍕', '🎉', '💩', '😎'];

function getTrackEmoji(track: string): string {
  const t = track.toLowerCase();
  if (t.includes('ai') || t.includes('intelligence') || t.includes('agent')) return '🤖';
  if (t.includes('fin') || t.includes('pay') || t.includes('money') || t.includes('bank')) return '💳';
  if (t.includes('health') || t.includes('med') || t.includes('care') || t.includes('bio')) return '🏥';
  if (t.includes('ed') || t.includes('learn') || t.includes('school') || t.includes('campus')) return '🎓';
  if (t.includes('web3') || t.includes('crypto') || t.includes('chain') || t.includes('deci')) return '🌐';
  if (t.includes('sec') || t.includes('cyber') || t.includes('def') || t.includes('priv')) return '🛡️';
  if (t.includes('green') || t.includes('eco') || t.includes('sus') || t.includes('env')) return '🌱';
  if (t.includes('infra') || t.includes('cloud') || t.includes('dev') || t.includes('net')) return '⚡';
  return '🚀';
}

export function MainFeed({ activeChannel, welcome, teams, messages, onShowCursor }: MainFeedProps) {
  const currentChannel = channels.find((c) => c.id === activeChannel) || channels[0];
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);

  // Find the full team object for the active welcome to retrieve table number
  const welcomeTeam = welcome
    ? teams.find((t) => t.id === welcome.teamId || t.name === welcome.teamName)
    : null;

  // Auto-scroll to bottom whenever teams or messages change
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [teams.length, messages.length, activeChannel, welcome]);

  const teamsByTrack = teams.reduce<Record<string, Team[]>>((acc, team) => {
    acc[team.track] = acc[team.track] || [];
    acc[team.track].push(team);
    return acc;
  }, {});

  const trackNames = Object.keys(teamsByTrack);
  const totalTracks = trackNames.length;
  const safeTrackIdx = totalTracks > 0 ? activeTrackIndex % totalTracks : 0;
  const currentTrackName = trackNames[safeTrackIdx] || 'All Builders';
  const currentTrackTeams = teamsByTrack[currentTrackName] || [];

  // Auto-rotate track showcase every 8 seconds on stage display
  useEffect(() => {
    if (activeChannel !== 'hall-of-builders' || totalTracks <= 1) return;
    const timer = setInterval(() => {
      setActiveTrackIndex((prev) => (prev + 1) % totalTracks);
    }, 8000);
    return () => clearInterval(timer);
  }, [activeChannel, totalTracks]);

  return (
    <div className="flex-1 flex flex-col bg-discord-bg relative min-w-0 select-none z-0 overflow-hidden">
      {/* Top Discord Channel Header */}
      <div className="h-12 border-b border-discord-border px-4 flex items-center justify-between shrink-0 shadow-sm z-10 bg-discord-bg">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-[#80848e] text-xl font-bold leading-none shrink-0">#</span>
          <h2 className="text-base font-bold text-white truncate leading-tight">{currentChannel.name}</h2>
          <div className="h-4 w-px bg-discord-border/80 mx-2 shrink-0 hidden sm:block" />
          <p className="text-xs text-discord-muted truncate hidden sm:block">{currentChannel.description}</p>
        </div>

        {/* Right Header Icons & Search Bar */}
        <div className="flex items-center gap-4 shrink-0 text-discord-muted text-base ml-4">
          <button title="Notifications" className="hover:text-white transition-colors">
            🔔
          </button>
          <button title="Pinned Messages" className="hover:text-white transition-colors">
            📌
          </button>
          <button title="Member List" className="hover:text-white transition-colors text-white">
            👥
          </button>

          {/* Discord Search Bar */}
          <div className="bg-[#1e1f22] text-discord-muted text-xs px-2.5 py-1.5 rounded-[4px] w-48 flex items-center justify-between border border-transparent hover:border-discord-border/80 cursor-pointer shadow-inner">
            <span className="truncate">Search Build Server</span>
            <span className="text-[10px]">🔍</span>
          </div>
        </div>
      </div>

      {/* Main Channel Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar min-h-0 relative">
        
        {/* CELEBRATORY WELCOME MODAL CARD OVERLAY */}
        <AnimatePresence>
          {welcome && (
            <motion.div
              key="welcome-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-md select-none"
            >
              <motion.div
                initial={{ scale: 0.5, y: 60, rotate: -2 }}
                animate={{ scale: 1, y: 0, rotate: 0 }}
                exit={{ scale: 0.8, y: -40, opacity: 0 }}
                transition={{ type: 'spring', damping: 16, stiffness: 220 }}
                className="relative max-w-2xl w-full bg-gradient-to-b from-[#2b2d31] to-[#1e1f22] border-2 border-brand-blurple/60 rounded-3xl p-8 shadow-[0_0_60px_rgba(88,101,242,0.4)] overflow-hidden text-center"
              >
                {/* Background Glows */}
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-brand-blurple/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
                <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-brand-online/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

                {/* Top Badge */}
                <div className="inline-flex items-center gap-2 bg-brand-online/20 border border-brand-online/50 text-brand-online px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase mb-6 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-brand-online animate-ping" />
                  <span>New Builder Arrived</span>
                </div>

                {/* Giant Celebratory Avatar / Icon */}
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-brand-blurple to-indigo-600 flex items-center justify-center text-5xl shadow-xl shadow-brand-blurple/40 border-2 border-white/20 animate-bounce">
                  🤖🚀
                </div>

                {/* Team Name */}
                <h2 className="text-5xl sm:text-6xl font-extrabold text-white font-display tracking-tight mb-3 drop-shadow-md">
                  {welcome.teamName}
                </h2>

                {/* College & Track */}
                <p className="text-xl text-discord-muted font-medium mb-6">
                  {welcome.college} · <span className="text-brand-blurple font-bold">{welcome.track}</span>
                </p>

                {/* Table & CTA Pill */}
                <div className="inline-flex items-center gap-4 bg-[#111214] border border-discord-border px-6 py-3.5 rounded-2xl shadow-inner mb-6">
                  <div className="flex items-center gap-2 border-r border-discord-border/80 pr-4">
                    <span className="text-xs text-discord-muted uppercase font-mono">Table</span>
                    <span className="text-lg font-bold text-white font-mono bg-brand-blurple/30 px-2.5 py-0.5 rounded border border-brand-blurple/50">
                      {welcomeTeam?.table || 'T1'}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <span>📱</span>
                    <span>{welcome.ctaLabel || 'Scan QR on the right to wave hello! 👋'}</span>
                  </div>
                </div>

                {/* Footer text */}
                <p className="text-xs text-discord-muted font-mono tracking-wide">
                  → Adding permanent entry to #arrivals chat log...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome Banner / Channel Intro */}
        <div className="mb-6 pb-6 border-b border-discord-border/40">
          <div className="w-16 h-16 rounded-full bg-discord-sidebar flex items-center justify-center text-3xl mb-3 shadow-md border border-discord-border/60">
            #
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome to #{currentChannel.name}!</h1>
          <p className="text-sm text-discord-muted mt-1">
            This is the start of the #{currentChannel.name} channel. {currentChannel.description}.
          </p>
        </div>

        <AnimatePresence mode="popLayout">
          {activeChannel === 'arrivals' ? (
            /* EXACT DISCORD WELCOME TO SERVER STYLE (#arrivals) */
            <div className="space-y-3">
              {teams.length === 0 ? (
                <div className="text-center py-12 text-discord-muted text-sm">
                  Waiting for teams to check in at the venue scanner...
                </div>
              ) : (
                teams.map((team, idx) => {
                  const phrase = WELCOME_PHRASES[idx % WELCOME_PHRASES.length];
                  const emoji = WAVE_EMOJIS[idx % WAVE_EMOJIS.length];
                  const isLatestWelcome = welcome && (welcome.teamId === team.id || welcome.teamName === team.name);
                  const dateStr = team.checkedInAt
                    ? new Date(team.checkedInAt).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : '06/07/2026, 09:30';

                  return (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors group ${
                        isLatestWelcome && welcome
                          ? 'bg-brand-online/15 border border-brand-online/40 shadow-lg shadow-brand-online/5'
                          : 'hover:bg-discord-hover/40'
                      }`}
                    >
                      {/* Green Arrow Icon (Exact Discord Style) */}
                      <div className="w-8 flex items-center justify-center pt-0.5 shrink-0">
                        <span className="text-brand-online text-xl font-bold font-mono">→</span>
                      </div>

                      {/* Welcome Message Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline flex-wrap gap-x-2">
                          <span className="text-sm font-bold text-white hover:underline cursor-pointer">
                            {team.name}
                          </span>
                          <span className="text-sm text-discord-text">{phrase}</span>
                          <span className="text-xs text-discord-muted font-mono">{dateStr}</span>
                        </div>

                        {/* Discord Wave Button Pill */}
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => {}}
                            className="bg-discord-sidebar border border-[#3f4147] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#dbdee1] hover:bg-discord-hover hover:text-white hover:border-discord-muted transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                          >
                            <span className="text-base">{emoji}</span>
                            <span>Wave to say hi!</span>
                          </button>

                          {/* Simulated Live Floor Reactions */}
                          {idx % 3 === 0 && (
                            <div className="inline-flex items-center gap-1.5 bg-discord-sidebar/80 border border-discord-border px-2.5 py-1 rounded-full text-xs text-discord-text shadow-inner">
                              <span>👋</span>
                              <span className="font-bold text-[11px] text-brand-blurple">
                                {(idx * 7) % 30 + 3}
                              </span>
                            </div>
                          )}
                          {idx % 4 === 0 && (
                            <div className="inline-flex items-center gap-1.5 bg-discord-sidebar/80 border border-discord-border px-2.5 py-1 rounded-full text-xs text-discord-text shadow-inner">
                              <span>🔥</span>
                              <span className="font-bold text-[11px] text-orange-400">
                                {(idx * 11) % 40 + 5}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Special Wumpus Sticker Reply for the Latest Arrival */}
                        {isLatestWelcome && welcome && (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mt-3 bg-discord-sidebar/90 border border-brand-online/30 rounded-xl p-3 inline-flex items-center gap-3 shadow-md"
                          >
                            <span className="text-3xl animate-bounce">🤖👋</span>
                            <div>
                              <p className="text-xs font-bold text-brand-online uppercase tracking-wider">
                                Live Check-In Alert
                              </p>
                              <p className="text-sm text-white font-medium">
                                Table {welcomeTeam?.table || 'T1'} · {welcome.track}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          ) : activeChannel === 'hall-of-builders' ? (
            /* HALL OF BUILDERS SHOWCASE WALL */
            <div className="space-y-6 pb-8">
              {/* Hero Showcase Banner */}
              <div className="bg-gradient-to-r from-brand-blurple/20 via-discord-sidebar to-discord-bg border border-brand-blurple/30 rounded-2xl p-6 flex items-center justify-between shadow-lg">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-2xl">🏛️</span>
                    <h2 className="text-xl font-bold font-display text-white tracking-tight">
                      The Hall of Builders Showcase
                    </h2>
                  </div>
                  <p className="text-sm text-discord-muted max-w-2xl">
                    Spotlighting elite engineering teams across innovation tracks building the future of digital India.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-5 bg-discord-sidebar/80 border border-discord-border px-5 py-3 rounded-xl shadow-inner shrink-0">
                  <div className="text-center">
                    <p className="text-[10px] font-mono text-discord-muted uppercase font-bold">Total Teams</p>
                    <p className="text-xl font-extrabold font-mono text-white leading-none mt-1">{teams.length}</p>
                  </div>
                  <div className="w-px h-8 bg-discord-border" />
                  <div className="text-center">
                    <p className="text-[10px] font-mono text-discord-muted uppercase font-bold">Online Now</p>
                    <p className="text-xl font-extrabold font-mono text-brand-online leading-none mt-1">
                      {teams.filter((t) => t.status === 'online').length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Track Navigation Tabs */}
              <div className="flex items-center gap-2.5 flex-wrap pb-4 border-b border-discord-border/60">
                {trackNames.map((track, idx) => {
                  const isSelected = idx === safeTrackIdx;
                  return (
                    <button
                      key={track}
                      onClick={() => setActiveTrackIndex(idx)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer select-none ${
                        isSelected
                          ? 'bg-brand-blurple text-white shadow-lg shadow-brand-blurple/30 scale-[1.03] border-2 border-white/20'
                          : 'bg-discord-sidebar text-discord-muted hover:bg-discord-hover hover:text-white border border-discord-border'
                      }`}
                    >
                      <span className="text-base">{getTrackEmoji(track)}</span>
                      <span className="tracking-wide">{track}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                          isSelected ? 'bg-black/30 text-white font-extrabold' : 'bg-black/20 text-discord-muted'
                        }`}
                      >
                        {teamsByTrack[track]?.length || 0}
                      </span>
                    </button>
                  );
                })}
                <div className="ml-auto flex items-center gap-2 text-xs font-mono font-semibold text-brand-online bg-brand-online/10 px-3.5 py-1.5 rounded-full border border-brand-online/30 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-brand-online animate-pulse" />
                  <span>Cycling Tracks ({safeTrackIdx + 1}/{totalTracks || 1})</span>
                </div>
              </div>

              {/* Animated Grid of Builders for Active Track */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTrackName}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  {currentTrackTeams.map((team) => {
                    const isOnline = team.status === 'online';
                    return (
                      <div
                        key={team.id}
                        className={`rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between relative group overflow-hidden ${
                          isOnline
                            ? 'bg-discord-sidebar border-discord-border hover:border-brand-blurple/60 shadow-md hover:shadow-xl hover:-translate-y-0.5 text-white'
                            : 'bg-discord-sidebar/40 border-discord-border/40 opacity-75 hover:opacity-100 text-discord-muted'
                        }`}
                      >
                        {/* Top Card Header: Avatar + Table Pill */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative shrink-0">
                              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-blurple to-indigo-600 flex items-center justify-center text-sm font-extrabold text-white shadow-inner font-display">
                                {team.name.slice(5, 7)}
                              </div>
                              {isOnline ? (
                                <span className="w-3.5 h-3.5 rounded-full bg-brand-online border-2 border-discord-sidebar absolute -bottom-0.5 -right-0.5 shadow-sm animate-pulse" />
                              ) : (
                                <span className="w-3.5 h-3.5 rounded-full bg-discord-muted/60 border-2 border-discord-sidebar absolute -bottom-0.5 -right-0.5" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-bold text-white group-hover:text-brand-blurple transition-colors leading-snug truncate">
                                {team.name}
                              </h3>
                              <p className="text-[11px] text-discord-muted truncate leading-tight mt-0.5">
                                {team.college}
                              </p>
                            </div>
                          </div>

                          {team.table && (
                            <span className="text-xs bg-discord-bg/90 border border-discord-border text-slate-300 px-2.5 py-1 rounded-lg font-mono font-bold shrink-0 shadow-sm">
                              {team.table}
                            </span>
                          )}
                        </div>

                        {/* Bottom Card Footer: Track Badge + Status Pill */}
                        <div className="pt-3 border-t border-discord-border/40 flex items-center justify-between text-[11px]">
                          <span className="text-discord-muted font-medium flex items-center gap-1.5 truncate">
                            <span>{getTrackEmoji(team.track)}</span>
                            <span className="truncate">{team.track}</span>
                          </span>
                          {isOnline ? (
                            <span className="font-mono font-bold text-brand-online bg-brand-online/15 px-2 py-0.5 rounded border border-brand-online/30">
                              ONLINE
                            </span>
                          ) : (
                            <span className="font-mono text-discord-muted bg-discord-bg px-2 py-0.5 rounded">
                              ARRIVED
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            /* STANDARD CHANNEL MESSAGES */
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-discord-muted text-sm">
                  No automated activity in #{activeChannel} yet. Stay tuned!
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const authorInfo = botAuthors[msg.author] || { emoji: '🤖', color: 'text-white' };
                  return (
                    <motion.div
                      key={msg.id || idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-discord-hover/40 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-discord-sidebar flex items-center justify-center text-lg shrink-0 shadow-sm border border-discord-border/60">
                        {authorInfo.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className={`text-sm font-bold ${authorInfo.color} hover:underline cursor-pointer`}>
                            {msg.author}
                          </span>
                          <span className="text-[10px] bg-brand-blurple text-white font-bold px-1 py-0.2 rounded uppercase tracking-wider">
                            BOT
                          </span>
                          <span className="text-xs text-discord-muted font-mono">{msg.timestamp}</span>
                        </div>
                        <p className="text-sm text-discord-text mt-1 whitespace-pre-wrap leading-relaxed font-mono bg-discord-sidebar/60 p-3 rounded-md border border-discord-border/50">
                          {msg.content}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </AnimatePresence>
        
        {/* Invisible scroll target */}
        <div ref={chatBottomRef} />
      </div>

      {/* Bottom Discord Message Input Box (#383a40) */}
      <div className="px-4 pb-6 pt-2 shrink-0 bg-discord-bg select-none">
        <div className="bg-discord-input h-11 rounded-lg px-4 flex items-center gap-3 text-discord-muted shadow-inner border border-transparent hover:border-discord-border/60 transition-colors">
          <div className="w-6 h-6 rounded-full bg-[#4e5058] text-discord-bg flex items-center justify-center font-bold text-sm hover:bg-white cursor-pointer transition-colors shrink-0">
            +
          </div>
          <span className="flex-1 text-sm truncate text-[#80848e] cursor-text">
            Message #{currentChannel.name}
          </span>
          <div className="flex items-center gap-3 text-lg cursor-pointer shrink-0">
            <span title="Upgrade your server to use emojis" className="hover:text-white transition-colors">🎁</span>
            <span title="Open GIF picker" className="hover:text-white transition-colors text-xs font-bold bg-[#4e5058] text-white px-1.5 py-0.5 rounded">GIF</span>
            <span title="Open Sticker picker" className="hover:text-white transition-colors">😊</span>
            <span title="Select Emoji" className="hover:text-white transition-colors">🙂</span>
          </div>
        </div>
      </div>
    </div>
  );
}
