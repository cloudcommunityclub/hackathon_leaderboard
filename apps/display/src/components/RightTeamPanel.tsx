import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Team } from '@build-server/shared';
import { QRCodeSVG } from 'qrcode.react';

interface RightTeamPanelProps {
  teams: Team[];
  teamsOnline: number;
  totalTeams: number;
}

const ONLINE_PAGE_SIZE = 6;
const PENDING_PAGE_SIZE = 3;
const ROTATION_INTERVAL_MS = 6500; // Rotate every 6.5 seconds

export function RightTeamPanel({ teams, teamsOnline, totalTeams }: RightTeamPanelProps) {
  const [onlinePage, setOnlinePage] = useState(0);
  const [pendingPage, setPendingPage] = useState(0);

  const waveUrl = import.meta.env.DEV
    ? `http://${window.location.hostname}:3001/wave`
    : `${window.location.origin}/wave`;

  const sortedTeams = [...teams].sort((a, b) => {
    if (a.status === 'online' && b.status !== 'online') return -1;
    if (a.status !== 'online' && b.status === 'online') return 1;
    return a.name.localeCompare(b.name);
  });

  const onlineTeamsList = sortedTeams.filter((t) => t.status === 'online');
  const pendingTeamsList = sortedTeams.filter((t) => t.status !== 'online');

  const totalOnlinePages = Math.max(1, Math.ceil(onlineTeamsList.length / ONLINE_PAGE_SIZE));
  const totalPendingPages = Math.max(1, Math.ceil(pendingTeamsList.length / PENDING_PAGE_SIZE));

  const safeOnlinePage = onlinePage % totalOnlinePages;
  const safePendingPage = pendingPage % totalPendingPages;

  const currentOnlineBatch = onlineTeamsList.slice(
    safeOnlinePage * ONLINE_PAGE_SIZE,
    (safeOnlinePage + 1) * ONLINE_PAGE_SIZE
  );

  const currentPendingBatch = pendingTeamsList.slice(
    safePendingPage * PENDING_PAGE_SIZE,
    (safePendingPage + 1) * PENDING_PAGE_SIZE
  );

  // Auto-rotate pages every 7.5 seconds so all builders get stage visibility
  useEffect(() => {
    const timer = setInterval(() => {
      if (totalOnlinePages > 1) {
        setOnlinePage((prev) => (prev + 1) % totalOnlinePages);
      }
      if (totalPendingPages > 1) {
        setPendingPage((prev) => (prev + 1) % totalPendingPages);
      }
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [totalOnlinePages, totalPendingPages]);

  return (
    <div className="w-60 bg-discord-sidebar border-l border-discord-border flex flex-col shrink-0 select-none z-10 overflow-hidden">
      {/* Member List Scrollable Area */}
      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar px-2 py-4 space-y-5">
        
        {/* ONLINE BUILDERS SECTION (Animated Pagination) */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1.5">
            <h3 className="text-[11px] font-bold text-discord-muted uppercase tracking-wider">
              ONLINE — {onlineTeamsList.length}
            </h3>
            {totalOnlinePages > 1 && (
              <span className="text-[10px] font-mono font-bold text-brand-online bg-brand-online/15 px-1.5 py-0.2 rounded border border-brand-online/30">
                {safeOnlinePage + 1}/{totalOnlinePages}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`online-page-${safeOnlinePage}`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="space-y-0.5"
            >
              {onlineTeamsList.length === 0 ? (
                <p className="text-xs text-discord-muted px-2 py-1 italic">No builders online yet</p>
              ) : (
                currentOnlineBatch.map((team) => (
                  <div
                    key={team.id}
                    className="px-2 py-1.5 rounded-[4px] hover:bg-discord-hover/50 flex items-center gap-2.5 cursor-pointer transition-colors group"
                  >
                    <div className="relative shrink-0">
                      <div className="w-8 h-8 rounded-full bg-brand-blurple/40 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                        {team.name.slice(5, 7)}
                      </div>
                      {/* Exact Discord Green Online Badge */}
                      <span className="w-3.5 h-3.5 bg-brand-online rounded-full border-2 border-discord-sidebar absolute -bottom-0.5 -right-0.5 shadow-sm" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-[#dbdee1] group-hover:text-white truncate leading-tight">
                          {team.name}
                        </p>
                      </div>
                      <p className="text-[10px] text-discord-muted truncate leading-tight mt-0.5">
                        {team.track} · {team.table || 'T1'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* OFFLINE / PENDING ARRIVALS SECTION (Animated Pagination) */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1.5">
            <h3 className="text-[11px] font-bold text-discord-muted uppercase tracking-wider">
              PENDING — {pendingTeamsList.length}
            </h3>
            {totalPendingPages > 1 && (
              <span className="text-[10px] font-mono font-bold text-discord-muted bg-discord-rail px-1.5 py-0.2 rounded">
                {safePendingPage + 1}/{totalPendingPages}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`pending-page-${safePendingPage}`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="space-y-0.5"
            >
              {currentPendingBatch.map((team) => (
                <div
                  key={team.id}
                  className="px-2 py-1.5 rounded-[4px] hover:bg-discord-hover/30 flex items-center gap-2.5 cursor-pointer transition-colors group opacity-60 hover:opacity-100"
                >
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-full bg-discord-rail flex items-center justify-center text-xs font-bold text-discord-muted shadow-inner">
                      {team.name.slice(5, 7)}
                    </div>
                    {/* Offline Grey Badge */}
                    <span className="w-3.5 h-3.5 bg-discord-muted/60 rounded-full border-2 border-discord-sidebar absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-discord-muted group-hover:text-white truncate leading-tight">
                      {team.name}
                    </p>
                    <p className="text-[10px] text-discord-muted/80 truncate leading-tight mt-0.5">
                      {team.college}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Sleek Discord Interactive Widget Box (#232428) */}
      <div className="p-3 border-t border-discord-border/40 bg-discord-userbar shrink-0 flex flex-col items-center shadow-lg">
        <div className="flex items-center justify-between w-full mb-2">
          <span className="text-[11px] font-bold text-discord-muted uppercase tracking-wider">
            📱 LIVE FLOOR REACTIONS
          </span>
          <span className="text-[10px] font-mono bg-brand-online/20 text-brand-online px-1.5 py-0.2 rounded-full font-bold animate-pulse">
            LIVE
          </span>
        </div>

        <div className="w-full bg-white rounded-xl p-2.5 flex flex-col items-center justify-center shadow-md border-2 border-brand-blurple/40 transition-transform hover:scale-[1.02] cursor-pointer">
          <QRCodeSVG
            value={waveUrl}
            size={140}
            level="M"
            includeMargin={false}
            className="w-full h-auto max-w-[140px] max-h-[140px]"
          />
          <p className="text-[10px] font-mono font-extrabold text-slate-800 mt-2 tracking-wider">
            SCAN TO WAVE 👋
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-3 w-full mt-2 text-[10px] text-discord-muted font-semibold">
          <span className="hover:text-white transition-colors">👋 Wave</span>
          <span>·</span>
          <span className="hover:text-white transition-colors">🚀 Ship It</span>
          <span>·</span>
          <span className="hover:text-white transition-colors">🔥 Fire</span>
        </div>
      </div>
    </div>
  );
}
