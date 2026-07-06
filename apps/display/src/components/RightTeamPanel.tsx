import { Team } from '@build-server/shared';
import { QRCodeSVG } from 'qrcode.react';

interface RightTeamPanelProps {
  teams: Team[];
  teamsOnline: number;
  totalTeams: number;
}

export function RightTeamPanel({ teams, teamsOnline, totalTeams }: RightTeamPanelProps) {
  // Construct a dynamic wave URL based on the current host so mobile phones can scan it from TV screens
  const waveUrl = import.meta.env.DEV
    ? `http://${window.location.hostname}:3000/wave`
    : `${window.location.origin}/wave`;

  // Sort teams so online builders are at the top, followed by pending
  const sortedTeams = [...teams].sort((a, b) => {
    if (a.status === 'online' && b.status !== 'online') return -1;
    if (a.status !== 'online' && b.status === 'online') return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="w-[24%] bg-discord-sidebar border-l border-discord-border flex flex-col min-w-[240px] shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-discord-border shrink-0">
        <h3 className="text-sm font-semibold text-white flex items-center justify-between">
          <span>Online Builders</span>
          <span className="text-xs font-mono bg-brand-online/20 text-brand-online px-2 py-0.5 rounded-full">
            {teamsOnline} / {totalTeams}
          </span>
        </h3>
        <p className="text-xs text-discord-muted mt-1">Live check-in floor status</p>
      </div>

      {/* Full Team List (No Slicing!) */}
      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
        <div className="p-3 space-y-1">
          {sortedTeams.length === 0 ? (
            <div className="text-center py-8 text-xs text-discord-muted">
              No teams registered yet.
            </div>
          ) : (
            sortedTeams.map((team) => (
              <div
                key={team.id}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-colors ${
                  team.status === 'online'
                    ? 'bg-discord-panel/60 hover:bg-discord-panel text-white'
                    : 'hover:bg-discord-panel/40 text-discord-muted opacity-75'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    team.status === 'online'
                      ? 'bg-brand-online shadow-[0_0_6px_rgba(35,165,90,0.8)]'
                      : 'bg-discord-muted/40'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate leading-tight">{team.name}</p>
                  <p className="text-[10px] text-discord-muted truncate leading-tight mt-0.5">{team.college}</p>
                </div>
                {team.table ? (
                  <span className="text-[10px] bg-discord-bg border border-discord-border/60 text-discord-muted px-1.5 py-0.5 rounded font-mono shrink-0">
                    {team.table}
                  </span>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>

      {/* QR Code Wave Section */}
      <div className="p-4 border-t border-discord-border shrink-0 bg-discord-panel/30">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-white">Live Reactions</h3>
          <span className="text-[10px] font-mono uppercase bg-brand-blurple/20 text-brand-blurple px-1.5 py-0.5 rounded font-bold">
            Interactive
          </span>
        </div>
        <p className="text-xs text-discord-muted mb-3">Scan with mobile to wave at builders</p>
        
        <div className="w-full aspect-square bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-lg border-2 border-brand-blurple/30 transition-transform hover:scale-[1.02]">
          <QRCodeSVG
            value={waveUrl}
            size={160}
            level="M"
            includeMargin={false}
            className="w-full h-auto max-w-[160px] max-h-[160px]"
          />
          <p className="text-[10px] font-mono font-bold text-slate-800 mt-2.5 tracking-wider">
            SCAN TO SAY HI 👋
          </p>
        </div>
        <p className="text-[10px] text-discord-muted mt-2.5 text-center flex items-center justify-center gap-2">
          <span>👋 Wave</span>
          <span>·</span>
          <span>🚀 Ship It</span>
          <span>·</span>
          <span>🔥 Fire</span>
        </p>
      </div>
    </div>
  );
}
